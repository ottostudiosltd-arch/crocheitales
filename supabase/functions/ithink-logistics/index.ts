// Supabase Edge Function: ithink-logistics
// Phase 6: Official iThink Logistics Server-Side Shipping Adapter
// All credentials (ITHINK_COMPANY_ID, ITHINK_SECRET_KEY, ITHINK_PICKUP_ADDRESS_ID)
// are stored strictly in Supabase server secrets.
// Enforces:
// 1. Order confirmation requirement before shipment generation.
// 2. Strict idempotency / duplicate shipment prevention.
// 3. Safe Mock Mode when credentials are not configured (never fabricates successful shipments).
// 4. Zero secret exposure in client bundles or responses.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ITHINK_API_BASE = "https://manage.ithinklogistics.com/api_v3";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase server environment variables are not configured.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const body = await req.json();
    const { action, orderId, awbCode, pincode, weight, codAmount } = body;

    // Check credentials in server environment
    const companyId = Deno.env.get("ITHINK_COMPANY_ID");
    const secretKey = Deno.env.get("ITHINK_SECRET_KEY");
    const pickupAddressId = Deno.env.get("ITHINK_PICKUP_ADDRESS_ID") || "1";

    const isConfigured = Boolean(companyId && secretKey);

    // --------------------------------------------------------------------------
    // ACTION: check_serviceability
    // --------------------------------------------------------------------------
    if (action === "check_serviceability") {
      if (!pincode) {
        return new Response(
          JSON.stringify({ success: false, error: "Postal code is required for serviceability check." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isConfigured) {
        return new Response(
          JSON.stringify({
            success: true,
            serviceable: true,
            mockMode: true,
            message: "iThink Logistics credentials not configured in Supabase. Serviceability simulated.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const rateRes = await fetch(`${ITHINK_API_BASE}/rate/check.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            api_company_id: companyId,
            api_secret_key: secretKey,
            pickup_pincode: "411001", // Boutique Pune origin
            delivery_pincode: pincode,
            weight: weight || 0.35,
            order_type: "cod",
            cod_amount: codAmount || 999,
          },
        }),
      });

      const rateData = await rateRes.json();
      return new Response(
        JSON.stringify({ success: rateRes.ok, data: rateData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --------------------------------------------------------------------------
    // ACTION: create_shipment
    // --------------------------------------------------------------------------
    if (action === "create_shipment") {
      if (!orderId) {
        return new Response(
          JSON.stringify({ success: false, error: "orderId is required to create a shipment." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 1. Fetch order from database
      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          payment_method,
          subtotal_amount_minor,
          shipping_amount_minor,
          total_amount_minor,
          shipping_address_snapshot,
          customer_notes,
          order_items (
            id,
            title_snapshot,
            quantity,
            price_snapshot_minor,
            total_minor
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderErr || !order) {
        return new Response(
          JSON.stringify({ success: false, error: `Order ${orderId} not found.` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 2. Enforce Order Confirmation rule (Phase 3 & Phase 6 requirement)
      if (order.status === "pending_confirmation" || order.status === "cancelled") {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Shipment creation blocked: Order #${order.order_number} is currently in '${order.status}' status. An order must be confirmed by customer on WhatsApp before generating a shipment.`,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 3. Enforce Idempotency / Prevent Duplicate Shipment Creation
      const { data: existingShipment } = await supabaseAdmin
        .from("shipping_shipments")
        .select("id, awb_code, courier_name, tracking_status, shipping_label_url")
        .eq("order_id", orderId)
        .maybeSingle();

      if (existingShipment) {
        return new Response(
          JSON.stringify({
            success: true,
            isDuplicate: true,
            message: "A shipment has already been created for this order.",
            shipment: existingShipment,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 4. Safe Mock Mode Check: Never fabricate a successful shipment if secrets missing
      if (!isConfigured) {
        return new Response(
          JSON.stringify({
            success: false,
            mockMode: true,
            error: "iThink Logistics credentials (ITHINK_COMPANY_ID, ITHINK_SECRET_KEY) are not configured in Supabase secrets.",
            requirements: [
              "ITHINK_COMPANY_ID: Found in iThink Logistics Dashboard -> Settings -> API Keys",
              "ITHINK_SECRET_KEY: Found in iThink Logistics Dashboard -> Settings -> API Keys",
              "ITHINK_PICKUP_ADDRESS_ID: Pickup warehouse address ID configured in iThink Logistics",
            ],
            hint: "Store credentials in Supabase project secrets via CLI: supabase secrets set ITHINK_COMPANY_ID=... ITHINK_SECRET_KEY=...",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 5. Build official iThink Logistics payload
      const addr = order.shipping_address_snapshot as any;
      const codRupees = Math.round((order.total_amount_minor || 0) / 100);

      const productsPayload = (order.order_items || []).map((item: any) => ({
        product_name: item.title_snapshot,
        product_sku: `CT-${item.id ? item.id.substring(0, 8) : "ITEM"}`,
        product_quantity: item.quantity,
        product_price: Math.round((item.price_snapshot_minor || 0) / 100),
      }));

      const ithinkOrderPayload = {
        data: {
          api_company_id: companyId,
          api_secret_key: secretKey,
          order_details: [
            {
              order_number: order.order_number,
              order_date: new Date().toISOString().slice(0, 10),
              total_amount: codRupees,
              payment_type: "COD",
              cod_amount: codRupees,
              pickup_address_id: pickupAddressId,
              consignee_name: addr.fullName,
              consignee_phone: addr.phone,
              consignee_email: addr.email || "customer@crochietales.in",
              consignee_address: addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : ""),
              consignee_city: addr.city,
              consignee_state: addr.state,
              consignee_pincode: addr.postalCode,
              products: productsPayload,
              weight: 0.35, // default handmade parcel weight (kg)
              dimensions: {
                length: 15,
                width: 15,
                height: 10,
              },
            },
          ],
        },
      };

      // 6. Invoke iThink Logistics order creation API
      const createRes = await fetch(`${ITHINK_API_BASE}/order/add.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ithinkOrderPayload),
      });

      const createData = await createRes.json();

      if (!createRes.ok || createData.status !== "success") {
        const errorDesc = createData.message || createData.remark || "Failed to create shipment in iThink Logistics.";
        return new Response(
          JSON.stringify({ success: false, error: errorDesc, raw: createData }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract generated shipment information
      const shipmentRecord = createData.data?.[order.order_number] || createData.data?.[0] || {};
      const awb = shipmentRecord.waybill || shipmentRecord.awb_number || null;
      const courierName = shipmentRecord.courier_name || "iThink Partner Courier";
      const shipmentId = shipmentRecord.shipment_id || null;
      const ithinkOrderId = shipmentRecord.order_id || null;

      // 7. Persist shipment into shipping_shipments table
      const { data: newShipment, error: insertShipmentErr } = await supabaseAdmin
        .from("shipping_shipments")
        .insert({
          order_id: order.id,
          provider: "ithink_logistics",
          ithink_order_id: String(ithinkOrderId),
          ithink_shipment_id: String(shipmentId),
          awb_code: awb,
          courier_name: courierName,
          tracking_status: "manifest_generated",
          current_status_code: "MANIFEST",
          current_status_description: "Manifest created on iThink Logistics. Awaiting courier pickup.",
          cod_amount_minor: order.total_amount_minor,
          cod_remittance_status: "pending",
          raw_response_metadata: createData,
        })
        .select()
        .single();

      if (insertShipmentErr) {
        console.error("[ithink-logistics] Failed to record shipment:", insertShipmentErr);
      }

      // 8. Update order status to 'processing' (or 'shipped' if awb assigned immediately)
      await supabaseAdmin
        .from("orders")
        .update({
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      // Record timeline history
      await supabaseAdmin
        .from("order_status_history")
        .insert({
          order_id: order.id,
          status: "processing",
          notes: `iThink Logistics shipment initiated. Courier: ${courierName}${awb ? `, AWB: ${awb}` : ""}.`,
        });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Shipment created successfully with iThink Logistics.",
          shipment: newShipment,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --------------------------------------------------------------------------
    // ACTION: track_shipment
    // --------------------------------------------------------------------------
    if (action === "track_shipment") {
      if (!awbCode) {
        return new Response(
          JSON.stringify({ success: false, error: "awbCode is required for tracking." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isConfigured) {
        return new Response(
          JSON.stringify({
            success: true,
            mockMode: true,
            message: "iThink credentials not configured in Supabase. Live tracking requires active account keys.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const trackRes = await fetch(`${ITHINK_API_BASE}/order/track.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            api_company_id: companyId,
            api_secret_key: secretKey,
            awb_number: awbCode,
          },
        }),
      });

      const trackData = await trackRes.json();
      return new Response(
        JSON.stringify({ success: trackRes.ok, tracking: trackData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: `Unsupported action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[ithink-logistics] Server exception:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
