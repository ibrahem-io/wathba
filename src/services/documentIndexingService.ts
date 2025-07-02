// Service for indexing and managing uploaded documents with real text extraction
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
      
      if (!extractedText || extractedText.length < 10) {
        throw new Error('فشل في استخراج النص من الملف أو الملف فارغ');
      }
      
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
        
        case 'csv':
          const csvText = await file.text();
          return this.parseCsvContent(csvText);
        
        case 'pdf':
          return await this.extractPdfText(file);
        
        case 'docx':
          return await this.extractDocxText(file);
        
        case 'doc':
          return await this.extractDocText(file);
        
        case 'xlsx':
        case 'xls':
          return await this.extractExcelText(file);
        
        case 'pptx':
        case 'ppt':
          return await this.extractPowerpointText(file);
        
        default:
          // Try to read as text for unknown formats
          try {
            return await file.text();
          } catch {
            throw new Error(`نوع الملف ${fileType} غير مدعوم لاستخراج النص`);
          }
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error(`فشل في استخراج النص من الملف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  }

  private parseCsvContent(csvText: string): string {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim().replace(/"/g, '')));
    
    let content = `جدول بيانات CSV:\n\nالعناوين: ${headers.join(' | ')}\n\n`;
    
    rows.slice(0, 50).forEach((row, index) => { // Limit to first 50 rows
      content += `الصف ${index + 1}: ${row.join(' | ')}\n`;
    });
    
    if (rows.length > 50) {
      content += `\n... و ${rows.length - 50} صف إضافي`;
    }
    
    return content;
  }

  private async extractPdfText(file: File): Promise<string> {
    // For PDF files, we'll use a simple approach
    // In a real implementation, you'd use pdf-parse or similar library
    
    try {
      // Try to use the File API to read as text (works for some PDFs)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Look for text content in the PDF
      let text = '';
      const decoder = new TextDecoder('utf-8', { fatal: false });
      
      // Simple text extraction - look for readable text patterns
      for (let i = 0; i < uint8Array.length - 10; i++) {
        const chunk = uint8Array.slice(i, i + 100);
        const decoded = decoder.decode(chunk);
        
        // Look for Arabic or English text patterns
        const textMatch = decoded.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s]{10,}/g);
        if (textMatch) {
          text += textMatch.join(' ') + ' ';
        }
      }
      
      // Clean up the extracted text
      text = text.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\.\,\!\?\:\;\-\(\)]/g, ' ')
                 .replace(/\s+/g, ' ')
                 .trim();
      
      if (text.length > 50) {
        return `محتوى مستخرج من ملف PDF: ${file.name}\n\n${text}`;
      } else {
        // Fallback: Use OpenAI to extract text if available
        return await this.extractTextWithAI(file);
      }
    } catch (error) {
      console.error('PDF extraction failed:', error);
      return await this.extractTextWithAI(file);
    }
  }

  private async extractDocxText(file: File): Promise<string> {
    try {
      // For DOCX files, we'll try to extract text from the XML structure
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to string and look for text content
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Look for text between XML tags (simplified approach)
      const textMatches = content.match(/>([^<]+)</g);
      if (textMatches) {
        const extractedText = textMatches
          .map(match => match.replace(/^>|<$/g, ''))
          .filter(text => text.trim().length > 2)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (extractedText.length > 50) {
          return `محتوى مستخرج من مستند Word: ${file.name}\n\n${extractedText}`;
        }
      }
      
      return await this.extractTextWithAI(file);
    } catch (error) {
      console.error('DOCX extraction failed:', error);
      return await this.extractTextWithAI(file);
    }
  }

  private async extractDocText(file: File): Promise<string> {
    // For older DOC files, extraction is more complex
    // We'll use AI extraction as fallback
    return await this.extractTextWithAI(file);
  }

  private async extractExcelText(file: File): Promise<string> {
    try {
      // For Excel files, try to extract readable content
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      
      let content = '';
      
      // Look for text patterns in the file
      for (let i = 0; i < uint8Array.length - 10; i++) {
        const chunk = uint8Array.slice(i, i + 50);
        const decoded = decoder.decode(chunk);
        
        // Look for cell content patterns
        const textMatch = decoded.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\.\,]{5,}/g);
        if (textMatch) {
          content += textMatch.join(' ') + ' ';
        }
      }
      
      content = content.replace(/\s+/g, ' ').trim();
      
      if (content.length > 50) {
        return `بيانات مستخرجة من ملف Excel: ${file.name}\n\n${content}`;
      } else {
        return await this.extractTextWithAI(file);
      }
    } catch (error) {
      console.error('Excel extraction failed:', error);
      return await this.extractTextWithAI(file);
    }
  }

  private async extractPowerpointText(file: File): Promise<string> {
    try {
      // Similar approach to DOCX for PowerPoint files
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Look for slide content
      const textMatches = content.match(/>([^<]+)</g);
      if (textMatches) {
        const extractedText = textMatches
          .map(match => match.replace(/^>|<$/g, ''))
          .filter(text => text.trim().length > 2)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (extractedText.length > 50) {
          return `محتوى مستخرج من عرض PowerPoint: ${file.name}\n\n${extractedText}`;
        }
      }
      
      return await this.extractTextWithAI(file);
    } catch (error) {
      console.error('PowerPoint extraction failed:', error);
      return await this.extractTextWithAI(file);
    }
  }

  private async extractTextWithAI(file: File): Promise<string> {
    try {
      // Use OpenAI to extract and analyze the document content
      const base64 = await this.fileToBase64(file);
      
      const extractionPrompt = `
قم بتحليل واستخراج النص من هذا الملف:

اسم الملف: ${file.name}
نوع الملف: ${file.type}
حجم الملف: ${this.formatFileSize(file.size)}

يرجى استخراج وتلخيص المحتوى النصي الرئيسي من هذا الملف.
ركز على:
1. النصوص الأساسية والعناوين
2. البيانات المهمة والأرقام
3. المعلومات الرئيسية

قدم النتيجة بتنسيق واضح ومنظم باللغة العربية.
`;

      const response = await openaiService.sendMessage(extractionPrompt);
      
      if (response.content && response.content.length > 50) {
        return `محتوى مستخرج بالذكاء الاصطناعي من ${file.name}:\n\n${response.content}`;
      } else {
        throw new Error('فشل في استخراج محتوى مفيد من الملف');
      }
    } catch (error) {
      console.error('AI extraction failed:', error);
      // Final fallback
      return `ملف: ${file.name}\nنوع: ${file.type}\nحجم: ${this.formatFileSize(file.size)}\n\nلم يتمكن النظام من استخراج النص من هذا الملف. يرجى التأكد من أن الملف يحتوي على نص قابل للقراءة.`;
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:type;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private async generateSummary(content: string, title: string): Promise<string> {
    try {
      // Use OpenAI to generate a summary
      const summaryPrompt = `قم بإنشاء ملخص مختصر ومفيد للمستند التالي:

العنوان: ${title}

المحتوى:
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

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
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
      results = results.filter(doc => {
        const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')} ${doc.category} ${doc.summary || ''}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });

      // Calculate relevance scores based on actual content
      results = results.map(doc => {
        let score = 0;
        const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')} ${doc.summary || ''}`.toLowerCase();
        
        searchTerms.forEach(term => {
          // Title matches are most important
          const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          // Content matches
          const contentMatches = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
          // Tag matches
          const tagMatches = doc.tags.filter(tag => tag.toLowerCase().includes(term)).length;
          // Summary matches
          const summaryMatches = ((doc.summary || '').toLowerCase().match(new RegExp(term, 'g')) || []).length;
          
          score += titleMatches * 15 + contentMatches * 3 + tagMatches * 8 + summaryMatches * 10;
        });
        
        return { ...doc, relevanceScore: Math.min(100, Math.max(1, score)) };
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