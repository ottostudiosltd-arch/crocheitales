/**
 * Telegram Instant Order Alert Service for Crochie Tales
 * 
 * Phase 4 & Phase 7 Architecture:
 * - All Telegram notifications are dispatched via Supabase Edge Function (`telegram-order-alert`).
 * - TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID reside strictly in Supabase server secrets.
 * - Customer street addresses and phone numbers are never transmitted over Telegram.
 * - Frontend code contains zero API tokens or credentials.
 */

import { triggerTelegramOrderAlert, retryTelegramNotification } from './orderService';

export { triggerTelegramOrderAlert, retryTelegramNotification };

/**
 * Dispatch Telegram notification for an order by its ID
 */
export async function sendTelegramOrderAlert(orderId: string): Promise<{ success: boolean; error?: string }> {
  return triggerTelegramOrderAlert(orderId);
}
