import openaiService from './openaiService';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  metadata?: any;
}

class OpenAIAssistantSearchService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (!openaiService.isConfigured()) {
      throw new Error('OpenAI service not configured. Please add a valid VITE_OPENAI_API_KEY to your .env file.');
    }

    try {
      await openaiService.getOrCreateAssistant();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize OpenAI Assistant:', error);
      throw new Error('Failed to initialize OpenAI Assistant');
    }
  }

  async searchDocuments(query: string): Promise<SearchResult[]> {
    if (!openaiService.isConfigured()) {
      throw new Error('OpenAI service not configured');
    }

    if (!this.initialized) {
      try {
        await this.initialize();
      } catch (error) {
        console.error('OpenAI Assistant search error:', error);
        throw error;
      }
    }

    try {
      // Use OpenAI Assistant to search through uploaded documents
      const searchQuery = `ابحث في الوثائق المرفوعة عن: ${query}. قدم النتائج بتنسيق JSON مع العناوين والمحتوى ذي الصلة.`;
      
      const response = await openaiService.sendMessage(searchQuery);
      
      // Parse the response to extract search results
      // This is a simplified implementation - in practice, you might want to
      // structure the assistant's response more carefully
      return [{
        id: 'openai-result-1',
        title: 'نتيجة من مساعد OpenAI',
        content: response.content,
        score: 0.9,
        metadata: {
          citations: response.citations,
          threadId: response.threadId
        }
      }];
    } catch (error) {
      console.error('Error searching with OpenAI Assistant:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return openaiService.isConfigured();
  }
}

export const openaiAssistantSearchService = new OpenAIAssistantSearchService();
export default openaiAssistantSearchService;