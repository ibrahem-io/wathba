// Service for OpenAI Assistant-powered semantic search
import openaiService from './openaiService';

export interface AssistantSearchResult {
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
  isSemanticMatch: boolean;
  matchedSections: string[];
  semanticSummary: string;
}

export interface AssistantSearchResponse {
  results: AssistantSearchResult[];
  totalCount: number;
  searchTime: number;
  suggestions: string[];
  threadId?: string;
}

class OpenAIAssistantSearchService {
  private assistantId: string | null = null;
  private vectorStoreId: string | null = null;
  private searchThreads: Map<string, string> = new Map(); // query -> threadId

  async initialize(): Promise<boolean> {
    try {
      const { assistantId, vectorStoreId } = await openaiService.getOrCreateAssistant();
      this.assistantId = assistantId;
      this.vectorStoreId = vectorStoreId;
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI Assistant search service:', error);
      return false;
    }
  }

  async searchDocuments(query: string, limit: number = 20): Promise<AssistantSearchResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.assistantId) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize OpenAI Assistant');
        }
      }

      // Check if we have uploaded files
      const uploadedFiles = await this.getUploadedFiles();
      if (uploadedFiles.length === 0) {
        return {
          results: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
          suggestions: this.generateSearchSuggestions(query)
        };
      }

      // Create a search-optimized prompt for the assistant
      const searchPrompt = this.createSearchPrompt(query, limit);

      // Use existing thread for this query or create new one
      let threadId = this.searchThreads.get(query);
      
      // Send message to assistant with file search enabled
      const response = await openaiService.sendMessage(searchPrompt, threadId);
      
      if (response.threadId) {
        this.searchThreads.set(query, response.threadId);
        threadId = response.threadId;
      }

      // Parse the assistant's response to extract search results
      const results = this.parseAssistantSearchResponse(response.content, query);
      
      const searchTime = Date.now() - startTime;
      
      return {
        results: results.slice(0, limit),
        totalCount: results.length,
        searchTime,
        suggestions: this.generateSearchSuggestions(query),
        threadId
      };
    } catch (error) {
      console.error('OpenAI Assistant search error:', error);
      
      return {
        results: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        suggestions: []
      };
    }
  }

  private createSearchPrompt(query: string, limit: number): string {
    return `
أنت مساعد بحث ذكي متخصص في البحث الدلالي في الوثائق. قم بالبحث في الوثائق المرفوعة عن: "${query}"

يرجى تقديم النتائج بالتنسيق التالي لكل وثيقة ذات صلة (حتى ${limit} نتيجة):

[SEARCH_RESULT_START]
العنوان: [عنوان الوثيقة أو اسم الملف]
درجة الصلة: [رقم من 1 إلى 100 يعبر عن مدى صلة الوثيقة بالاستعلام]
ملخص الصلة: [شرح مختصر لسبب صلة هذه الوثيقة بالاستعلام]
المحتوى المطابق: [مقطع نصي من الوثيقة يحتوي على المعلومات المطلوبة - حتى 200 كلمة]
المقاطع الإضافية: [مقاطع أخرى ذات صلة مفصولة بـ "|||"]
المرجع: [اسم الملف أو مصدر المعلومة]
[SEARCH_RESULT_END]

متطلبات البحث:
1. ركز على المعنى والسياق وليس فقط الكلمات المطابقة
2. ابحث عن المفاهيم والأفكار المرتبطة بالاستعلام
3. رتب النتائج حسب الصلة (الأعلى أولاً)
4. قدم مقاطع نصية واضحة ومفيدة من الوثائق
5. إذا لم تجد معلومات ذات صلة مباشرة، ابحث عن مواضيع مرتبطة

إذا لم تجد أي معلومات ذات صلة، اذكر ذلك بوضوح واقترح مصطلحات بحث بديلة.
`;
  }

  private parseAssistantSearchResponse(aiResponse: string, originalQuery: string): AssistantSearchResult[] {
    const results: AssistantSearchResult[] = [];
    
    try {
      // Parse the structured response from the assistant
      const resultBlocks = aiResponse.split('[SEARCH_RESULT_START]').slice(1);
      
      resultBlocks.forEach((block, index) => {
        const endIndex = block.indexOf('[SEARCH_RESULT_END]');
        if (endIndex === -1) return;
        
        const content = block.substring(0, endIndex).trim();
        const lines = content.split('\n').filter(line => line.trim());
        
        let title = `نتيجة البحث ${index + 1}`;
        let relevanceScore = 50;
        let semanticSummary = '';
        let matchedContent = '';
        let additionalSections: string[] = [];
        let reference = 'وثيقة مرفوعة';
        
        lines.forEach(line => {
          const cleanLine = line.trim();
          if (cleanLine.includes('العنوان:')) {
            title = cleanLine.replace('العنوان:', '').trim();
          } else if (cleanLine.includes('درجة الصلة:')) {
            const scoreMatch = cleanLine.match(/\d+/);
            if (scoreMatch) {
              relevanceScore = Math.min(100, Math.max(1, parseInt(scoreMatch[0])));
            }
          } else if (cleanLine.includes('ملخص الصلة:')) {
            semanticSummary = cleanLine.replace('ملخص الصلة:', '').trim();
          } else if (cleanLine.includes('المحتوى المطابق:')) {
            matchedContent = cleanLine.replace('المحتوى المطابق:', '').trim();
          } else if (cleanLine.includes('المقاطع الإضافية:')) {
            const sectionsText = cleanLine.replace('المقاطع الإضافية:', '').trim();
            additionalSections = sectionsText.split('|||').map(s => s.trim()).filter(s => s);
          } else if (cleanLine.includes('المرجع:')) {
            reference = cleanLine.replace('المرجع:', '').trim();
          }
        });
        
        if (matchedContent && relevanceScore > 20) {
          const allSections = [matchedContent, ...additionalSections].filter(s => s);
          
          results.push({
            id: `assistant-search-${Date.now()}-${index}`,
            title: title || `نتيجة من ${reference}`,
            content: matchedContent,
            relevanceScore,
            fileId: `file-${index}`,
            fileName: reference,
            fileType: this.extractFileType(reference),
            uploadDate: new Date().toISOString(),
            excerpt: matchedContent.substring(0, 200) + (matchedContent.length > 200 ? '...' : ''),
            citations: [reference],
            isSemanticMatch: true,
            matchedSections: allSections.slice(0, 5), // Limit to 5 sections
            semanticSummary: semanticSummary || `نتيجة بحث دلالي لـ "${originalQuery}"`
          });
        }
      });
      
      // If no structured results found but we have content, create a general result
      if (results.length === 0 && aiResponse.trim() && !aiResponse.includes('لم أجد') && !aiResponse.includes('لا توجد')) {
        results.push({
          id: `assistant-general-${Date.now()}`,
          title: `نتائج البحث الدلالي عن "${originalQuery}"`,
          content: aiResponse.substring(0, 800),
          relevanceScore: 75,
          fileId: 'general-search',
          fileName: 'نتائج عامة من الوثائق',
          fileType: 'text',
          uploadDate: new Date().toISOString(),
          excerpt: aiResponse.substring(0, 200) + '...',
          citations: ['الوثائق المرفوعة'],
          isSemanticMatch: true,
          matchedSections: [aiResponse.substring(0, 300)],
          semanticSummary: `تحليل دلالي شامل للاستعلام "${originalQuery}"`
        });
      }
    } catch (error) {
      console.error('Error parsing assistant search response:', error);
    }
    
    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private extractFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions = [
      `${query} في السياسات`,
      `إجراءات ${query}`,
      `تقرير عن ${query}`,
      `معايير ${query}`,
      `دليل ${query}`,
      `تحليل ${query}`
    ];
    
    return suggestions.slice(0, 4);
  }

  async uploadAndIndexDocument(file: File): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      if (!this.assistantId) {
        await this.initialize();
      }

      // Upload file to OpenAI and add to vector store
      const result = await openaiService.uploadFile(file);
      
      // Clear search threads cache since we have new content
      this.searchThreads.clear();
      
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
      const result = await openaiService.deleteFile(fileId);
      // Clear search threads cache since content changed
      this.searchThreads.clear();
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async askQuestion(question: string, threadId?: string): Promise<{ answer: string; citations: string[]; threadId: string }> {
    try {
      if (!this.assistantId) {
        await this.initialize();
      }

      const questionPrompt = `
بناءً على الوثائق المرفوعة، يرجى الإجابة على السؤال التالي بشكل مفصل ودقيق:

"${question}"

متطلبات الإجابة:
1. استخدم المعلومات من الوثائق المرفوعة فقط
2. اذكر المراجع والمصادر
3. قدم إجابة شاملة ومفيدة
4. إذا لم تجد معلومات كافية، اذكر ذلك بوضوح
5. استخدم اللغة العربية الواضحة

يرجى تنسيق الإجابة بشكل منظم مع العناوين والنقاط المهمة.
`;

      const response = await openaiService.sendMessage(questionPrompt, threadId);
      
      return {
        answer: response.content,
        citations: response.citations || [],
        threadId: response.threadId || threadId || ''
      };
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }

  // Get document statistics
  async getDocumentStats() {
    try {
      const files = await this.getUploadedFiles();
      return {
        totalDocuments: files.length,
        totalSize: files.reduce((sum, file) => sum + (file.bytes || 0), 0),
        ragEnabled: files.length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        totalDocuments: 0,
        totalSize: 0,
        ragEnabled: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }
}

export const openaiAssistantSearchService = new OpenAIAssistantSearchService();
export default openaiAssistantSearchService;