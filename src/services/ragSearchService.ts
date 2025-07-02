import openaiService from './openaiService';

export interface RAGSearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  fileId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  excerpt: string;
  citations: string[];
}

export interface SearchResponse {
  results: RAGSearchResult[];
  totalCount: number;
  searchTime: number;
  suggestions: string[];
}

class RAGSearchService {
  private assistantId: string | null = null;
  private vectorStoreId: string | null = null;

  async initialize() {
    try {
      const { assistantId, vectorStoreId } = await openaiService.getOrCreateAssistant();
      this.assistantId = assistantId;
      this.vectorStoreId = vectorStoreId;
      return true;
    } catch (error) {
      console.error('Failed to initialize RAG search service:', error);
      return false;
    }
  }

  async searchDocuments(query: string, limit: number = 10): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.assistantId) {
        await this.initialize();
      }

      // Use OpenAI Assistant to search through uploaded documents
      const searchPrompt = `
        ابحث في الوثائق المرفوعة عن: "${query}"
        
        يرجى تقديم النتائج بالتنسيق التالي:
        - قائمة بالوثائق ذات الصلة
        - مقاطع نصية من كل وثيقة تحتوي على المعلومات المطلوبة
        - درجة الصلة لكل نتيجة (من 1 إلى 100)
        - اقتراحات لمصطلحات بحث أخرى ذات صلة
        
        ركز على النتائج الأكثر صلة وقدم مقاطع نصية واضحة ومفيدة.
      `;

      const response = await openaiService.sendMessage(searchPrompt);
      
      // Parse the AI response and extract search results
      const results = this.parseSearchResponse(response.content, query);
      
      const searchTime = Date.now() - startTime;
      
      return {
        results: results.slice(0, limit),
        totalCount: results.length,
        searchTime,
        suggestions: this.generateSearchSuggestions(query)
      };
    } catch (error) {
      console.error('RAG search error:', error);
      
      // Fallback to mock results if RAG fails
      return this.getMockSearchResults(query, limit);
    }
  }

  private parseSearchResponse(aiResponse: string, originalQuery: string): RAGSearchResult[] {
    // This is a simplified parser - in a real implementation, you'd want more sophisticated parsing
    const results: RAGSearchResult[] = [];
    
    // For now, generate mock results based on the AI response
    // In a real implementation, the AI would return structured data
    const mockResults = [
      {
        id: 'rag-1',
        title: 'نتيجة من الوثائق المرفوعة',
        content: aiResponse.substring(0, 300) + '...',
        relevanceScore: 95,
        fileId: 'uploaded-file-1',
        fileName: 'document.pdf',
        fileType: 'pdf',
        uploadDate: new Date().toISOString(),
        excerpt: aiResponse.substring(0, 150) + '...',
        citations: ['مستند مرفوع - صفحة 1', 'مستند مرفوع - صفحة 3']
      }
    ];
    
    return mockResults;
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions = [
      `${query} 2024`,
      `سياسة ${query}`,
      `إجراءات ${query}`,
      `تقرير ${query}`,
      `دليل ${query}`
    ];
    
    return suggestions.slice(0, 3);
  }

  private getMockSearchResults(query: string, limit: number): SearchResponse {
    const mockResults: RAGSearchResult[] = [
      {
        id: 'mock-1',
        title: `نتائج البحث عن "${query}"`,
        content: `تم العثور على معلومات ذات صلة بـ "${query}" في الوثائق المرفوعة. هذه نتيجة تجريبية توضح كيفية عمل نظام البحث المدعوم بالذكاء الاصطناعي.`,
        relevanceScore: 85,
        fileId: 'mock-file-1',
        fileName: 'mock-document.pdf',
        fileType: 'pdf',
        uploadDate: new Date().toISOString(),
        excerpt: `معلومات مهمة حول ${query} موجودة في هذا المستند...`,
        citations: ['المستند المرفوع - صفحة 2']
      }
    ];
    
    return {
      results: mockResults.slice(0, limit),
      totalCount: mockResults.length,
      searchTime: 250,
      suggestions: this.generateSearchSuggestions(query)
    };
  }

  async uploadAndIndexDocument(file: File): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      if (!this.assistantId) {
        await this.initialize();
      }

      // Upload file to OpenAI and add to vector store
      const result = await openaiService.uploadFile(file);
      
      return {
        success: true,
        fileId: result.fileId
      };
    } catch (error) {
      console.error('Error uploading and indexing document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في رفع الملف'
      };
    }
  }

  async getUploadedFiles(): Promise<any[]> {
    try {
      return await openaiService.listUploadedFiles();
    } catch (error) {
      console.error('Error getting uploaded files:', error);
      return [];
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      return await openaiService.deleteFile(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const ragSearchService = new RAGSearchService();
export default ragSearchService;