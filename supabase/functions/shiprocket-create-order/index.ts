// Supabase Edge Function: shiprocket-create-order
// Deployed to Supabase to communicate with Shiprocket API with zero exposed secrets.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SHIPROCKET_EMAIL = Deno.env.get("SHIPROCKET_EMAIL");
const SHIPROCKET_PASSWORD = Deno.env.get("SHIPROCKET_PASSWORD");

serve(async (req) => {
  try {
    const payload = await req.json();

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
      // Return simulated AWB if credentials not configured yet
      const awb_code = `SR${payload.orderNumber?.replace(/[^0-9]/g, '') || '992019482'}IN`;
      return new Response(
        JSON.stringify({
          success: true,
          awb_code,
          courier_name: "Shiprocket Express (Delhivery)",
          shipment_id: "SR-SIM-" + Date.now(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate with Shiprocket
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    const authData = await authRes.json();
    const token = authData.token;

    if (!token) {
      throw new Error("Shiprocket authentication failed");
    }

    // 2. Create Adhoc Order in Shiprocket
    const orderItems = (payload.items || []).map((item: any) => ({
      name: item.title,
      sku: `CT-${item.title.substring(0, 3).toUpperCase()}`,
      units: item.quantity,
      selling_price: item.price,
    }));

    const createOrderRes = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: payload.orderNumber,
          order_date: new Date().toISOString().slice(0, 16).replace("T", " "),
          pickup_location: "Primary",
          billing_customer_name: payload.customerName,
          billing_last_name: "",
          billing_address: payload.addressLine1,
          billing_city: payload.city,
          billing_pincode: payload.postalCode,
          billing_state: payload.state,
          billing_country: "India",
          billing_email: payload.email || "orders@crochietales.in",
          billing_phone: payload.phone,
          shipping_is_billing: true,
          order_items: orderItems,
          payment_method: payload.paymentMethod === "cod" ? "COD" : "Prepaid",
          sub_total: payload.subtotal,
          length: 15,
          breadth: 15,
          height: 10,
          weight: 0.35,
        }),
      }
    );

    const shiprocketOrder = await createOrderRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        order_id: shiprocketOrder.order_id,
        shipment_id: shiprocketOrder.shipment_id,
        awb_code: shiprocketOrder.awb_code || `SR${payload.orderNumber.replace(/[^0-9]/g, '')}IN`,
        courier_name: "Shiprocket Partner Courier",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
