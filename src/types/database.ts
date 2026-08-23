export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ContentStatus = "new" | "auto_added" | "generated" | "images_generated" | "posted" | "archived";

export type ContentItem = {
  id: string; owner_id: string; identifier: string; parent_id: string | null; variation_number: number | null;
  title: string | null; status: ContentStatus; content_type: string | null; panel_count: number | null;
  overview: string | null; content: string | null; caption: string | null; first_comment: string | null; generation_prompt: string | null;
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
      assets: { Row: { id: string; owner_id: string; content_item_id: string | null; kind: "image" | "carousel_slide" | "thumbnail" | "source_file" | "export"; storage_path: string; slide_number: number | null; metadata: Json; created_at: string }; Insert: {owner_id:string;content_item_id?:string|null;kind:"image"|"carousel_slide"|"thumbnail"|"source_file"|"export";storage_path:string;slide_number?:number|null;metadata?:Json}; Update: never; Relationships: [] };
      sources: { Row: { id: string; owner_id: string; canonical_url: string; website: string | null; title: string | null; summary: string | null; strongest_comment: string | null; discovered_at: string; created_at: string }; Insert: {owner_id?:string;canonical_url:string;website?:string|null;title?:string|null;summary?:string|null;strongest_comment?:string|null}; Update: never; Relationships: [] };
      content_sources: { Row: { owner_id: string; content_item_id: string; source_id: string }; Insert: {owner_id?:string;content_item_id:string;source_id:string}; Update: never; Relationships: [] };
      status_history: { Row: { id: string; owner_id: string; content_item_id: string; from_status: ContentStatus | null; to_status: ContentStatus; reason: string | null; created_at: string }; Insert: never; Update: never; Relationships: [] };
      activity_events: { Row: { id: number; owner_id: string; content_item_id: string | null; event_type: string; details: Json; created_at: string }; Insert: { owner_id?: string; content_item_id?: string | null; event_type: string; details?: Json }; Update: never; Relationships: [] };
      generation_runs: { Row: { id: string; owner_id: string; content_item_id: string; idempotency_key: string; status: "queued" | "running" | "succeeded" | "failed" | "cancelled"; prompt: string; output: Json | null; error_message: string | null; promoted_at: string | null; started_at: string | null; completed_at: string | null; created_at: string }; Insert: { owner_id?: string; content_item_id: string; idempotency_key: string; prompt: string; status?: "queued" | "running" | "succeeded" | "failed" | "cancelled" }; Update: Partial<{status:"queued"|"running"|"succeeded"|"failed"|"cancelled";output:Json;error_message:string|null;promoted_at:string;started_at:string;completed_at:string}>; Relationships: [] };
      metrics: { Row: { id: number; owner_id: string; metric_name: string; metric_value: number; measured_at: string; notes: string | null }; Insert: { owner_id?: string; metric_name: string; metric_value: number; measured_at: string; notes?: string | null }; Update: never; Relationships: [] };
      scheduled_jobs: { Row: { id: string; owner_id: string; job_type: string; idempotency_key: string; status: "queued"|"running"|"succeeded"|"failed"|"cancelled"; input: Json; result: Json|null; error_message: string|null; started_at:string|null; completed_at:string|null; created_at:string; run_after:string }; Insert: { owner_id?:string; job_type:string; idempotency_key:string; status?:"queued"|"running"|"succeeded"|"failed"|"cancelled"; input?:Json;run_after?:string }; Update: Partial<{status:"queued"|"running"|"succeeded"|"failed"|"cancelled";input:Json;result:Json;error_message:string|null;started_at:string|null;completed_at:string|null;run_after:string}>; Relationships: [] };
      app_settings: { Row: { owner_id:string; setting_key:string; setting_value:Json; updated_at:string }; Insert: {owner_id?:string;setting_key:string;setting_value:Json;updated_at?:string}; Update: Partial<{setting_value:Json;updated_at:string}>; Relationships: [] };
      discovery_batches: { Row: {id:string;owner_id:string;status:"queued"|"running"|"succeeded"|"failed"|"cancelled";submitted_count:number;created_count:number;existing_count:number;failed_count:number;created_at:string;completed_at:string|null}; Insert:{owner_id?:string;submitted_count:number;status?:"queued"|"running"|"succeeded"|"failed"|"cancelled"}; Update:Partial<{status:"queued"|"running"|"succeeded"|"failed"|"cancelled";created_count:number;existing_count:number;failed_count:number;completed_at:string}>; Relationships:[] };
      discovery_results: { Row:{id:string;owner_id:string;batch_id:string;submitted_url:string;canonical_url:string|null;status:"created"|"existing"|"failed";source_id:string|null;content_item_id:string|null;reason:string|null;created_at:string}; Insert:{owner_id?:string;batch_id:string;submitted_url:string;canonical_url?:string;status:"created"|"existing"|"failed";source_id?:string;content_item_id?:string;reason?:string}; Update:never; Relationships:[] };
      business_records: { Row:{id:string;owner_id:string;module:"collaboration"|"channel"|"retail"|"online_sales";name:string;description:string|null;status:"new"|"research"|"in_process"|"active"|"disqualified"|"complete";website_url:string|null;instagram_url:string|null;follower_count:number|null;notes:string|null;sort_order:number;created_at:string;updated_at:string}; Insert:Partial<{id:string;owner_id:string;description:string|null;website_url:string|null;instagram_url:string|null;follower_count:number|null;notes:string|null;sort_order:number;created_at:string;updated_at:string}> & {module:string;name:string;status:string}; Update:Record<string,unknown>; Relationships:[] };
      business_tasks: { Row:{id:string;owner_id:string;business_record_id:string;title:string;status:"new"|"research"|"in_process"|"active"|"disqualified"|"complete";due_at:string|null;notes:string|null;sort_order:number;created_at:string;updated_at:string}; Insert:{owner_id?:string;business_record_id:string;title:string;status?:"new"|"research"|"in_process"|"active"|"disqualified"|"complete"}; Update:Partial<{status:"new"|"research"|"in_process"|"active"|"disqualified"|"complete";updated_at:string}>; Relationships:[] };
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
