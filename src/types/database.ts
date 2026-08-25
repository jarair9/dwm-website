export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string;
          created_at: string;
          entity_id: string | null;
          entity_title: string | null;
          entity_type: string | null;
          id: string;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity_id?: string | null;
          entity_title?: string | null;
          entity_type?: string | null;
          id?: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity_id?: string | null;
          entity_title?: string | null;
          entity_type?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      auction_lots_public: {
        Row: {
          format: string;
          lot_id: string;
          reveal_at: string | null;
        };
        Insert: {
          format: string;
          lot_id: string;
          reveal_at?: string | null;
        };
        Update: {
          format?: string;
          lot_id?: string;
          reveal_at?: string | null;
        };
        Relationships: [];
      };
      banners: {
        Row: {
          created_at: string;
          cta_label: string | null;
          cta_url: string | null;
          description: string | null;
          id: string;
          image: string;
          page_slug: string | null;
          page_type: string;
          sort_order: number;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          description?: string | null;
          id?: string;
          image: string;
          page_slug?: string | null;
          page_type?: string;
          sort_order?: number;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          cta_label?: string | null;
          cta_url?: string | null;
          description?: string | null;
          id?: string;
          image?: string;
          page_slug?: string | null;
          page_type?: string;
          sort_order?: number;
          title?: string | null;
        };
        Relationships: [];
      };
      bid_attempts: {
        Row: {
          created_at: string;
          id: number;
          user_key: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          user_key: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          user_key?: string;
        };
        Relationships: [];
      };
      bid_history_public: {
        Row: {
          amount: number | null;
          bidder_label: string;
          created_at: string;
          currency: string;
          event_type: string;
          id: string;
          is_revealed: boolean;
          lot_id: string;
        };
        Insert: {
          amount?: number | null;
          bidder_label: string;
          created_at?: string;
          currency?: string;
          event_type?: string;
          id?: string;
          is_revealed?: boolean;
          lot_id: string;
        };
        Update: {
          amount?: number | null;
          bidder_label?: string;
          created_at?: string;
          currency?: string;
          event_type?: string;
          id?: string;
          is_revealed?: boolean;
          lot_id?: string;
        };
        Relationships: [];
      };
      bids: {
        Row: {
          amount: number;
          bidder_name: string;
          created_at: string;
          id: string;
          lot_id: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          bidder_name: string;
          created_at?: string;
          id?: string;
          lot_id: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          bidder_name?: string;
          created_at?: string;
          id?: string;
          lot_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bids_lot_id_fkey";
            columns: ["lot_id"];
            isOneToOne: false;
            referencedRelation: "lots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bids_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          parent_id: string | null;
          slug: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          parent_id?: string | null;
          slug: string;
          type: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      consignment_submissions: {
        Row: {
          admin_notes: string | null;
          asking_price: number | null;
          created_at: string | null;
          id: string;
          item_description: string | null;
          photos: Json | null;
          status:
            | "new"
            | "reviewing"
            | "offer_made"
            | "accepted"
            | "declined"
            | null;
          submitter_email: string;
          submitter_name: string;
          submitter_phone: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          asking_price?: number | null;
          created_at?: string | null;
          id?: string;
          item_description?: string | null;
          photos?: Json | null;
          status?:
            | "new"
            | "reviewing"
            | "offer_made"
            | "accepted"
            | "declined"
            | null;
          submitter_email: string;
          submitter_name: string;
          submitter_phone?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          asking_price?: number | null;
          created_at?: string | null;
          id?: string;
          item_description?: string | null;
          photos?: Json | null;
          status?:
            | "new"
            | "reviewing"
            | "offer_made"
            | "accepted"
            | "declined"
            | null;
          submitter_email?: string;
          submitter_name?: string;
          submitter_phone?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          resolved: boolean;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          resolved?: boolean;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          resolved?: boolean;
          subject?: string | null;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          country_code: string | null;
          created_at: string | null;
          department: "sales" | "customer_support" | null;
          email: string | null;
          hear_about_us: string | null;
          id: string;
          message: string | null;
          name: string;
          phone: string | null;
          preferred_callback_time: string | null;
          scheduled_date: string | null;
          status: string | null;
          type: "inquiry" | "call_back";
        };
        Insert: {
          country_code?: string | null;
          created_at?: string | null;
          department?: "sales" | "customer_support" | null;
          email?: string | null;
          hear_about_us?: string | null;
          id?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          preferred_callback_time?: string | null;
          scheduled_date?: string | null;
          status?: string | null;
          type?: "inquiry" | "call_back";
        };
        Update: {
          country_code?: string | null;
          created_at?: string | null;
          department?: "sales" | "customer_support" | null;
          email?: string | null;
          hear_about_us?: string | null;
          id?: string;
          message?: string | null;
          name?: string;
          phone?: string | null;
          preferred_callback_time?: string | null;
          scheduled_date?: string | null;
          status?: string | null;
          type?: "inquiry" | "call_back";
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          amount: number;
          buyer_id: string | null;
          created_at: string | null;
          due_at: string | null;
          id: string;
          lot_id: string | null;
          status: "unpaid" | "paid" | "overdue" | "cancelled" | null;
          stripe_payment_intent_id: string | null;
        };
        Insert: {
          amount: number;
          buyer_id?: string | null;
          created_at?: string | null;
          due_at?: string | null;
          id?: string;
          lot_id?: string | null;
          status?: "unpaid" | "paid" | "overdue" | "cancelled" | null;
          stripe_payment_intent_id?: string | null;
        };
        Update: {
          amount?: number;
          buyer_id?: string | null;
          created_at?: string | null;
          due_at?: string | null;
          id?: string;
          lot_id?: string | null;
          status?: "unpaid" | "paid" | "overdue" | "cancelled" | null;
          stripe_payment_intent_id?: string | null;
        };
        Relationships: [];
      };
      lot_media: {
        Row: {
          id: string;
          lot_id: string | null;
          media_type: string | null;
          sort_order: number | null;
          url: string;
        };
        Insert: {
          id?: string;
          lot_id?: string | null;
          media_type?: string | null;
          sort_order?: number | null;
          url: string;
        };
        Update: {
          id?: string;
          lot_id?: string | null;
          media_type?: string | null;
          sort_order?: number | null;
          url?: string;
        };
        Relationships: [];
      };
      lots: {
        Row: {
          bid_increment: number;
          category_id: string | null;
          created_at: string;
          current_bid: number | null;
          description: string | null;
          end_time: string;
          featured: boolean;
          id: string;
          images: string[];
          name: string;
          slug: string;
          start_time: string;
          starting_bid: number;
          status: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          bid_increment?: number;
          category_id?: string | null;
          created_at?: string;
          current_bid?: number | null;
          description?: string | null;
          end_time: string;
          featured?: boolean;
          id?: string;
          images?: string[];
          name: string;
          slug: string;
          start_time: string;
          starting_bid: number;
          status?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          bid_increment?: number;
          category_id?: string | null;
          created_at?: string;
          current_bid?: number | null;
          description?: string | null;
          end_time?: string;
          featured?: boolean;
          id?: string;
          images?: string[];
          name?: string;
          slug?: string;
          start_time?: string;
          starting_bid?: number;
          status?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lots_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          auth_id: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          role: string;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          auth_id?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          phone?: string | null;
          role?: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          auth_id?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          role?: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_name: string;
          author_photo_url: string | null;
          body: string;
          created_at: string | null;
          id: string;
          is_featured: boolean | null;
          rating: number;
          source: string | null;
        };
        Insert: {
          author_name: string;
          author_photo_url?: string | null;
          body: string;
          created_at?: string | null;
          id?: string;
          is_featured?: boolean | null;
          rating?: number;
          source?: string | null;
        };
        Update: {
          author_name?: string;
          author_photo_url?: string | null;
          body?: string;
          created_at?: string | null;
          id?: string;
          is_featured?: boolean | null;
          rating?: number;
          source?: string | null;
        };
        Relationships: [];
      };
      shipments: {
        Row: {
          carrier: string | null;
          created_at: string | null;
          id: string;
          insured: boolean | null;
          invoice_id: string | null;
          status: "pending" | "shipped" | "delivered" | "returned" | null;
          tracking_number: string | null;
        };
        Insert: {
          carrier?: string | null;
          created_at?: string | null;
          id?: string;
          insured?: boolean | null;
          invoice_id?: string | null;
          status?: "pending" | "shipped" | "delivered" | "returned" | null;
          tracking_number?: string | null;
        };
        Update: {
          carrier?: string | null;
          created_at?: string | null;
          id?: string;
          insured?: boolean | null;
          invoice_id?: string | null;
          status?: "pending" | "shipped" | "delivered" | "returned" | null;
          tracking_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shipments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          hero_banners: Json | null;
          hero_cta_label: string | null;
          hero_cta_url: string | null;
          hero_headline: string;
          hero_image: string | null;
          hero_subheadline: string | null;
          id: number;
          updated_at: string;
        };
        Insert: {
          hero_banners?: Json | null;
          hero_cta_label?: string | null;
          hero_cta_url?: string | null;
          hero_headline?: string;
          hero_image?: string | null;
          hero_subheadline?: string | null;
          id?: number;
          updated_at?: string;
        };
        Update: {
          hero_banners?: Json | null;
          hero_cta_label?: string | null;
          hero_cta_url?: string | null;
          hero_headline?: string;
          hero_image?: string | null;
          hero_subheadline?: string | null;
          id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_visitors: {
        Row: {
          created_at: string;
          id: string;
          page: string;
          referrer: string | null;
          user_agent: string | null;
          visitor_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          page: string;
          referrer?: string | null;
          user_agent?: string | null;
          visitor_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          page?: string;
          referrer?: string | null;
          user_agent?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          author: string;
          content: string;
          created_at: string;
          id: string;
          location: string | null;
          rating: number;
        };
        Insert: {
          author: string;
          content: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          rating?: number;
        };
        Update: {
          author?: string;
          content?: string;
          created_at?: string;
          id?: string;
          location?: string | null;
          rating?: number;
        };
        Relationships: [];
      };
      watchlist: {
        Row: {
          created_at: string | null;
          lot_id: string;
          notify_on_bid: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          lot_id: string;
          notify_on_bid?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          lot_id?: string;
          notify_on_bid?: boolean | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      place_bid: {
        Args: {
          p_amount: number;
          p_bidder_name: string;
          p_lot_id: string;
          p_user_id: string;
          p_user_key: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      consignment_status:
        | "new"
        | "reviewing"
        | "offer_made"
        | "accepted"
        | "declined";
      department_type: "sales" | "customer_support";
      inquiry_type: "inquiry" | "call_back";
      invoice_status: "unpaid" | "paid" | "overdue" | "cancelled";
      lot_format: "auction" | "buy_now";
      lot_status:
        | "draft"
        | "scheduled"
        | "active"
        | "sold"
        | "not_sold"
        | "awaiting_payment"
        | "sold_out"
        | "withdrawn";
      shipment_status: "pending" | "shipped" | "delivered" | "returned";
      vertical_type: "minerals" | "gemstones";
    };
    CompositeTypes: {};
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      consignment_status: [
        "new",
        "reviewing",
        "offer_made",
        "accepted",
        "declined",
      ],
      department_type: ["sales", "customer_support"],
      inquiry_type: ["inquiry", "call_back"],
      invoice_status: ["unpaid", "paid", "overdue", "cancelled"],
      lot_format: ["auction", "buy_now"],
      lot_status: [
        "draft",
        "scheduled",
        "active",
        "sold",
        "not_sold",
        "awaiting_payment",
        "sold_out",
        "withdrawn",
      ],
      shipment_status: ["pending", "shipped", "delivered", "returned"],
      vertical_type: ["minerals", "gemstones"],
    },
  },
} as const;
