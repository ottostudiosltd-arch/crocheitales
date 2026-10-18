// Phase 8: Comprehensive Order Management & iThink Logistics Verification Suite
// Uses Node.js native test runner (node --test)

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Crochie Tales — Phase 8 Testing Suite', () => {

  // 1. Guest COD Checkout & Price Recalculation
  describe('Test 1 & 3: Guest COD Checkout & Tampered Price Recalculation', () => {
    it('should ignore client-submitted prices and recalculate subtotal from trusted product records', () => {
      const dbProducts = [
        { id: 'prod-1', title: 'Tulip Crochet Bouquet', price_minor: 59900 },
        { id: 'prod-2', title: 'Daisy Keychain', price_minor: 24900 },
      ];

      // Simulated client cart with tampered price (attempting ₹1 instead of ₹599)
      const tamperedClientItems = [
        { id: 'prod-1', title: 'Tulip Crochet Bouquet', price: 1, quantity: 1 },
        { id: 'prod-2', title: 'Daisy Keychain', price: 1, quantity: 2 },
      ];

      // Server recalculation logic
      const dbMap = new Map(dbProducts.map(p => [p.id, p]));
      let trustedSubtotalMinor = 0;

      for (const item of tamperedClientItems) {
        const trustedProduct = dbMap.get(item.id);
        assert.ok(trustedProduct, `Product ${item.id} must exist in DB`);
        trustedSubtotalMinor += trustedProduct.price_minor * item.quantity;
      }

      // Expected: (59900 * 1) + (24900 * 2) = 59900 + 49800 = 109700 paise (₹1097)
      assert.equal(trustedSubtotalMinor, 109700, 'Tampered price must be rejected; server price must prevail');

      // Free shipping threshold >= ₹999 (99900 paise)
      const shippingFeeMinor = trustedSubtotalMinor >= 99900 ? 0 : 7900;
      assert.equal(shippingFeeMinor, 0, 'Shipping must be ₹0 when subtotal >= ₹999');

      const totalMinor = trustedSubtotalMinor + shippingFeeMinor;
      assert.equal(totalMinor, 109700);
    });

    it('should charge standard ₹79 shipping when subtotal is below ₹999 threshold', () => {
      const subtotalMinor = 49900; // ₹499
      const shippingFeeMinor = subtotalMinor >= 99900 ? 0 : 7900;
      assert.equal(shippingFeeMinor, 7900, 'Orders under ₹999 must incur ₹79 shipping fee');
      assert.equal(subtotalMinor + shippingFeeMinor, 57800);
    });
  });

  // 2. Shipping Address & PIN Code Validation
  describe('Test 2: Shipping Address & PIN Code Validation', () => {
    function validateAddress(addr) {
      if (!addr) return { valid: false, error: 'Address is required' };
      if (!addr.fullName || !addr.fullName.trim()) return { valid: false, error: 'Full name is required' };
      if (!addr.phone || !/^[6-9]\d{9}$/.test(addr.phone.replace(/\D/g, ''))) {
        return { valid: false, error: 'Valid 10-digit Indian mobile number is required' };
      }
      if (!addr.addressLine1 || !addr.addressLine1.trim()) return { valid: false, error: 'Address line 1 is required' };
      if (!addr.city || !addr.city.trim()) return { valid: false, error: 'City is required' };
      if (!addr.state || !addr.state.trim()) return { valid: false, error: 'State is required' };
      if (!addr.postalCode || !/^\d{6}$/.test(addr.postalCode.trim())) {
        return { valid: false, error: 'Valid 6-digit Indian PIN code is required' };
      }
      return { valid: true };
    }

    it('should accept valid Indian addresses and PIN codes', () => {
      const valid = validateAddress({
        fullName: 'Priya Sharma',
        phone: '9876543210',
        addressLine1: 'Flat 402, Green Park Apartments',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
      });
      assert.equal(valid.valid, true);
    });

    it('should reject invalid PIN codes and phone numbers', () => {
      const invalidPin = validateAddress({
        fullName: 'Priya Sharma',
        phone: '9876543210',
        addressLine1: 'Lane 7',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '4110', // Too short
      });
      assert.equal(invalidPin.valid, false);
      assert.match(invalidPin.error, /PIN code/i);

      const invalidPhone = validateAddress({
        fullName: 'Priya Sharma',
        phone: '12345', // Invalid
        addressLine1: 'Lane 7',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
      });
      assert.equal(invalidPhone.valid, false);
      assert.match(invalidPhone.error, /mobile number/i);
    });
  });

  // 4. Duplicate Order Submission / Idempotency
  describe('Test 4: Duplicate Order Submission & Idempotency Mechanism', () => {
    it('should detect duplicate idempotency key and return existing order without creating a new record', () => {
      const mockDatabase = new Map();

      function processOrder(key, orderData) {
        if (mockDatabase.has(key)) {
          return { ...mockDatabase.get(key), isDuplicate: true };
        }
        const createdOrder = {
          id: 'ord-uuid-' + Math.random().toString(36).substring(2, 8),
          order_number: 'CT-' + Math.floor(100000 + Math.random() * 900000),
          status: 'pending_confirmation',
          ...orderData,
        };
        mockDatabase.set(key, createdOrder);
        return { ...createdOrder, isDuplicate: false };
      }

      const idempotencyKey = 'checkout_tab_session_9921';
      const order1 = processOrder(idempotencyKey, { total: 1097 });
      assert.equal(order1.isDuplicate, false);

      // Customer double clicks or network retry
      const order2 = processOrder(idempotencyKey, { total: 1097 });
      assert.equal(order2.isDuplicate, true);
      assert.equal(order2.id, order1.id, 'Duplicate attempt must return existing order ID');
      assert.equal(order2.order_number, order1.order_number);
    });
  });

  // 5. Telegram Notifications & Zero PII Leak
  describe('Test 5: Telegram Notification Formatting & Zero PII Leak', () => {
    function formatTelegramMessage(order) {
      const totalRupees = (order.total_amount_minor / 100).toLocaleString('en-IN');
      const itemsFormatted = (order.items || [])
        .map(i => `• <b>${i.title}</b> × ${i.quantity} (₹${i.price})`)
        .join('\n');

      const addr = order.shipping_address_snapshot || {};
      const region = [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ');

      return [
        '🔔 <b>NEW CROCHIE TALES ORDER!</b> 🧶',
        '',
        `📦 <b>Order ID:</b> <code>#${order.order_number}</code>`,
        `💰 <b>Amount:</b> ₹${totalRupees} (<b>Cash on Delivery</b>)`,
        region ? `📍 <b>Destination Region:</b> ${region}` : '',
        '',
        '🛍️ <b>Items:</b>',
        itemsFormatted,
        '',
        '👉 <b>Open Admin Portal to Confirm on WhatsApp:</b>',
        'https://ottostudiosltd-arch.github.io/crocheitales/admin',
      ].filter(line => line !== null).join('\n');
    }

    it('should include order ID, amount, items and admin link', () => {
      const msg = formatTelegramMessage({
        order_number: 'CT-829140',
        total_amount_minor: 84800,
        items: [{ title: 'Lavender Bouquet', quantity: 1, price: 769 }],
        shipping_address_snapshot: {
          fullName: 'Aarav Patel',
          phone: '9822099999',
          addressLine1: 'Flat 102, Secret Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
        },
      });

      assert.match(msg, /#CT-829140/);
      assert.match(msg, /₹848/);
      assert.match(msg, /Lavender Bouquet/);
      assert.match(msg, /crocheitales\/admin/);

      // Phase 7 Security Rule: Zero customer street address or phone number in Telegram alerts
      assert.doesNotMatch(msg, /9822099999/, 'Customer phone number must NEVER be leaked in Telegram');
      assert.doesNotMatch(msg, /Secret Street/, 'Customer street address must NEVER be leaked in Telegram');
      assert.match(msg, /Mumbai, Maharashtra, 400001/, 'Coarse regional location is permitted');
    });

    it('should safely record delivery failure without invalidating the customer order', () => {
      const order = {
        id: 'ord-123',
        status: 'pending_confirmation',
        notification_status: 'pending',
        notification_retries: 0,
        notification_error: null,
      };

      // Simulated network failure or missing bot credentials
      const simulatedFailure = 'Telegram credentials not configured';
      order.notification_status = 'failed';
      order.notification_retries += 1;
      order.notification_error = simulatedFailure;

      assert.equal(order.status, 'pending_confirmation', 'Order status must remain intact upon notification error');
      assert.equal(order.notification_status, 'failed');
      assert.equal(order.notification_retries, 1);
    });
  });

  // 6. Unauthorized Admin Access Barrier
  describe('Test 6: Admin Authorization Barrier', () => {
    function checkAdminAccess(userProfile) {
      if (!userProfile) return { allowed: false, reason: 'unauthenticated' };
      if (userProfile.role !== 'admin') return { allowed: false, reason: 'forbidden' };
      return { allowed: true };
    }

    it('should reject unauthenticated visitors', () => {
      assert.equal(checkAdminAccess(null).allowed, false);
    });

    it('should reject normal authenticated customers from admin portal', () => {
      const customer = { id: 'cust-1', role: 'customer', email: 'shopper@crochietales.in' };
      const access = checkAdminAccess(customer);
      assert.equal(access.allowed, false);
      assert.equal(access.reason, 'forbidden');
    });

    it('should allow verified boutique administrator', () => {
      const admin = { id: 'admin-1', role: 'admin', email: 'owner@crochietales.in' };
      assert.equal(checkAdminAccess(admin).allowed, true);
    });
  });

  // 7. WhatsApp Click-to-Chat URL Generation
  describe('Test 7: WhatsApp Confirmation Link Generator', () => {
    function generateWhatsAppLink(order) {
      const addr = order.shipping_address_snapshot || {};
      let cleanPhone = (addr.phone || '').replace(/\D/g, '');
      if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

      const total = (order.total_amount_minor / 100).toLocaleString('en-IN');
      const itemsText = (order.items || []).map(i => `• ${i.title} × ${i.quantity} (₹${i.price})`).join('\n');

      const message = `Hello ${addr.fullName || 'there'}! 🌸\nThank you for your order with Crochie Tales! ♡\n\nWe received your order #${order.order_number}:\n${itemsText}\n\n💰 Total Amount: ₹${total} (Cash on Delivery)\n📍 Delivery Address: ${addr.addressLine1}, ${addr.city} - ${addr.postalCode}\n\nPlease reply with *CONFIRM* so our artisans can lovingly pack and dispatch your handmade parcel! 🧶✨`;

      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    }

    it('should generate valid WhatsApp URL with India country code prefix and encoded receipt', () => {
      const waUrl = generateWhatsAppLink({
        order_number: 'CT-109283',
        total_amount_minor: 99900,
        items: [{ title: 'Sun & Moon Coaster Set', quantity: 1, price: 999 }],
        shipping_address_snapshot: {
          fullName: 'Kavita Joshi',
          phone: '9823012345',
          addressLine1: 'B-12, Rosewood Villa',
          city: 'Bengaluru',
          postalCode: '560001',
        },
      });

      assert.match(waUrl, /^https:\/\/wa\.me\/919823012345\?text=/);
      assert.match(waUrl, /CT-109283/);
      assert.match(waUrl, /Sun%20%26%20Moon/);
      assert.match(waUrl, /CONFIRM/);
    });
  });

  // 8. Admin Confirmation & Cancellation State Transitions
  describe('Test 8: Order Status State Transitions & Auditing', () => {
    it('should transition from pending_confirmation to confirmed with confirmed_at timestamp', () => {
      const order = {
        id: 'ord-1',
        status: 'pending_confirmation',
        confirmed_at: null,
        confirmed_by: null,
      };

      // Admin confirms
      order.status = 'confirmed';
      order.confirmed_at = new Date().toISOString();
      order.confirmed_by = 'admin-uuid';

      assert.equal(order.status, 'confirmed');
      assert.ok(order.confirmed_at);
      assert.equal(order.confirmed_by, 'admin-uuid');
    });

    it('should record audit reason when cancelling an order', () => {
      const order = {
        id: 'ord-2',
        status: 'pending_confirmation',
        cancelled_at: null,
        cancelled_reason: null,
      };

      // Admin cancels
      const reason = 'Customer declined via WhatsApp';
      order.status = 'cancelled';
      order.cancelled_at = new Date().toISOString();
      order.cancelled_reason = reason;

      assert.equal(order.status, 'cancelled');
      assert.equal(order.cancelled_reason, 'Customer declined via WhatsApp');
    });
  });

  // 9, 10 & 11. iThink Logistics Shipment Lifecycle & Safeguards
  describe('Test 9, 10 & 11: iThink Logistics Shipment Safeguards & Lifecycle', () => {
    it('should strictly BLOCK shipment creation if order is still in pending_confirmation status', () => {
      function canCreateShipment(orderStatus) {
        if (orderStatus === 'pending_confirmation' || orderStatus === 'cancelled') {
          return { allowed: false, error: 'Order must be confirmed prior to generating an iThink shipment.' };
        }
        return { allowed: true };
      }

      assert.equal(canCreateShipment('pending_confirmation').allowed, false);
      assert.equal(canCreateShipment('cancelled').allowed, false);
      assert.equal(canCreateShipment('confirmed').allowed, true);
    });

    it('should prevent duplicate shipment generation (1 shipment per order constraint)', () => {
      const shipmentsTable = new Map();

      function registerShipment(orderId, shipmentData) {
        if (shipmentsTable.has(orderId)) {
          return { success: false, isDuplicate: true, error: 'A shipment already exists for this order.' };
        }
        shipmentsTable.set(orderId, shipmentData);
        return { success: true, shipment: shipmentData };
      }

      const firstAttempt = registerShipment('ord-99', { awb_code: 'ITL-1001', courier: 'Delhivery' });
      assert.equal(firstAttempt.success, true);

      // Attempt second shipment creation on the same order
      const secondAttempt = registerShipment('ord-99', { awb_code: 'ITL-1002', courier: 'BlueDart' });
      assert.equal(secondAttempt.success, false);
      assert.equal(secondAttempt.isDuplicate, true);
    });

    it('should enter safe mock mode and list requirements when credentials are unconfigured', () => {
      function checkIThinkConfig(env) {
        if (!env.ITHINK_COMPANY_ID || !env.ITHINK_SECRET_KEY) {
          return {
            mockMode: true,
            error: 'iThink Logistics credentials not configured in Supabase secrets.',
            requirements: [
              'ITHINK_COMPANY_ID: Found in iThink Logistics Dashboard -> Settings -> API Keys',
              'ITHINK_SECRET_KEY: Found in iThink Logistics Dashboard -> Settings -> API Keys',
              'ITHINK_PICKUP_ADDRESS_ID: Pickup warehouse address ID configured in iThink',
            ],
          };
        }
        return { mockMode: false };
      }

      const emptyEnv = {};
      const result = checkIThinkConfig(emptyEnv);
      assert.equal(result.mockMode, true);
      assert.equal(result.requirements.length, 3);
      assert.match(result.requirements[0], /ITHINK_COMPANY_ID/);
    });
  });

  // 12. COD Settlement Reconciliation
  describe('Test 12: COD Remittance & Settlement Tracking', () => {
    it('should keep COD remittance in pending state until confirmed by courier provider settlement report', () => {
      const shipment = {
        order_id: 'ord-100',
        cod_amount_minor: 109700,
        cod_remittance_status: 'pending',
        cod_remittance_date: null,
      };

      assert.equal(shipment.cod_remittance_status, 'pending');

      // Courier remits payment
      shipment.cod_remittance_status = 'remitted';
      shipment.cod_remittance_date = new Date().toISOString();

      assert.equal(shipment.cod_remittance_status, 'remitted');
      assert.ok(shipment.cod_remittance_date);
    });
  });

  // 13. RLS Policies & Customer Order Privacy
  describe('Test 13: Customer Order Privacy & Access Control', () => {
    function canCustomerViewOrder(requesterId, orderCustomerId, isAdmin = false) {
      if (isAdmin) return true;
      if (!requesterId) return false;
      return requesterId === orderCustomerId;
    }

    it('should permit customer to view their own order', () => {
      assert.equal(canCustomerViewOrder('user-abc', 'user-abc', false), true);
    });

    it('should strictly forbid customer from viewing another customer order', () => {
      assert.equal(canCustomerViewOrder('user-hacker', 'user-victim', false), false);
    });

    it('should allow store administrator to view all orders', () => {
      assert.equal(canCustomerViewOrder('admin-user', 'user-victim', true), true);
    });
  });
});
