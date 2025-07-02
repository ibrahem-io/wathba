import openaiService from './openaiService';
import documentIndexingService from './documentIndexingService';

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

      // Get uploaded documents count
      const uploadedFiles = await this.getUploadedFiles();
      if (uploadedFiles.length === 0) {
        return {
          results: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
          suggestions: []
        };
      }

      // Use OpenAI Assistant to search through uploaded documents
      const searchPrompt = `
        ابحث في الوثائق المرفوعة عن: "${query}"
        
        يرجى تقديم النتائج بالتنسيق التالي لكل وثيقة ذات صلة:
        
        [DOCUMENT_START]
        العنوان: [عنوان الوثيقة]
        المحتوى: [مقطع نصي من الوثيقة يحتوي على المعلومات المطلوبة]
        الصلة: [درجة من 1 إلى 100]
        المرجع: [اسم الملف أو مصدر المعلومة]
        [DOCUMENT_END]
        
        ركز على النتائج الأكثر صلة وقدم مقاطع نصية واضحة ومفيدة.
        إذا لم تجد معلومات ذات صلة، اذكر ذلك بوضوح.
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
      
      // Return empty results if RAG fails
      return {
        results: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        suggestions: []
      };
    }
  }

  private parseSearchResponse(aiResponse: string, originalQuery: string): RAGSearchResult[] {
    const results: RAGSearchResult[] = [];
    
    try {
      // Parse the structured response from AI
      const documentBlocks = aiResponse.split('[DOCUMENT_START]').slice(1);
      
      documentBlocks.forEach((block, index) => {
        const endIndex = block.indexOf('[DOCUMENT_END]');
        if (endIndex === -1) return;
        
        const content = block.substring(0, endIndex).trim();
        const lines = content.split('\n').filter(line => line.trim());
        
        let title = `نتيجة ${index + 1}`;
        let documentContent = '';
        let relevanceScore = 50;
        let reference = 'مستند مرفوع';
        
        lines.forEach(line => {
          if (line.includes('العنوان:')) {
            title = line.replace('العنوان:', '').trim();
          } else if (line.includes('المحتوى:')) {
            documentContent = line.replace('المحتوى:', '').trim();
          } else if (line.includes('الصلة:')) {
            const scoreMatch = line.match(/\d+/);
            if (scoreMatch) {
              relevanceScore = parseInt(scoreMatch[0]);
            }
          } else if (line.includes('المرجع:')) {
            reference = line.replace('المرجع:', '').trim();
          }
        });
        
        if (documentContent) {
          results.push({
            id: `rag-${Date.now()}-${index}`,
            title,
            content: documentContent,
            relevanceScore,
            fileId: `file-${index}`,
            fileName: reference,
            fileType: 'pdf',
            uploadDate: new Date().toISOString(),
            excerpt: documentContent.substring(0, 150) + '...',
            citations: [reference]
          });
        }
      });
      
      // If no structured results found, create a general result
      if (results.length === 0 && aiResponse.trim()) {
        results.push({
          id: `rag-general-${Date.now()}`,
          title: `نتائج البحث عن "${originalQuery}"`,
          content: aiResponse.substring(0, 500),
          relevanceScore: 75,
          fileId: 'general-search',
          fileName: 'نتائج عامة',
          fileType: 'text',
          uploadDate: new Date().toISOString(),
          excerpt: aiResponse.substring(0, 150) + '...',
          citations: ['الوثائق المرفوعة']
        });
      }
    } catch (error) {
      console.error('Error parsing RAG response:', error);
    }
    
    return results;
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions = [
      `${query} 2024`,
      `سياسة ${query}`,
      `إجراءات ${query}`,
      `تقرير ${query}`,
      `دليل ${query}`,
      `معايير ${query}`
    ];
    
    return suggestions.slice(0, 3);
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