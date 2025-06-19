export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'senior_auditor' | 'auditor' | 'viewer'
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: 'admin' | 'senior_auditor' | 'auditor' | 'viewer'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'senior_auditor' | 'auditor' | 'viewer'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          created_by: string
          permissions: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          created_by: string
          permissions?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          created_by?: string
          permissions?: Json
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          filename: string
          file_path: string
          file_type: string | null
          file_size: number | null
          folder_id: string | null
          uploaded_by: string
          auto_labels: Json
          manual_labels: Json
          risk_score: number | null
          content_summary: string | null
          extracted_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          folder_id?: string | null
          uploaded_by: string
          auto_labels?: Json
          manual_labels?: Json
          risk_score?: number | null
          content_summary?: string | null
          extracted_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          folder_id?: string | null
          uploaded_by?: string
          auto_labels?: Json
          manual_labels?: Json
          risk_score?: number | null
          content_summary?: string | null
          extracted_text?: string | null
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          session_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          session_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          folder_id?: string | null
          session_name?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          message: string
          response: string | null
          citations: Json
          message_type: 'user' | 'assistant'
          api_response_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          message: string
          response?: string | null
          citations?: Json
          message_type: 'user' | 'assistant'
          api_response_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          message?: string
          response?: string | null
          citations?: Json
          message_type?: 'user' | 'assistant'
          api_response_time?: number | null
          created_at?: string
        }
      }
      audit_reports: {
        Row: {
          id: string
          title: string
          report_type: 'financial' | 'performance' | 'compliance'
          generated_by: string
          document_ids: Json
          content: string | null
          status: 'draft' | 'review' | 'final'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          report_type: 'financial' | 'performance' | 'compliance'
          generated_by: string
          document_ids?: Json
          content?: string | null
          status?: 'draft' | 'review' | 'final'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          report_type?: 'financial' | 'performance' | 'compliance'
          generated_by?: string
          document_ids?: Json
          content?: string | null
          status?: 'draft' | 'review' | 'final'
          created_at?: string
        }
      }
      api_configurations: {
        Row: {
          id: string
          service_name: string
          service_type: 'file_upload' | 'ai_chat' | 'document_analysis' | 'ocr' | 'custom'
          endpoint_url: string
          api_key: string | null
          auth_type: 'api_key' | 'bearer_token' | 'oauth'
          headers: Json
          parameters: Json
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_name: string
          service_type: 'file_upload' | 'ai_chat' | 'document_analysis' | 'ocr' | 'custom'
          endpoint_url: string
          api_key?: string | null
          auth_type: 'api_key' | 'bearer_token' | 'oauth'
          headers?: Json
          parameters?: Json
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_name?: string
          service_type?: 'file_upload' | 'ai_chat' | 'document_analysis' | 'ocr' | 'custom'
          endpoint_url?: string
          api_key?: string | null
          auth_type?: 'api_key' | 'bearer_token' | 'oauth'
          headers?: Json
          parameters?: Json
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      api_usage_logs: {
        Row: {
          id: string
          api_config_id: string | null
          user_id: string | null
          request_type: string | null
          response_status: number | null
          response_time: number | null
          request_size: number | null
          response_size: number | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          api_config_id?: string | null
          user_id?: string | null
          request_type?: string | null
          response_status?: number | null
          response_time?: number | null
          request_size?: number | null
          response_size?: number | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          api_config_id?: string | null
          user_id?: string | null
          request_type?: string | null
          response_status?: number | null
          response_time?: number | null
          request_size?: number | null
          response_size?: number | null
          error_message?: string | null
          created_at?: string
        }
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
  }
}