/*
  # Create storage bucket for documents

  1. New Storage
    - Create documents bucket for file uploads
    - Set up appropriate RLS policies for the bucket
*/

-- Create a storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read files shared with them based on folder permissions
CREATE POLICY "Users can read files in folders they have access to"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM public.folders 
    WHERE 
      ((permissions -> 'public')::text = 'true' OR
       auth.uid()::text = ANY(SELECT jsonb_array_elements_text(permissions -> 'users')) OR
       (SELECT role FROM public.users WHERE id = auth.uid()) = ANY(SELECT jsonb_array_elements_text(permissions -> 'roles')))
      AND id::text = (storage.foldername(name))[2]
  )
);