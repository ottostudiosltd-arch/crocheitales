/**
 * Official iThink Logistics Shipping Service for Crochie Tales
 * 
 * Phase 6 Architecture:
 * - Direct communication via Supabase Edge Function (`ithink-logistics`).
 * - All provider credentials reside in Supabase server secrets (zero client secrets).
 * - Enforces order confirmation before shipment creation.
 * - Enforces idempotency / duplicate shipment prevention.
 * - Safe Mock Mode active when API credentials are unconfigured (never fabricates successful shipments).
 */

import { supabase } from '../lib/supabase';

export interface CreateShipmentResult {
  success: boolean;
  message?: string;
  error?: string;
  mockMode?: boolean;
  isDuplicate?: boolean;
  requirements?: string[];
  shipment?: {
    id: string;
    awb_code?: string;
    courier_name?: string;
    tracking_status?: string;
    shipping_label_url?: string;
  };
}

export interface TrackingResult {
  success: boolean;
  message?: string;
  error?: string;
  mockMode?: boolean;
  tracking?: any;
}

export interface ServiceabilityResult {
  success: boolean;
  serviceable?: boolean;
  message?: string;
  error?: string;
  mockMode?: boolean;
}

/**
 * Triggers shipment creation for a confirmed order via iThink Logistics Edge Function.
 * Strictly locked if order is pending confirmation or cancelled.
 */
export async function createIThinkShipment(orderId: string): Promise<CreateShipmentResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ithink-logistics', {
      body: {
        action: 'create_shipment',
        orderId,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to communicate with iThink Logistics adapter',
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network exception creating shipment',
    };
  }
}

/**
 * Tracks an active shipment by AWB code via iThink Logistics
 */
export async function trackIThinkShipment(awbCode: string): Promise<TrackingResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ithink-logistics', {
      body: {
        action: 'track_shipment',
        awbCode,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error fetching tracking' };
  }
}

/**
 * Checks serviceability of a destination PIN code
 */
export async function checkIThinkServiceability(pincode: string): Promise<ServiceabilityResult> {
  try {
    const { data, error } = await supabase.functions.invoke('ithink-logistics', {
      body: {
        action: 'check_serviceability',
        pincode,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to check pincode serviceability' };
  }
}

/**
 * Fetches the registered shipment record for an order directly from Supabase
 */
export async function getShipmentForOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('shipping_shipments')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching shipment record:', error);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
