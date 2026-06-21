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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academy_articles: {
        Row: {
          body_md: string | null
          category_id: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          reading_minutes: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body_md?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          reading_minutes?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string | null
          category_id?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          reading_minutes?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "academy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_booth_checklists: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_favorite: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_favorite?: boolean
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_favorite?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_booth_designs: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_favorite: boolean
          name: string
          size: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_favorite?: boolean
          name?: string
          size?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_favorite?: boolean
          name?: string
          size?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_booth_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          lesson_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      academy_community_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "academy_community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_community_posts: {
        Row: {
          body: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean
          kind: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          kind?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          kind?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_contacts: {
        Row: {
          company: string | null
          contact_type: string
          created_at: string
          email: string | null
          facebook: string | null
          favorite: boolean
          id: string
          instagram: string | null
          interactions: Json
          last_contacted: string | null
          location: string | null
          name: string
          next_followup: string | null
          notes: string | null
          phone: string | null
          tiktok: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company?: string | null
          contact_type?: string
          created_at?: string
          email?: string | null
          facebook?: string | null
          favorite?: boolean
          id?: string
          instagram?: string | null
          interactions?: Json
          last_contacted?: string | null
          location?: string | null
          name?: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          tiktok?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company?: string | null
          contact_type?: string
          created_at?: string
          email?: string | null
          facebook?: string | null
          favorite?: boolean
          id?: string
          instagram?: string | null
          interactions?: Json
          last_contacted?: string | null
          location?: string | null
          name?: string
          next_followup?: string | null
          notes?: string | null
          phone?: string | null
          tiktok?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      academy_download_log: {
        Row: {
          created_at: string
          download_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          download_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          download_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_download_log_download_id_fkey"
            columns: ["download_id"]
            isOneToOne: false
            referencedRelation: "academy_downloads"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_downloads: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          size_kb: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          size_kb?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          size_kb?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_downloads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "academy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_events: {
        Row: {
          application_deadline: string | null
          booth_fee: number
          booth_size: string | null
          checklist: Json
          created_at: string
          electricity: boolean
          event_date: string | null
          event_name: string
          event_time: string | null
          id: string
          indoor_outdoor: string | null
          location: string | null
          notes: string | null
          organizer_email: string | null
          organizer_name: string | null
          organizer_phone: string | null
          status: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          application_deadline?: string | null
          booth_fee?: number
          booth_size?: string | null
          checklist?: Json
          created_at?: string
          electricity?: boolean
          event_date?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          indoor_outdoor?: string | null
          location?: string | null
          notes?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          application_deadline?: string | null
          booth_fee?: number
          booth_size?: string | null
          checklist?: Json
          created_at?: string
          electricity?: boolean
          event_date?: string | null
          event_name?: string
          event_time?: string | null
          id?: string
          indoor_outdoor?: string | null
          location?: string | null
          notes?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      academy_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          event_name: string
          expense_date: string
          id: string
          notes: string | null
          payment_method: string
          receipt_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          event_name?: string
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          event_name?: string
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_favorites: {
        Row: {
          created_at: string
          id: string
          resource_ref: string
          resource_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_ref: string
          resource_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_ref?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_gallery_favorites: {
        Row: {
          created_at: string
          id: string
          image_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_goals: {
        Row: {
          created_at: string
          current_value: number
          due_date: string | null
          goal_type: string
          id: string
          is_complete: boolean
          notes: string | null
          priority: string
          status: string
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          due_date?: string | null
          goal_type?: string
          id?: string
          is_complete?: boolean
          notes?: string | null
          priority?: string
          status?: string
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          due_date?: string | null
          goal_type?: string
          id?: string
          is_complete?: boolean
          notes?: string | null
          priority?: string
          status?: string
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_inventory_items: {
        Row: {
          category: string
          cost: number
          created_at: string
          id: string
          image_url: string | null
          low_stock_alert: number
          name: string
          notes: string | null
          quantity: number
          retail_price: number
          sku: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          cost?: number
          created_at?: string
          id?: string
          image_url?: string | null
          low_stock_alert?: number
          name?: string
          notes?: string | null
          quantity?: number
          retail_price?: number
          sku?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string
          id?: string
          image_url?: string | null
          low_stock_alert?: number
          name?: string
          notes?: string | null
          quantity?: number
          retail_price?: number
          sku?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_mileage: {
        Row: {
          created_at: string
          end_location: string
          event_name: string
          id: string
          miles: number
          notes: string | null
          rate: number
          start_location: string
          trip_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_location?: string
          event_name?: string
          id?: string
          miles?: number
          notes?: string | null
          rate?: number
          start_location?: string
          trip_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_location?: string
          event_name?: string
          id?: string
          miles?: number
          notes?: string | null
          rate?: number
          start_location?: string
          trip_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_pricing_calculations: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          is_favorite: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          is_favorite?: boolean
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          is_favorite?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_profit_calculations: {
        Row: {
          calc_date: string | null
          created_at: string
          event_name: string | null
          id: string
          inputs: Json
          is_favorite: boolean
          name: string
          notes: string | null
          product_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calc_date?: string | null
          created_at?: string
          event_name?: string | null
          id?: string
          inputs?: Json
          is_favorite?: boolean
          name?: string
          notes?: string | null
          product_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calc_date?: string | null
          created_at?: string
          event_name?: string | null
          id?: string
          inputs?: Json
          is_favorite?: boolean
          name?: string
          notes?: string | null
          product_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_sales: {
        Row: {
          created_at: string
          discount: number
          event_name: string
          id: string
          notes: string | null
          payment_type: string
          price_per_item: number
          product_name: string
          quantity: number
          sale_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount?: number
          event_name?: string
          id?: string
          notes?: string | null
          payment_type?: string
          price_per_item?: number
          product_name?: string
          quantity?: number
          sale_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount?: number
          event_name?: string
          id?: string
          notes?: string | null
          payment_type?: string
          price_per_item?: number
          product_name?: string
          quantity?: number
          sale_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      academy_worksheets: {
        Row: {
          created_at: string
          data: Json
          id: string
          tool_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          tool_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          tool_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_vendors: {
        Row: {
          booth: string | null
          event_id: string
          hours: string | null
          open_today: boolean
          vendor_id: string
        }
        Insert: {
          booth?: string | null
          event_id: string
          hours?: string | null
          open_today?: boolean
          vendor_id: string
        }
        Update: {
          booth?: string | null
          event_id?: string
          hours?: string | null
          open_today?: boolean
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          ends_at: string | null
          hours: string | null
          id: string
          image_url: string | null
          name: string
          neighborhood: string
          starts_at: string | null
          status: Database["public"]["Enums"]["event_status"]
          submitted_by: string | null
          submitter_email: string | null
          submitter_name: string | null
          tags: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          name: string
          neighborhood?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          submitted_by?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          tags?: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          ends_at?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          name?: string
          neighborhood?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          submitted_by?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          tags?: string[]
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          shopper_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          shopper_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          shopper_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
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
      vendors: {
        Row: {
          category: string
          created_at: string
          featured: boolean
          id: string
          image_url: string | null
          name: string
          owner_id: string | null
          payments: string[]
          scribble: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          tagline: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name: string
          owner_id?: string | null
          payments?: string[]
          scribble?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          tagline?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string | null
          payments?: string[]
          scribble?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      app_role: "admin" | "vendor" | "shopper"
      event_status: "pending" | "approved" | "rejected"
      vendor_status: "pending" | "approved" | "hidden"
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
      app_role: ["admin", "vendor", "shopper"],
      event_status: ["pending", "approved", "rejected"],
      vendor_status: ["pending", "approved", "hidden"],
    },
  },
} as const
