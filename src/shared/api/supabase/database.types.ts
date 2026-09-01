export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  charcu: {
    Tables: {
      ai_spend: {
        Row: {
          answer_tokens: number;
          cost_usd: number;
          day: string;
          prompt_tokens: number;
          requests: number;
          thought_tokens: number;
          updated_at: string;
        };
        Insert: {
          answer_tokens?: number;
          cost_usd?: number;
          day?: string;
          prompt_tokens?: number;
          requests?: number;
          thought_tokens?: number;
          updated_at?: string;
        };
        Update: {
          answer_tokens?: number;
          cost_usd?: number;
          day?: string;
          prompt_tokens?: number;
          requests?: number;
          thought_tokens?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          image_path: string | null;
          recipe_id: string;
          role: string;
          user_id: string | null;
          visitor_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          recipe_id: string;
          role: string;
          user_id?: string | null;
          visitor_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          image_path?: string | null;
          recipe_id?: string;
          role?: string;
          user_id?: string | null;
          visitor_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
        ];
      };
      course_waitlist: {
        Row: {
          course_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'course_waitlist_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          access: string;
          cover_url: string | null;
          created_at: string;
          id: string;
          kind: string;
          level: string;
          position: number;
          slug: string;
          status: string;
          summary: string;
          title: string;
          unlock_mode: string;
          updated_at: string;
          waitlist_goal: number | null;
        };
        Insert: {
          access?: string;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          level?: string;
          position?: number;
          slug: string;
          status?: string;
          summary?: string;
          title: string;
          unlock_mode?: string;
          updated_at?: string;
          waitlist_goal?: number | null;
        };
        Update: {
          access?: string;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          level?: string;
          position?: number;
          slug?: string;
          status?: string;
          summary?: string;
          title?: string;
          unlock_mode?: string;
          updated_at?: string;
          waitlist_goal?: number | null;
        };
        Relationships: [];
      };
      knowledge: {
        Row: {
          body: string;
          course_id: string | null;
          created_at: string;
          id: string;
          kind: string;
          slug: string;
          source: string | null;
          status: string;
          summary: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          slug: string;
          source?: string | null;
          status?: string;
          summary?: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          course_id?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          slug?: string;
          source?: string | null;
          status?: string;
          summary?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      lesson_progress: {
        Row: {
          completed_at: string | null;
          last_second: number;
          lesson_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          last_second?: number;
          lesson_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          last_second?: number;
          lesson_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
        ];
      };
      lessons: {
        Row: {
          ask: string | null;
          body: string | null;
          bunny_video_id: string | null;
          created_at: string;
          duration_s: number | null;
          file_url: string | null;
          id: string;
          kind: string;
          module_id: string;
          position: number;
          poster_url: string | null;
          summary: string;
          title: string;
        };
        Insert: {
          ask?: string | null;
          body?: string | null;
          bunny_video_id?: string | null;
          created_at?: string;
          duration_s?: number | null;
          file_url?: string | null;
          id?: string;
          kind: string;
          module_id: string;
          position: number;
          poster_url?: string | null;
          summary?: string;
          title: string;
        };
        Update: {
          ask?: string | null;
          body?: string | null;
          bunny_video_id?: string | null;
          created_at?: string;
          duration_s?: number | null;
          file_url?: string | null;
          id?: string;
          kind?: string;
          module_id?: string;
          position?: number;
          poster_url?: string | null;
          summary?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            isOneToOne: false;
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          },
        ];
      };
      modules: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          position: number;
          summary: string;
          title: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          position: number;
          summary?: string;
          title: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          position?: number;
          summary?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
        ];
      };
      plan_quotas: {
        Row: {
          images_per_month: number;
          plan_id: string;
          questions_per_month: number;
          recipes_per_month: number | null;
        };
        Insert: {
          images_per_month: number;
          plan_id: string;
          questions_per_month: number;
          recipes_per_month?: number | null;
        };
        Update: {
          images_per_month?: number;
          plan_id?: string;
          questions_per_month?: number;
          recipes_per_month?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          interests: string[];
          onboarding_status: string;
          updated_at: string;
          whatsapp: string | null;
          whatsapp_consent_at: string | null;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          interests?: string[];
          onboarding_status?: string;
          updated_at?: string;
          whatsapp?: string | null;
          whatsapp_consent_at?: string | null;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          interests?: string[];
          onboarding_status?: string;
          updated_at?: string;
          whatsapp?: string | null;
          whatsapp_consent_at?: string | null;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          closed_at: string | null;
          id: string;
          last_message_at: string;
          product: string | null;
          started_at: string;
          status: string;
          summary: string | null;
          title: string;
          user_id: string | null;
          visitor_id: string;
        };
        Insert: {
          closed_at?: string | null;
          id?: string;
          last_message_at?: string;
          product?: string | null;
          started_at?: string;
          status?: string;
          summary?: string | null;
          title?: string;
          user_id?: string | null;
          visitor_id: string;
        };
        Update: {
          closed_at?: string | null;
          id?: string;
          last_message_at?: string;
          product?: string | null;
          started_at?: string;
          status?: string;
          summary?: string | null;
          title?: string;
          user_id?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          country: string | null;
          created_at: string;
          current_period_end: string | null;
          id: string;
          plan_id: string | null;
          rail: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          plan_id?: string | null;
          rail?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          plan_id?: string | null;
          rail?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      usage_counters: {
        Row: {
          created_at: string;
          id: string;
          images_used: number;
          period_key: string;
          questions_used: number;
          recipes_used: number;
          updated_at: string;
          user_id: string | null;
          visitor_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          images_used?: number;
          period_key: string;
          questions_used?: number;
          recipes_used?: number;
          updated_at?: string;
          user_id?: string | null;
          visitor_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          images_used?: number;
          period_key?: string;
          questions_used?: number;
          recipes_used?: number;
          updated_at?: string;
          user_id?: string | null;
          visitor_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_open_lesson: { Args: { p_lesson_id: string }; Returns: boolean };
      can_read_course: { Args: { p_course_id: string }; Returns: boolean };
      complete_onboarding: {
        Args: {
          p_consent: boolean;
          p_full_name: string;
          p_interests: string[];
          p_whatsapp: string;
        };
        Returns: undefined;
      };
      consume_quota: {
        Args: {
          p_images?: number;
          p_new_recipe?: boolean;
          p_user_id: string;
          p_visitor_id: string;
        };
        Returns: {
          allowed: boolean;
          denied_by: string;
          images_limit: number;
          images_used: number;
          plan: string;
          questions_limit: number;
          questions_used: number;
          recipes_limit: number;
          recipes_used: number;
        }[];
      };
      course_outline: {
        Args: { p_slug: string };
        Returns: {
          lesson_id: string;
          lesson_kind: string;
          lesson_position: number;
          lesson_summary: string;
          lesson_title: string;
          module_id: string;
          module_position: number;
          module_summary: string;
          module_title: string;
        }[];
      };
      course_progress: {
        Args: { p_user_id: string };
        Returns: {
          course_id: string;
          done_lessons: number;
          next_lesson_id: string;
          percent: number;
          total_lessons: number;
        }[];
      };
      course_waitlist_count: { Args: { p_course_id: string }; Returns: number };
      course_waitlist_totals: {
        Args: { p_course_ids: string[] };
        Returns: {
          course_id: string;
          total: number;
        }[];
      };
      current_period_key: { Args: never; Returns: string };
      effective_plan: { Args: { p_user_id: string }; Returns: string };
      has_active_subscription: { Args: { p_user_id: string }; Returns: boolean };
      is_in_waitlist: { Args: { p_course_id: string }; Returns: boolean };
      join_waitlist: { Args: { p_course_id: string }; Returns: number };
      link_visitor_to_user: {
        Args: { p_user_id: string; p_visitor_id: string };
        Returns: undefined;
      };
      quota_status: {
        Args: { p_user_id: string; p_visitor_id: string };
        Returns: {
          images_limit: number;
          images_used: number;
          plan: string;
          questions_limit: number;
          questions_used: number;
          recipes_limit: number;
          recipes_used: number;
        }[];
      };
      record_ai_spend: {
        Args: {
          p_answer_tokens: number;
          p_cost_usd: number;
          p_prompt_tokens: number;
          p_thought_tokens: number;
        };
        Returns: number;
      };
      refund_quota: {
        Args: {
          p_images?: number;
          p_new_recipe?: boolean;
          p_user_id: string;
          p_visitor_id: string;
        };
        Returns: undefined;
      };
      save_lesson_progress: {
        Args: { p_completed?: boolean; p_lesson_id: string; p_second?: number };
        Returns: undefined;
      };
      search_knowledge: {
        Args: { p_limit?: number; p_query: string; p_tags?: string[] };
        Returns: {
          body: string;
          course_id: string;
          id: string;
          kind: string;
          score: number;
          slug: string;
          summary: string;
          tags: string[];
          title: string;
        }[];
      };
      today_ai_spend: { Args: never; Returns: number };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  charcu: {
    Enums: {},
  },
} as const;
