import { supabase } from '../lib/supabase';
import { elasticsearchService } from './elasticsearchService';
import openaiService from './openaiService';

interface IndexingResult {
  success: boolean;
  documentId?: string;
  errors?: string[];
}

interface DocumentMetadata {
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  folderId?: string;
  extractedText?: string;
  summary?: string;
}

class EnhancedDocumentIndexingService {
  async indexDocument(file: File, metadata: DocumentMetadata): Promise<IndexingResult> {
    const errors: string[] = [];
    let documentId: string | undefined;

    try {
      // 1. Store document in Supabase
      const supabaseResult = await this.storeInSupabase(file, metadata);
      if (supabaseResult.success) {
        documentId = supabaseResult.documentId;
      } else {
        errors.push('Failed to store in Supabase');
      }

      // 2. Extract text content
      const textContent = await this.extractTextContent(file);
      
      // 3. Index in Elasticsearch (if configured)
      if (elasticsearchService.isConfigured()) {
        try {
          const elasticResult = await this.indexInElasticsearch(documentId || 'temp', {
            ...metadata,
            content: textContent
          });
          if (!elasticResult.success) {
            errors.push('Failed to index in Elasticsearch');
          }
        } catch (error) {
          console.error('Elasticsearch indexing failed:', error);
          errors.push('Elasticsearch indexing failed');
        }
      }

      // 4. Upload to OpenAI (if configured)
      if (openaiService.isConfigured()) {
        try {
          await openaiService.uploadFile(file);
        } catch (error) {
          console.error('OpenAI upload failed:', error);
          errors.push('OpenAI upload failed');
        }
      }

      // 5. Generate embeddings and store in Supabase for semantic search
      try {
        await this.generateAndStoreEmbeddings(documentId || 'temp', textContent);
      } catch (error) {
        console.error('Embedding generation failed:', error);
        errors.push('Embedding generation failed');
      }

      return {
        success: errors.length === 0 || documentId !== undefined,
        documentId,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Document indexing error:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async storeInSupabase(file: File, metadata: DocumentMetadata): Promise<{ success: boolean; documentId?: string }> {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return { success: false };
      }

      // Store document metadata in database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          filename: metadata.filename,
          file_path: filePath,
          file_type: metadata.fileType,
          file_size: metadata.fileSize,
          folder_id: metadata.folderId,
          uploaded_by: metadata.uploadedBy,
          extracted_text: metadata.extractedText,
          content_summary: metadata.summary
        })
        .select()
        .single();

      if (docError) {
        console.error('Document metadata error:', docError);
        return { success: false };
      }

      return { success: true, documentId: docData.id };
    } catch (error) {
      console.error('Supabase storage error:', error);
      return { success: false };
    }
  }

  private async indexInElasticsearch(documentId: string, document: any): Promise<{ success: boolean }> {
    try {
      const result = await elasticsearchService.indexDocument('mof-documents', documentId, {
        title: document.filename,
        content: document.content || '',
        filename: document.filename,
        file_type: document.fileType,
        file_size: document.fileSize,
        uploaded_by: document.uploadedBy,
        folder_id: document.folderId,
        created_at: new Date().toISOString(),
        metadata: {
          summary: document.summary
        }
      });

      return { success: result.success };
    } catch (error) {
      console.error('Elasticsearch indexing error:', error);
      return { success: false };
    }
  }

  private async extractTextContent(file: File): Promise<string> {
    // Simple text extraction - in a real implementation, you'd use
    // libraries like pdf-parse, mammoth, etc. for different file types
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // For other file types, return filename as placeholder
    return `Document: ${file.name}`;
  }

  private async generateAndStoreEmbeddings(documentId: string, content: string): Promise<void> {
    // This would typically use OpenAI's embedding API or another embedding service
    // For now, we'll skip this step if OpenAI is not configured
    if (!openaiService.isConfigured()) {
      console.log('Skipping embedding generation - OpenAI not configured');
      return;
    }

    // In a real implementation, you would:
    // 1. Generate embeddings using OpenAI's embedding API
    // 2. Store them in Supabase for semantic search
    console.log('Embedding generation would happen here for document:', documentId);
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const errors: string[] = [];

      // Delete from Supabase
      const { error: supabaseError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (supabaseError) {
        errors.push('Failed to delete from Supabase');
      }

      // Delete from Elasticsearch (if configured)
      if (elasticsearchService.isConfigured()) {
        try {
          await elasticsearchService.deleteDocument('mof-documents', documentId);
        } catch (error) {
          errors.push('Failed to delete from Elasticsearch');
        }
      }

      return errors.length === 0;
    } catch (error) {
      console.error('Document deletion error:', error);
      return false;
    }
  }

  async getIndexingCapabilities(): Promise<{
    supabase: boolean;
    elasticsearch: boolean;
    openai: boolean;
  }> {
    return {
      supabase: true, // Always available
      elasticsearch: elasticsearchService.isConfigured(),
      openai: openaiService.isConfigured()
    };
  }
}

export const enhancedDocumentIndexingService = new EnhancedDocumentIndexingService();
export default enhancedDocumentIndexingService;