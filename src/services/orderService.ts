import { supabase, majorToMinor } from '../lib/supabase';
import type { CartItem } from '../stores/cartStore';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface PlaceOrderParams {
  customerId?: string | null;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'cod' | 'online';
  shippingAddress: ShippingAddress;
  notes?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}

export async function placeOrder(params: PlaceOrderParams): Promise<PlaceOrderResult> {
  try {
    const orderNumber = `CT-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: orderData, error: orderError } = await (supabase.from('orders') as any)
      .insert({
        order_number: orderNumber,
        customer_id: params.customerId || null,
        status: 'pending',
        payment_status: params.paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_method: params.paymentMethod,
        subtotal_amount_minor: majorToMinor(params.subtotal),
        shipping_amount_minor: majorToMinor(params.shippingFee),
        total_amount_minor: majorToMinor(params.total),
        shipping_address_snapshot: params.shippingAddress as any,
        customer_notes: params.notes || null,
      })
      .select('id, order_number')
      .single();

    if (orderError || !orderData) {
      console.error('Failed to create order in Supabase:', orderError);
      return {
        success: false,
        error: orderError?.message || 'Failed to place order in database',
      };
    }

    // Insert order items
    const orderItemsPayload = params.items.map((item) => {
      // Check if product_id is valid uuid
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

      return {
        order_id: (orderData as any).id,
        product_id: isValidUuid ? item.id : null,
        title_snapshot: item.title,
        price_snapshot_minor: majorToMinor(item.price),
        quantity: item.quantity,
        total_minor: majorToMinor(item.price * item.quantity),
      };
    });

    const { error: itemsError } = await (supabase.from('order_items') as any)
      .insert(orderItemsPayload);

    if (itemsError) {
      console.warn('Order items insert warning:', itemsError);
    }

    return {
      success: true,
      orderNumber: (orderData as any).order_number,
      orderId: (orderData as any).id,
    };
  } catch (err: any) {
    console.error('Error placing order:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected checkout error',
    };
  }
}

/**
 * Fetch orders for the current customer or recent guest orders
 */
export async function fetchUserOrders(customerId?: string) {
  try {
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_method,
        total_amount_minor,
        shipping_amount_minor,
        created_at,
        order_items (
          id,
          title_snapshot,
          price_snapshot_minor,
          quantity,
          total_minor
        )
      `)
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    } else {
      query = query.limit(5);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching orders:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in fetchUserOrders:', err);
    return [];
  }
}

