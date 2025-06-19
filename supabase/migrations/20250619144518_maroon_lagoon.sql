/*
  # Create folders table

  1. New Tables
    - `folders`
      - `id` (uuid, primary key)
      - `name` (text)
      - `parent_id` (uuid, references folders)
      - `created_by` (uuid, references users)
      - `permissions` (json)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `folders` table
    - Add policy for authenticated users to read folders they have access to
*/

CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES folders(id),
  created_by uuid REFERENCES users(id) NOT NULL,
  permissions jsonb DEFAULT '{"public": false, "roles": ["admin"], "users": []}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read folders they have access to"
  ON folders
  FOR SELECT
  TO authenticated
  USING (
    permissions->'public' = 'true'::jsonb OR
    created_by = auth.uid() OR
    auth.uid()::text IN (SELECT jsonb_array_elements_text(permissions->'users')) OR
    (SELECT role FROM users WHERE id = auth.uid()) IN (SELECT jsonb_array_elements_text(permissions->'roles'))
  );

CREATE POLICY "Users can insert their own folders"
  ON folders
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update folders they created"
  ON folders
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete folders they created"
  ON folders
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());