/**
 * Telegram Instant Order Alert Service for Crochie Tales
 * 
 * Sends a real-time notification to the store owner's phone via Telegram
 * the exact second a customer places a Cash on Delivery (COD) order.
 */

export interface TelegramOrderPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  customerNotes?: string;
}

const STORAGE_KEY_BOT_TOKEN = 'crochie_telegram_bot_token';
const STORAGE_KEY_CHAT_ID = 'crochie_telegram_chat_id';

/**
 * Get active Telegram credentials (from localStorage or environment variables)
 */
export function getTelegramConfig() {
  const envBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  const envChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

  const savedBotToken = localStorage.getItem(STORAGE_KEY_BOT_TOKEN) || '';
  const savedChatId = localStorage.getItem(STORAGE_KEY_CHAT_ID) || '';

  return {
    botToken: savedBotToken || envBotToken,
    chatId: savedChatId || envChatId,
    isConfigured: Boolean((savedBotToken || envBotToken) && (savedChatId || envChatId)),
  };
}

/**
 * Save Telegram credentials directly from the Admin Portal UI
 */
export function saveTelegramConfig(botToken: string, chatId: string) {
  localStorage.setItem(STORAGE_KEY_BOT_TOKEN, botToken.trim());
  localStorage.setItem(STORAGE_KEY_CHAT_ID, chatId.trim());
}

/**
 * Send an alert to the store owner via Telegram Bot API
 */
export async function sendTelegramOrderAlert(payload: TelegramOrderPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const { botToken, chatId, isConfigured } = getTelegramConfig();

    if (!isConfigured) {
      console.log('ℹ️ Telegram alert skipped: Bot Token or Chat ID not configured yet in Admin Settings.');
      return { success: false, error: 'Telegram credentials not configured' };
    }

    const itemsFormatted = payload.items
      .map((item) => `• <b>${item.title}</b> × ${item.quantity} (₹${item.price * item.quantity})`)
      .join('\n');

    const messageHtml = 
`🔔 <b>NEW CROCHIE TALES ORDER!</b> 🧶

📦 <b>Order ID:</b> #${payload.orderNumber}
👤 <b>Customer:</b> ${payload.customerName}
📞 <b>Phone:</b> <a href="tel:${payload.phone}">${payload.phone}</a>
📍 <b>Location:</b> ${payload.city}, ${payload.state} - ${payload.postalCode}
💰 <b>Amount:</b> ₹${payload.total.toLocaleString('en-IN')} (<b>Cash on Delivery</b>)

🛍️ <b>Items:</b>
${itemsFormatted}
${payload.customerNotes ? `\n📝 <b>Note:</b> ${payload.customerNotes}` : ''}

👉 <i>Open Admin Portal to confirm order on WhatsApp:</i>
https://ottostudiosltd-arch.github.io/crocheitales/admin`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description || 'Failed to send Telegram message' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to send Telegram alert:', err);
    return { success: false, error: err?.message || 'Network error sending alert' };
  }
}

/**
 * Send a test ping to verify Telegram connection
 */
export async function testTelegramConnection(botToken: string, chatId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: '🎉 <b>Crochie Tales Telegram Connection Successful!</b>\n\nYou will receive instant notification pings here with customer details whenever a new order is placed. ♡',
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return { success: false, error: data.description || 'Invalid Bot Token or Chat ID' };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Connection test failed' };
  }
}
