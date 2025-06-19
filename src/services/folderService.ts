import supabase from '../lib/supabase';
import { Database } from '../lib/database.types';

type Folder = Database['public']['Tables']['folders']['Row'];
type FolderInsert = Database['public']['Tables']['folders']['Insert'];

export async function getFolders() {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
  
  return data;
}

export async function getFolderTree() {
  const { data, error } = await supabase
    .from('folders')
    .select('*, documents:documents(id)')
    .order('name');
    
  if (error) {
    console.error('Error fetching folder tree:', error);
    throw error;
  }
  
  // Transform flat list into tree structure
  const folderMap = new Map<string, any>();
  const rootFolders: any[] = [];
  
  // First pass: create folder objects
  data.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      documentCount: folder.documents ? folder.documents.length : 0,
      children: []
    });
    
    delete folder.documents; // Remove the documents array
  });
  
  // Second pass: build the tree
  data.forEach(folder => {
    const folderWithChildren = folderMap.get(folder.id);
    
    if (folder.parent_id === null) {
      rootFolders.push(folderWithChildren);
    } else {
      const parent = folderMap.get(folder.parent_id);
      if (parent) {
        parent.children.push(folderWithChildren);
      }
    }
  });
  
  return rootFolders;
}

export async function createFolder(name: string, userId: string, parentId: string | null = null) {
  const newFolder: FolderInsert = {
    name,
    created_by: userId,
    parent_id: parentId,
  };
  
  const { data, error } = await supabase
    .from('folders')
    .insert(newFolder)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
  
  return data;
}

export async function updateFolder(id: string, updates: Partial<Folder>) {
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating folder:', error);
    throw error;
  }
  
  return data;
}

export async function deleteFolder(id: string) {
  // First check if folder has documents
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('id')
    .eq('folder_id', id);
    
  if (documentsError) throw documentsError;
  
  if (documents && documents.length > 0) {
    throw new Error('لا يمكن حذف المجلد لأنه يحتوي على مستندات');
  }
  
  // Check if folder has subfolders
  const { data: subfolders, error: subfoldersError } = await supabase
    .from('folders')
    .select('id')
    .eq('parent_id', id);
    
  if (subfoldersError) throw subfoldersError;
  
  if (subfolders && subfolders.length > 0) {
    throw new Error('لا يمكن حذف المجلد لأنه يحتوي على مجلدات فرعية');
  }
  
  // Delete the folder
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
  
  return true;
}