import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*, folders(name)')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
  
  return data;
}

export async function getDocumentsByFolder(folderId: string | null) {
  const query = supabase
    .from('documents')
    .select('*, folders(name)')
    .order('created_at', { ascending: false });
    
  if (folderId) {
    query.eq('folder_id', folderId);
  } else {
    query.is('folder_id', null);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching documents by folder:', error);
    throw error;
  }
  
  return data;
}

export async function uploadDocument(
  file: File, 
  userId: string,
  folderId: string | null = null,
  autoLabels: string[] = []
) {
  try {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    // 3. Create document record in the database
    const newDocument: DocumentInsert = {
      filename: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      folder_id: folderId,
      uploaded_by: userId,
      auto_labels: autoLabels,
    };
    
    const { data, error } = await supabase
      .from('documents')
      .insert(newDocument)
      .select()
      .single();
      
    if (error) throw error;
    
    return { ...data, publicUrl };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

export async function deleteDocument(id: string) {
  try {
    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Delete the file from storage
    if (document?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);
        
      if (storageError) throw storageError;
    }
    
    // Delete the document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

export async function updateDocumentLabels(id: string, labels: string[]) {
  const { data, error } = await supabase
    .from('documents')
    .update({ manual_labels: labels })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating document labels:', error);
    throw error;
  }
  
  return data;
}