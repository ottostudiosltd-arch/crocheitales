// Supabase Edge Function: telegram-order-alert
// Phase 4: Secure server-side Telegram alerts for new orders.
// Secrets (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
// are stored exclusively server-side in Supabase secrets, never exposed to client bundles.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, forceRetry } = await req.json();

    if (!orderId || typeof orderId !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "A valid orderId is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase server environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) not configured.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 2. Fetch order and line item snapshots from database
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_method,
        total_amount_minor,
        subtotal_amount_minor,
        shipping_amount_minor,
        notification_status,
        notification_retries,
        notification_error,
        customer_notes,
        shipping_address_snapshot,
        created_at,
        order_items (
          title_snapshot,
          quantity,
          price_snapshot_minor,
          total_minor
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: `Order ${orderId} not found in database.` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Idempotency Check: Avoid duplicate notifications if already sent, unless explicit admin forceRetry
    if (order.notification_status === "sent" && !forceRetry) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Telegram notification has already been delivered for this order.",
          already_sent: true,
          status: "sent",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Retrieve Telegram credentials securely from server environment
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      const missingError = "Telegram credentials (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID) are not set in Supabase Secrets.";
      console.warn(`[telegram-order-alert] ${missingError}`);

      // Record failure on order record for audit & retry
      await supabaseAdmin
        .from("orders")
        .update({
          notification_status: "failed",
          notification_retries: (order.notification_retries || 0) + 1,
          notification_error: missingError,
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: false,
          error: missingError,
          mockMode: true,
          hint: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID via Supabase dashboard -> Project Settings -> Edge Functions -> Secrets.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Construct safe notification message
    // SECURITY & PRIVACY RULE (Phase 7):
    // Avoid leaking customer street addresses or phone numbers in Telegram notifications.
    const totalRupees = ((order.total_amount_minor || 0) / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    const items = order.order_items || [];
    const itemsFormatted = items.length > 0
      ? items
          .map(
            (item: any) =>
              `• <b>${escapeHtml(item.title_snapshot)}</b> × ${item.quantity} (₹${(
                (item.total_minor || 0) / 100
              ).toLocaleString("en-IN")})`
          )
          .join("\n")
      : "• 1 × Handcrafted Item";

    const shippingSnapshot = (order.shipping_address_snapshot as any) || {};
    // Only include coarse regional location (City, State, Postal Code) - strictly exclude street address & phone
    const regionParts = [
      shippingSnapshot.city,
      shippingSnapshot.state,
      shippingSnapshot.postalCode,
    ].filter(Boolean);
    const regionSummary = regionParts.length > 0 ? regionParts.join(", ") : "India";

    const adminPortalUrl = "https://ottostudiosltd-arch.github.io/crocheitales/admin";

    const messageHtml = [
      "🔔 <b>NEW CROCHIE TALES ORDER!</b> 🧶",
      "",
      `📦 <b>Order ID:</b> <code>#${escapeHtml(order.order_number)}</code>`,
      `💰 <b>Amount:</b> ₹${totalRupees} (<b>Cash on Delivery</b>)`,
      `📍 <b>Destination Region:</b> ${escapeHtml(regionSummary)}`,
      "",
      "🛍️ <b>Items:</b>",
      itemsFormatted,
      "",
      order.customer_notes ? `📝 <b>Customer Note:</b> <i>${escapeHtml(order.customer_notes)}</i>\n` : null,
      "👉 <b>Open Admin Portal to Confirm on WhatsApp:</b>",
      `<a href="${adminPortalUrl}">${adminPortalUrl}</a>`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    // 6. Send payload to official Telegram Bot API
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken.trim()}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: messageHtml,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      const errorMsg = telegramResult.description || `Telegram API error status ${telegramResponse.status}`;
      console.error(`[telegram-order-alert] Telegram API rejection:`, errorMsg);

      await supabaseAdmin
        .from("orders")
        .update({
          notification_status: "failed",
          notification_retries: (order.notification_retries || 0) + 1,
          notification_error: errorMsg,
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Successful delivery: Record in database audit trail
    await supabaseAdmin
      .from("orders")
      .update({
        notification_status: "sent",
        notification_retries: (order.notification_retries || 0) + 1,
        notification_error: null,
      })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Telegram order alert dispatched successfully.",
        message_id: telegramResult.result?.message_id,
        order_number: order.order_number,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[telegram-order-alert] Unhandled server error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
