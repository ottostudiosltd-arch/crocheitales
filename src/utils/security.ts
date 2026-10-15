/**
 * Security & Free-Tier Armor for Crochie Tales
 * 
 * Protects against:
 * 1. Checkout spam bots and fake order flooding (Honeypot + Rate Limiting)
 * 2. Supabase API exhaustion and database bloat
 * 3. Brute-force attacks on Admin portal
 * 4. XSS & Malicious string injections
 */

const RATE_LIMIT_CHECKOUT_KEY = 'crochie_rl_checkout';
const ADMIN_LOCKOUT_KEY = 'crochie_admin_lockout';

/**
 * Strips HTML tags, script entities, and control characters to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500); // enforce maximum length
}

/**
 * Validates standard 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9).
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Supports 10 digits or 12 digits (with 91 prefix)
  if (cleaned.length === 10) {
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  }
  return false;
}

/**
 * Validates 6-digit Indian PIN codes.
 */
export function isValidIndianPincode(pincode: string): boolean {
  const cleaned = pincode.replace(/\D/g, '');
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Rate Limiter for Checkout:
 * - Max 3 orders per 10 minutes per browser session.
 * - Minimum 15-second cooldown between submissions.
 */
export function checkCheckoutRateLimit(): { allowed: boolean; message?: string } {
  try {
    const rawData = localStorage.getItem(RATE_LIMIT_CHECKOUT_KEY);
    const now = Date.now();
    let timestamps: number[] = rawData ? JSON.parse(rawData) : [];

    // Filter timestamps within last 10 minutes (600,000 ms)
    timestamps = timestamps.filter((t) => now - t < 600000);

    // Check minimum 15-second gap between submissions
    if (timestamps.length > 0) {
      const lastAttempt = timestamps[timestamps.length - 1];
      const gapSec = Math.ceil((15000 - (now - lastAttempt)) / 1000);
      if (gapSec > 0) {
        return {
          allowed: false,
          message: `Please wait ${gapSec}s before placing another order.`,
        };
      }
    }

    // Check max 3 orders per 10 minutes
    if (timestamps.length >= 3) {
      return {
        allowed: false,
        message: 'Order frequency limit reached. Please wait a few minutes before placing another order.',
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/**
 * Record a successful or attempted order submission.
 */
export function recordCheckoutAttempt(): void {
  try {
    const rawData = localStorage.getItem(RATE_LIMIT_CHECKOUT_KEY);
    const now = Date.now();
    let timestamps: number[] = rawData ? JSON.parse(rawData) : [];
    timestamps = timestamps.filter((t) => now - t < 600000);
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_CHECKOUT_KEY, JSON.stringify(timestamps));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Admin Login Brute-force Shield:
 * - Max 5 failed attempts allowed.
 * - Locks out for 3 minutes (180,000 ms) if exceeded.
 */
interface AdminLockoutData {
  attempts: number;
  lockedUntil?: number;
}

export function checkAdminLockout(): { locked: boolean; remainingSec: number } {
  try {
    const raw = sessionStorage.getItem(ADMIN_LOCKOUT_KEY);
    if (!raw) return { locked: false, remainingSec: 0 };

    const data: AdminLockoutData = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && data.lockedUntil > now) {
      const remainingSec = Math.ceil((data.lockedUntil - now) / 1000);
      return { locked: true, remainingSec };
    }

    return { locked: false, remainingSec: 0 };
  } catch {
    return { locked: false, remainingSec: 0 };
  }
}

export function recordFailedAdminAttempt(): { locked: boolean; remainingAttempts: number } {
  try {
    const raw = sessionStorage.getItem(ADMIN_LOCKOUT_KEY);
    const data: AdminLockoutData = raw ? JSON.parse(raw) : { attempts: 0 };
    data.attempts += 1;

    if (data.attempts >= 5) {
      data.lockedUntil = Date.now() + 180000; // 3 minute lockout
      sessionStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(data));
      return { locked: true, remainingAttempts: 0 };
    }

    sessionStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(data));
    return { locked: false, remainingAttempts: 5 - data.attempts };
  } catch {
    return { locked: false, remainingAttempts: 3 };
  }
}

export function resetAdminAttempts(): void {
  try {
    sessionStorage.removeItem(ADMIN_LOCKOUT_KEY);
  } catch {
    // Ignore
  }
}
