/*
  # Create API configuration and logs tables

  1. New Tables
    - `api_configurations`
      - `id` (uuid, primary key)
      - `service_name` (text)
      - `service_type` (enum)
      - `endpoint_url` (text)
      - `api_key` (text)
      - `auth_type` (enum)
      - `headers` (jsonb)
      - `parameters` (jsonb)
      - `is_active` (boolean)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `api_usage_logs`
      - `id` (uuid, primary key)
      - `api_config_id` (uuid, references api_configurations)
      - `user_id` (uuid, references users)
      - `request_type` (text)
      - `response_status` (integer)
      - `response_time` (integer)
      - `request_size` (bigint)
      - `response_size` (bigint)
      - `error_message` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for appropriate access control
*/

CREATE TABLE IF NOT EXISTS api_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  service_type text CHECK (service_type IN ('file_upload', 'ai_chat', 'document_analysis', 'ocr', 'custom')),
  endpoint_url text NOT NULL,
  api_key text,
  auth_type text CHECK (auth_type IN ('api_key', 'bearer_token', 'oauth')),
  headers jsonb DEFAULT '{}',
  parameters jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_config_id uuid REFERENCES api_configurations(id),
  user_id uuid REFERENCES users(id),
  request_type text,
  response_status integer,
  response_time integer,
  request_size bigint,
  response_size bigint,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage API configurations"
  ON api_configurations
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can view API usage logs"
  ON api_usage_logs
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can view their own API usage logs"
  ON api_usage_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());