export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      dental_records: {
        Row: {
          appointment_time: string
          diagnosis: string | null
          id: string
          images: string[] | null
          notes: string | null
          operation_type: string | null
          patient_id: string
          treatment: string | null
          visit_date: string
        }
        Insert: {
          appointment_time: string
          diagnosis?: string | null
          id?: string
          images?: string[] | null
          notes?: string | null
          operation_type?: string | null
          patient_id: string
          treatment?: string | null
          visit_date?: string
        }
        Update: {
          appointment_time?: string
          diagnosis?: string | null
          id?: string
          images?: string[] | null
          notes?: string | null
          operation_type?: string | null
          patient_id?: string
          treatment?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "dental_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          medical_history: string[] | null
          phone: string | null
          pinned: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          medical_history?: string[] | null
          phone?: string | null
          pinned?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          medical_history?: string[] | null
          phone?: string | null
          pinned?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          encrypted_data: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          terms_accepted: boolean | null
          terms_accepted_at: string | null
        }
        Insert: {
          created_at?: string
          encrypted_data?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
        }
        Update: {
          created_at?: string
          encrypted_data?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          en: string
          id: string
          key: string
          tr: string
        }
        Insert: {
          created_at?: string
          en: string
          id?: string
          key: string
          tr: string
        }
        Update: {
          created_at?: string
          en?: string
          id?: string
          key?: string
          tr?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
