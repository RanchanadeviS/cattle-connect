export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cattle_listings: {
        Row: {
          age_months: number
          auction_enabled: boolean
          breed: string
          breeding_history: string | null
          created_at: string
          delivery_available: boolean
          delivery_radius_km: number | null
          description: string | null
          feed_type: string | null
          gender: string
          health_status: string
          id: number
          last_vaccination_date: string | null
          location_city: string
          location_state: string
          milk_capacity_liters: number | null
          pickup_available: boolean
          price: number
          special_notes: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          vaccination_status: string
          weight_kg: number
        }
        Insert: {
          age_months: number
          auction_enabled?: boolean
          breed: string
          breeding_history?: string | null
          created_at?: string
          delivery_available?: boolean
          delivery_radius_km?: number | null
          description?: string | null
          feed_type?: string | null
          gender: string
          health_status?: string
          id?: number
          last_vaccination_date?: string | null
          location_city: string
          location_state: string
          milk_capacity_liters?: number | null
          pickup_available?: boolean
          price: number
          special_notes?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          vaccination_status?: string
          weight_kg: number
        }
        Update: {
          age_months?: number
          auction_enabled?: boolean
          breed?: string
          breeding_history?: string | null
          created_at?: string
          delivery_available?: boolean
          delivery_radius_km?: number | null
          description?: string | null
          feed_type?: string | null
          gender?: string
          health_status?: string
          id?: number
          last_vaccination_date?: string | null
          location_city?: string
          location_state?: string
          milk_capacity_liters?: number | null
          pickup_available?: boolean
          price?: number
          special_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          vaccination_status?: string
          weight_kg?: number
        }
        Relationships: []
      }
      cattle_media: {
        Row: {
          cattle_id: number
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_primary: boolean
        }
        Insert: {
          cattle_id: number
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_primary?: boolean
        }
        Update: {
          cattle_id?: number
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "cattle_media_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "cattle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cattle_media_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "listing_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          cattle_id: number
          created_at: string
          id: string
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          cattle_id: number
          created_at?: string
          id?: string
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          cattle_id?: number
          created_at?: string
          id?: string
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_chat_conversations: {
        Row: {
          cattle_id: number | null
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cattle_id?: number | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cattle_id?: number | null
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_user: boolean
          message: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_user?: boolean
          message: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_user?: boolean
          message?: string
        }
        Relationships: []
      }
      health_documents: {
        Row: {
          cattle_id: number
          created_at: string
          document_type: string
          expiry_date: string | null
          file_name: string
          file_path: string
          id: string
          issued_by: string | null
          issued_date: string | null
        }
        Insert: {
          cattle_id: number
          created_at?: string
          document_type: string
          expiry_date?: string | null
          file_name: string
          file_path: string
          id?: string
          issued_by?: string | null
          issued_date?: string | null
        }
        Update: {
          cattle_id?: number
          created_at?: string
          document_type?: string
          expiry_date?: string | null
          file_name?: string
          file_path?: string
          id?: string
          issued_by?: string | null
          issued_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_documents_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "cattle_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_documents_cattle_id_fkey"
            columns: ["cattle_id"]
            isOneToOne: false
            referencedRelation: "listing_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_views: {
        Row: {
          cattle_id: number
          created_at: string
          id: string
          ip_address: unknown | null
          viewer_id: string | null
        }
        Insert: {
          cattle_id: number
          created_at?: string
          id?: string
          ip_address?: unknown | null
          viewer_id?: string | null
        }
        Update: {
          cattle_id?: number
          created_at?: string
          id?: string
          ip_address?: unknown | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_read: boolean
          message_type: string
          price_offer: number | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          price_offer?: number | null
          sender_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean
          message_type?: string
          price_offer?: number | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      price_negotiations: {
        Row: {
          cattle_id: number
          conversation_id: string
          created_at: string
          current_offer: number
          id: string
          offered_by: string
          original_price: number
          status: string
          updated_at: string
        }
        Insert: {
          cattle_id: number
          conversation_id: string
          created_at?: string
          current_offer: number
          id?: string
          offered_by: string
          original_price: number
          status?: string
          updated_at?: string
        }
        Update: {
          cattle_id?: number
          conversation_id?: string
          created_at?: string
          current_offer?: number
          id?: string
          offered_by?: string
          original_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_negotiations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          full_name: string
          id: string
          location_city: string | null
          location_state: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          full_name: string
          id: string
          location_city?: string | null
          location_state?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          full_name?: string
          id?: string
          location_city?: string | null
          location_state?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vaccination_schedules: {
        Row: {
          cattle_id: number
          created_at: string
          frequency_months: number
          id: string
          is_active: boolean
          last_given_date: string | null
          next_due_date: string
          notes: string | null
          reminder_sent: boolean
          updated_at: string
          user_id: string
          vaccine_name: string
        }
        Insert: {
          cattle_id: number
          created_at?: string
          frequency_months?: number
          id?: string
          is_active?: boolean
          last_given_date?: string | null
          next_due_date: string
          notes?: string | null
          reminder_sent?: boolean
          updated_at?: string
          user_id: string
          vaccine_name: string
        }
        Update: {
          cattle_id?: number
          created_at?: string
          frequency_months?: number
          id?: string
          is_active?: boolean
          last_given_date?: string | null
          next_due_date?: string
          notes?: string | null
          reminder_sent?: boolean
          updated_at?: string
          user_id?: string
          vaccine_name?: string
        }
        Relationships: []
      }
      veterinary_appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          cattle_id: number
          created_at: string
          id: string
          notes: string | null
          reminder_sent: boolean
          status: string
          updated_at: string
          user_id: string
          veterinarian_contact: string | null
          veterinarian_name: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          cattle_id: number
          created_at?: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean
          status?: string
          updated_at?: string
          user_id: string
          veterinarian_contact?: string | null
          veterinarian_name?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          cattle_id?: number
          created_at?: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean
          status?: string
          updated_at?: string
          user_id?: string
          veterinarian_contact?: string | null
          veterinarian_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      listing_analytics: {
        Row: {
          created_at: string | null
          highest_offer: number | null
          id: number | null
          price: number | null
          status: string | null
          title: string | null
          total_inquiries: number | null
          total_offers: number | null
          total_views: number | null
          unique_views: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "farmer" | "buyer" | "seller" | "veterinarian"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["farmer", "buyer", "seller", "veterinarian"],
    },
  },
} as const
