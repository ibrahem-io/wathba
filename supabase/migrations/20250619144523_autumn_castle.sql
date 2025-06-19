/*
  # Create documents table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `file_path` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `folder_id` (uuid, references folders)
      - `uploaded_by` (uuid, references users)
      - `auto_labels` (jsonb)
      - `manual_labels` (jsonb)
      - `risk_score` (integer)
      - `content_summary` (text)
      - `extracted_text` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `documents` table
    - Add policy for authenticated users to read documents they have access to
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  folder_id uuid REFERENCES folders(id),
  uploaded_by uuid REFERENCES users(id) NOT NULL,
  auto_labels jsonb DEFAULT '[]',
  manual_labels jsonb DEFAULT '[]',
  risk_score integer,
  content_summary text,
  extracted_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read documents they have access to"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    folder_id IN (
      SELECT id FROM folders WHERE
        permissions->'public' = 'true'::jsonb OR
        created_by = auth.uid() OR
        auth.uid()::text IN (SELECT jsonb_array_elements_text(permissions->'users')) OR
        (SELECT role FROM users WHERE id = auth.uid()) IN (SELECT jsonb_array_elements_text(permissions->'roles'))
    )
  );

CREATE POLICY "Users can insert their own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can update documents they uploaded"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete documents they uploaded"
  ON documents
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());