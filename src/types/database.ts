export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ContentStatus = "new" | "auto_added" | "generated" | "posted" | "archived";

export type Database = {
  public: {
    Tables: {
      content_items: {
        Row: {
          id: string; owner_id: string; identifier: string; title: string | null;
          status: ContentStatus; record_version: number; created_at: string; updated_at: string;
        };
        Insert: { identifier: string; owner_id?: string; title?: string | null; status?: ContentStatus };
        Update: { title?: string | null; status?: ContentStatus; record_version?: number; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { content_status: ContentStatus; asset_kind: "image" | "carousel_slide" | "thumbnail" | "source_file" | "export"; run_status: "queued" | "running" | "succeeded" | "failed" | "cancelled" };
    CompositeTypes: Record<string, never>;
  };
};
