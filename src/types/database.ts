export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ContentStatus = "new" | "auto_added" | "generated" | "posted" | "archived";

export type ContentItem = {
  id: string; owner_id: string; identifier: string; parent_id: string | null; variation_number: number | null;
  title: string | null; status: ContentStatus; content_type: string | null; panel_count: number | null;
  overview: string | null; content: string | null; caption: string | null; generation_prompt: string | null;
  score: number | null; priority: number | null; is_favorite: boolean; instagram_url: string | null;
  publishing_notes: string | null; generated_at: string | null; posted_at: string | null; archived_at: string | null;
  record_version: number; created_at: string; updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      content_items: {
        Row: ContentItem;
        Insert: Partial<ContentItem> & { identifier: string };
        Update: Partial<ContentItem>;
        Relationships: [];
      };
      assets: { Row: { id: string; owner_id: string; content_item_id: string | null; kind: "image" | "carousel_slide" | "thumbnail" | "source_file" | "export"; storage_path: string; slide_number: number | null; metadata: Json; created_at: string }; Insert: never; Update: never; Relationships: [] };
      sources: { Row: { id: string; owner_id: string; canonical_url: string; website: string | null; title: string | null; summary: string | null; strongest_comment: string | null; discovered_at: string; created_at: string }; Insert: never; Update: never; Relationships: [] };
      content_sources: { Row: { owner_id: string; content_item_id: string; source_id: string }; Insert: never; Update: never; Relationships: [] };
      status_history: { Row: { id: string; owner_id: string; content_item_id: string; from_status: ContentStatus | null; to_status: ContentStatus; reason: string | null; created_at: string }; Insert: never; Update: never; Relationships: [] };
      activity_events: { Row: { id: number; owner_id: string; content_item_id: string | null; event_type: string; details: Json; created_at: string }; Insert: { owner_id?: string; content_item_id?: string | null; event_type: string; details?: Json }; Update: never; Relationships: [] };
      generation_runs: { Row: { id: string; owner_id: string; content_item_id: string; idempotency_key: string; status: "queued" | "running" | "succeeded" | "failed" | "cancelled"; prompt: string; output: Json | null; error_message: string | null; promoted_at: string | null; started_at: string | null; completed_at: string | null; created_at: string }; Insert: { owner_id?: string; content_item_id: string; idempotency_key: string; prompt: string; status?: "queued" | "running" | "succeeded" | "failed" | "cancelled" }; Update: never; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      create_content_item: { Args: { p_title?: string | null }; Returns: Json };
      duplicate_content_item: { Args: { p_id: string }; Returns: Json };
      save_content_item: { Args: Record<string, unknown>; Returns: Json };
    };
    Enums: { content_status: ContentStatus; asset_kind: "image" | "carousel_slide" | "thumbnail" | "source_file" | "export"; run_status: "queued" | "running" | "succeeded" | "failed" | "cancelled" };
    CompositeTypes: Record<string, never>;
  };
};
