import type { District, UnitStatus, UnitType, AccessType } from "@/lib/constants";

export type Database = {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string;
          owner_code: string;
          full_name: string;
          phone: string;
          phone_secondary: string | null;
          email: string | null;
          id_number: string | null;
          bank_account: string | null;
          note: string | null;
          commission_sale_pct: number | null;
          commission_total_pct: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_code: string;
          full_name: string;
          phone: string;
          phone_secondary?: string | null;
          email?: string | null;
          id_number?: string | null;
          bank_account?: string | null;
          note?: string | null;
          commission_sale_pct?: number | null;
          commission_total_pct?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["owners"]["Insert"]>;
        Relationships: [];
      };
      buildings: {
        Row: {
          id: string;
          owner_id: string;
          district: District;
          ward: string | null;
          alley: string | null;
          house_number: string | null;
          guide_name: string | null;
          guide_phone: string | null;
          access_type: AccessType | null;
          pinned_at: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          district: District;
          ward?: string | null;
          alley?: string | null;
          house_number?: string | null;
          guide_name?: string | null;
          guide_phone?: string | null;
          access_type?: AccessType | null;
          pinned_at?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["buildings"]["Insert"]>;
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          building_id: string;
          room_number: string;
          unit_type: UnitType;
          price_month: number;
          status: UnitStatus;
          details_text: string | null;
          gdrive_folder_link: string | null;
          note: string | null;
          pinned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          room_number: string;
          unit_type: UnitType;
          price_month: number;
          status?: UnitStatus;
          details_text?: string | null;
          gdrive_folder_link?: string | null;
          note?: string | null;
          pinned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["units"]["Insert"]>;
        Relationships: [];
      };
      unit_history: {
        Row: {
          id: string;
          unit_id: string;
          changed_by: string | null;
          field_name: "price_month" | "status";
          old_value: string | null;
          new_value: string | null;
          changed_at: string;
        };
        Insert: {
          id?: never;
          unit_id?: never;
          changed_by?: never;
          field_name?: never;
          old_value?: never;
          new_value?: never;
          changed_at?: never;
        };
        Update: Database["public"]["Tables"]["unit_history"]["Insert"];
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          role: "admin" | "sale";
          full_name: string | null;
          is_active: boolean;
        };
        Insert: {
          id: string;
          role: "admin" | "sale";
          full_name?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      buildings_sale_view: {
        Row: {
          id: string;
          owner_id: string;
          owner_code: string;
          commission_sale_pct: number | null;
          district: District;
          ward: string | null;
          alley: string | null;
          access_type: AccessType | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      search_buildings: {
        Args: {
          p_district?: string | null;
          p_owner_code?: string | null;
          p_keyword?: string | null;
          p_price_min?: number | null;
          p_price_max?: number | null;
          p_unit_types?: string[] | null;
          p_access_type?: string | null;
        };
        Returns: {
          id: string;
          district: District;
          ward: string | null;
          alley: string | null;
          house_number: string | null;
          access_type: AccessType | null;
          pinned_at: string | null;
          owner_id: string;
          owner_code: string;
          total_units: number;
          vacant_units: number;
        }[];
      };
      search_units: {
        Args: {
          p_district?: string | null;
          p_owner_code?: string | null;
          p_keyword?: string | null;
          p_price_min?: number | null;
          p_price_max?: number | null;
          p_unit_types?: string[] | null;
          p_statuses?: string[] | null;
          p_access_type?: string | null;
        };
        Returns: {
          id: string;
          building_id: string;
          district: District;
          alley: string | null;
          access_type: AccessType | null;
          pinned_at: string | null;
          owner_code: string;
          room_number: string;
          unit_type: string;
          price_month: number;
          status: UnitStatus;
          details_text: string | null;
          gdrive_folder_link: string | null;
          note: string | null;
        }[];
      };
      set_building_pin: {
        Args: {
          p_building_id: string;
          p_pin: boolean;
        };
        Returns: undefined;
      };
      auth_role: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      create_full_entry: {
        Args: {
          p_owner_mode: string;
          p_owner_id: string | null;
          p_owner_code: string | null;
          p_owner_full_name: string | null;
          p_owner_phone: string | null;
          p_owner_phone_secondary: string | null;
          p_owner_email: string | null;
          p_owner_bank_account: string | null;
          p_owner_note: string | null;
          p_owner_commission_sale_pct: number | null;
          p_owner_commission_total_pct: number | null;
          p_district: string;
          p_ward: string | null;
          p_alley: string | null;
          p_house_number: string | null;
          p_guide_name: string | null;
          p_guide_phone: string | null;
          p_access_type: string | null;
          p_building_note: string | null;
          p_room_number: string;
          p_unit_type: string;
          p_price_month: number;
          p_status: string;
          p_details_text: string | null;
          p_gdrive_link: string | null;
          p_unit_note: string | null;
        };
        Returns: { owner_id: string; building_id: string; unit_id: string }[];
      };
    };
  };
};
