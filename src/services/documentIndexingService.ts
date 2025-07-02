// Service for indexing and managing uploaded documents
import openaiService from './openaiService';

export interface IndexedDocument {
  id: string;
  filename: string;
  title: string;
  content: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  tags: string[];
  category: string;
  author: string;
  openaiFileId?: string;
  vectorStoreFileId?: string;
  extractedText?: string;
  summary?: string;
}

class DocumentIndexingService {
  private documents: Map<string, IndexedDocument> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load documents from localStorage (in public mode) or from Supabase
      await this.loadStoredDocuments();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize document indexing service:', error);
    }
  }

  private async loadStoredDocuments() {
    // Load from localStorage for public mode
    const storedDocs = localStorage.getItem('indexedDocuments');
    if (storedDocs) {
      const docs: IndexedDocument[] = JSON.parse(storedDocs);
      docs.forEach(doc => this.documents.set(doc.id, doc));
    }
  }

  private saveToStorage() {
    // Save to localStorage for public mode
    const docs = Array.from(this.documents.values());
    localStorage.setItem('indexedDocuments', JSON.stringify(docs));
  }

  async indexDocument(
    file: File, 
    metadata: {
      title: string;
      description: string;
      tags: string[];
      category: string;
    }
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Extract text content from file
      const extractedText = await this.extractTextFromFile(file);
      
      // Generate summary using AI
      const summary = await this.generateSummary(extractedText, metadata.title);
      
      // Upload to OpenAI RAG system
      let openaiFileId: string | undefined;
      let vectorStoreFileId: string | undefined;
      
      try {
        const ragResult = await openaiService.uploadFile(file);
        openaiFileId = ragResult.fileId;
        vectorStoreFileId = ragResult.vectorStoreFileId;
      } catch (error) {
        console.warn('Failed to upload to RAG system:', error);
      }

      // Create indexed document
      const indexedDoc: IndexedDocument = {
        id: documentId,
        filename: file.name,
        title: metadata.title,
        content: extractedText,
        fileType: this.getFileExtension(file.name),
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        tags: metadata.tags,
        category: metadata.category,
        author: 'مستخدم النظام',
        openaiFileId,
        vectorStoreFileId,
        extractedText,
        summary
      };

      // Store the document
      this.documents.set(documentId, indexedDoc);
      this.saveToStorage();

      return { success: true, documentId };
    } catch (error) {
      console.error('Error indexing document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'فشل في فهرسة المستند' 
      };
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const fileType = this.getFileExtension(file.name);
    
    try {
      switch (fileType) {
        case 'txt':
          return await file.text();
        
        case 'pdf':
          // For PDF files, we'll simulate text extraction
          // In a real implementation, you'd use a PDF parsing library
          return `محتوى مستخرج من ملف PDF: ${file.name}\n\nهذا نص تجريبي يمثل المحتوى المستخرج من ملف PDF. في التطبيق الحقيقي، سيتم استخراج النص الفعلي من الملف.`;
        
        case 'docx':
        case 'doc':
          // For Word documents, simulate text extraction
          return `محتوى مستخرج من مستند Word: ${file.name}\n\nهذا نص تجريبي يمثل المحتوى المستخرج من مستند Word. يتضمن النص الأساسي والعناوين والفقرات.`;
        
        case 'xlsx':
        case 'xls':
          // For Excel files, simulate data extraction
          return `بيانات مستخرجة من ملف Excel: ${file.name}\n\nالجدول 1: البيانات المالية\nالعمود أ: التواريخ\nالعمود ب: المبالغ\nالعمود ج: الوصف`;
        
        default:
          return `محتوى الملف: ${file.name}\nنوع الملف: ${fileType}\nحجم الملف: ${file.size} بايت`;
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      return `فشل في استخراج النص من الملف: ${file.name}`;
    }
  }

  private async generateSummary(content: string, title: string): Promise<string> {
    try {
      // Use OpenAI to generate a summary
      const summaryPrompt = `قم بإنشاء ملخص مختصر ومفيد للمستند التالي:

العنوان: ${title}

المحتوى:
${content.substring(0, 2000)}...

يرجى تقديم ملخص باللغة العربية يتضمن:
1. الموضوع الرئيسي
2. النقاط المهمة
3. الغرض من المستند

الملخص يجب أن يكون في 2-3 جمل فقط.`;

      const response = await openaiService.sendMessage(summaryPrompt);
      return response.content.substring(0, 500); // Limit summary length
    } catch (error) {
      console.error('Error generating summary:', error);
      return `ملخص تلقائي: ${title} - مستند يحتوي على معلومات مهمة متعلقة بالموضوع المحدد.`;
    }
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'unknown';
  }

  async searchDocuments(
    query: string,
    filters?: {
      fileTypes?: string[];
      tags?: string[];
      dateRange?: { start: string; end: string };
    }
  ): Promise<IndexedDocument[]> {
    await this.initialize();
    
    let results = Array.from(this.documents.values());

    // Apply text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(doc => {
        const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')} ${doc.category}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });

      // Calculate relevance scores
      results = results.map(doc => {
        let score = 0;
        const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
        
        searchTerms.forEach(term => {
          const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          const contentMatches = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          const tagMatches = doc.tags.filter(tag => tag.toLowerCase().includes(term)).length;
          
          score += titleMatches * 10 + contentMatches * 2 + tagMatches * 5;
        });
        
        return { ...doc, relevanceScore: Math.min(100, score) };
      }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    // Apply filters
    if (filters?.fileTypes?.length) {
      results = results.filter(doc => filters.fileTypes!.includes(doc.fileType));
    }

    if (filters?.tags?.length) {
      results = results.filter(doc => 
        filters.tags!.some(tag => doc.tags.some(docTag => docTag.includes(tag)))
      );
    }

    if (filters?.dateRange?.start) {
      results = results.filter(doc => new Date(doc.uploadDate) >= new Date(filters.dateRange!.start));
    }

    if (filters?.dateRange?.end) {
      results = results.filter(doc => new Date(doc.uploadDate) <= new Date(filters.dateRange!.end));
    }

    return results;
  }

  async getDocument(id: string): Promise<IndexedDocument | null> {
    await this.initialize();
    return this.documents.get(id) || null;
  }

  async getAllDocuments(): Promise<IndexedDocument[]> {
    await this.initialize();
    return Array.from(this.documents.values()).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const doc = this.documents.get(id);
      if (!doc) return false;

      // Delete from OpenAI if it was uploaded there
      if (doc.openaiFileId) {
        try {
          await openaiService.deleteFile(doc.openaiFileId);
        } catch (error) {
          console.warn('Failed to delete from OpenAI:', error);
        }
      }

      // Remove from local storage
      this.documents.delete(id);
      this.saveToStorage();

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  async getDocumentStats() {
    await this.initialize();
    const docs = Array.from(this.documents.values());
    
    const stats = {
      totalDocuments: docs.length,
      totalSize: docs.reduce((sum, doc) => sum + doc.fileSize, 0),
      fileTypes: {} as Record<string, number>,
      categories: {} as Record<string, number>,
      ragEnabled: docs.filter(doc => doc.openaiFileId).length
    };

    docs.forEach(doc => {
      stats.fileTypes[doc.fileType] = (stats.fileTypes[doc.fileType] || 0) + 1;
      stats.categories[doc.category] = (stats.categories[doc.category] || 0) + 1;
    });

    return stats;
  }
}

export const documentIndexingService = new DocumentIndexingService();
export default documentIndexingService;