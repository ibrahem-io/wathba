/*
  # Create chat tables

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `folder_id` (uuid, references folders)
      - `session_name` (text)
      - `created_at` (timestamp)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references chat_sessions)
      - `message` (text)
      - `response` (text)
      - `citations` (jsonb)
      - `message_type` (enum)
      - `api_response_time` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to access their own chat data
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  folder_id uuid REFERENCES folders(id),
  session_name text DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) NOT NULL,
  message text NOT NULL,
  response text,
  citations jsonb DEFAULT '[]',
  message_type text CHECK (message_type IN ('user', 'assistant')),
  api_response_time integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read their own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own chat messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own chat messages"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid()));