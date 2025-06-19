/*
  # Create audit reports table

  1. New Tables
    - `audit_reports`
      - `id` (uuid, primary key)
      - `title` (text)
      - `report_type` (enum)
      - `generated_by` (uuid, references users)
      - `document_ids` (jsonb)
      - `content` (text)
      - `status` (enum)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `audit_reports` table
    - Add policy for authenticated users to access reports they created or have permission to view
*/

CREATE TABLE IF NOT EXISTS audit_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  report_type text CHECK (report_type IN ('financial', 'performance', 'compliance')),
  generated_by uuid REFERENCES users(id) NOT NULL,
  document_ids jsonb DEFAULT '[]',
  content text,
  status text CHECK (status IN ('draft', 'review', 'final')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read audit reports they created"
  ON audit_reports
  FOR SELECT
  TO authenticated
  USING (
    generated_by = auth.uid() OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'senior_auditor')
  );

CREATE POLICY "Users can insert their own audit reports"
  ON audit_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (generated_by = auth.uid());

CREATE POLICY "Users can update audit reports they created"
  ON audit_reports
  FOR UPDATE
  TO authenticated
  USING (generated_by = auth.uid());

CREATE POLICY "Users can delete audit reports they created"
  ON audit_reports
  FOR DELETE
  TO authenticated
  USING (generated_by = auth.uid());