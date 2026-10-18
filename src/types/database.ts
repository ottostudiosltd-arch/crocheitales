export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending_confirmation' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'online';
export type WorkshopFormat = 'offline' | 'online';
export type WorkshopSessionStatus = 'open' | 'full' | 'completed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          banner_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          banner_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          banner_url?: string | null;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          sku: string | null;
          price_minor: number;
          compare_at_price_minor: number | null;
          stock_quantity: number;
          category_id: string | null;
          is_featured: boolean;
          is_active: boolean;
          tag: string | null;
          short_description: string | null;
          description: string | null;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          sku?: string | null;
          price_minor: number;
          compare_at_price_minor?: number | null;
          stock_quantity?: number;
          category_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          tag?: string | null;
          short_description?: string | null;
          description?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          sku?: string | null;
          price_minor?: number;
          compare_at_price_minor?: number | null;
          stock_quantity?: number;
          category_id?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          tag?: string | null;
          short_description?: string | null;
          description?: string | null;
          rating?: number;
          review_count?: number;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
        Update: {
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          order_number: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: PaymentMethod;
          total_amount_minor: number;
          subtotal_amount_minor: number;
          shipping_amount_minor: number;
          shipping_address_snapshot: Json;
          idempotency_key: string | null;
          customer_notes: string | null;
          confirmed_at: string | null;
          confirmed_by: string | null;
          cancelled_at: string | null;
          cancelled_reason: string | null;
          notification_status: 'pending' | 'sent' | 'failed';
          notification_retries: number;
          notification_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          order_number: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod;
          total_amount_minor: number;
          subtotal_amount_minor: number;
          shipping_amount_minor?: number;
          shipping_address_snapshot: Json;
          idempotency_key?: string | null;
          customer_notes?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          cancelled_at?: string | null;
          cancelled_reason?: string | null;
          notification_status?: 'pending' | 'sent' | 'failed';
          notification_retries?: number;
          notification_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: PaymentMethod;
          total_amount_minor?: number;
          subtotal_amount_minor?: number;
          shipping_amount_minor?: number;
          shipping_address_snapshot?: Json;
          customer_notes?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          cancelled_at?: string | null;
          cancelled_reason?: string | null;
          notification_status?: 'pending' | 'sent' | 'failed';
          notification_retries?: number;
          notification_error?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          title_snapshot: string;
          price_snapshot_minor: number;
          quantity: number;
          total_minor: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          title_snapshot: string;
          price_snapshot_minor: number;
          quantity?: number;
          total_minor: number;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          total_minor?: number;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          notes?: string | null;
        };
      };
      shipping_shipments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          ithink_order_id: string | null;
          ithink_shipment_id: string | null;
          awb_code: string | null;
          courier_id: string | null;
          courier_name: string | null;
          shipping_label_url: string | null;
          manifest_url: string | null;
          tracking_status: string;
          current_status_code: string | null;
          current_status_description: string | null;
          estimated_delivery_date: string | null;
          cod_amount_minor: number;
          cod_remittance_status: 'pending' | 'remitted' | 'reconciled';
          cod_remittance_date: string | null;
          raw_response_metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider?: string;
          ithink_order_id?: string | null;
          ithink_shipment_id?: string | null;
          awb_code?: string | null;
          courier_id?: string | null;
          courier_name?: string | null;
          shipping_label_url?: string | null;
          manifest_url?: string | null;
          tracking_status?: string;
          current_status_code?: string | null;
          current_status_description?: string | null;
          estimated_delivery_date?: string | null;
          cod_amount_minor?: number;
          cod_remittance_status?: 'pending' | 'remitted' | 'reconciled';
          cod_remittance_date?: string | null;
          raw_response_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          provider?: string;
          ithink_order_id?: string | null;
          ithink_shipment_id?: string | null;
          awb_code?: string | null;
          courier_id?: string | null;
          courier_name?: string | null;
          shipping_label_url?: string | null;
          manifest_url?: string | null;
          tracking_status?: string;
          current_status_code?: string | null;
          current_status_description?: string | null;
          estimated_delivery_date?: string | null;
          cod_amount_minor?: number;
          cod_remittance_status?: 'pending' | 'remitted' | 'reconciled';
          cod_remittance_date?: string | null;
          raw_response_metadata?: Json | null;
          updated_at?: string;
        };
      };
      shipment_tracking_events: {
        Row: {
          id: string;
          shipment_id: string;
          status_code: string;
          status_description: string;
          location: string | null;
          event_timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          shipment_id: string;
          status_code: string;
          status_description: string;
          location?: string | null;
          event_timestamp: string;
          created_at?: string;
        };
        Update: {
          status_code?: string;
          status_description?: string;
          location?: string | null;
          event_timestamp?: string;
        };
      };
      workshops: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          format: WorkshopFormat;
          price_minor: number;
          venue_or_link: string | null;
          image_url: string | null;
          duration: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          format?: WorkshopFormat;
          price_minor?: number;
          venue_or_link?: string | null;
          image_url?: string | null;
          duration?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          format?: WorkshopFormat;
          price_minor?: number;
          venue_or_link?: string | null;
          image_url?: string | null;
          duration?: string | null;
          is_active?: boolean;
        };
      };
    };
  };
}
