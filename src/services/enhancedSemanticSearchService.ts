import { elasticsearchService } from './elasticsearchService';
import { openaiAssistantSearchService } from './openaiAssistantSearchService';
import { semanticSearchService } from './semanticSearchService';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  source: 'elasticsearch' | 'openai' | 'semantic';
  metadata?: any;
  highlight?: any;
}

interface SearchOptions {
  useElasticsearch?: boolean;
  useOpenAI?: boolean;
  useSemantic?: boolean;
  maxResults?: number;
}

class EnhancedSemanticSearchService {
  async searchDocuments(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const {
      useElasticsearch = true,
      useOpenAI = true,
      useSemantic = true,
      maxResults = 20
    } = options;

    const results: SearchResult[] = [];
    const errors: string[] = [];

    // Elasticsearch search
    if (useElasticsearch && elasticsearchService.isConfigured()) {
      try {
        const elasticResults = await this.performElasticSearch(query);
        results.push(...elasticResults);
      } catch (error) {
        console.error('Elasticsearch search failed:', error);
        errors.push('Elasticsearch search failed');
      }
    }

    // OpenAI Assistant search
    if (useOpenAI && openaiAssistantSearchService.isConfigured()) {
      try {
        const openaiResults = await this.performOpenAISearch(query);
        results.push(...openaiResults);
      } catch (error) {
        console.error('OpenAI search failed:', error);
        errors.push('OpenAI search failed');
      }
    }

    // Semantic search
    if (useSemantic) {
      try {
        const semanticResults = await this.performSemanticSearch(query);
        results.push(...semanticResults);
      } catch (error) {
        console.error('Semantic search failed:', error);
        errors.push('Semantic search failed');
      }
    }

    // If no results and we have errors, show a helpful message
    if (results.length === 0 && errors.length > 0) {
      console.warn('All search methods failed:', errors);
      return [{
        id: 'error',
        title: 'خطأ في البحث',
        content: `فشل في البحث. يرجى التأكد من تكوين خدمات البحث بشكل صحيح. الأخطاء: ${errors.join(', ')}`,
        score: 0,
        source: 'elasticsearch',
        metadata: { isError: true }
      }];
    }

    // Remove duplicates and sort by score
    const uniqueResults = this.removeDuplicates(results);
    const sortedResults = uniqueResults.sort((a, b) => b.score - a.score);

    return sortedResults.slice(0, maxResults);
  }

  private async performElasticSearch(query: string): Promise<SearchResult[]> {
    if (!elasticsearchService.isConfigured()) {
      throw new Error('Elasticsearch not configured');
    }

    const results = await elasticsearchService.searchDocuments('mof-documents', query);
    return results.map(result => ({
      ...result,
      source: 'elasticsearch' as const
    }));
  }

  private async performOpenAISearch(query: string): Promise<SearchResult[]> {
    if (!openaiAssistantSearchService.isConfigured()) {
      throw new Error('OpenAI Assistant not configured');
    }

    const results = await openaiAssistantSearchService.searchDocuments(query);
    return results.map(result => ({
      ...result,
      source: 'openai' as const
    }));
  }

  private async performSemanticSearch(query: string): Promise<SearchResult[]> {
    const results = await semanticSearchService.searchDocuments(query);
    return results.map(result => ({
      ...result,
      source: 'semantic' as const
    }));
  }

  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.title}-${result.content.substring(0, 100)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async getSearchCapabilities(): Promise<{
    elasticsearch: boolean;
    openai: boolean;
    semantic: boolean;
  }> {
    return {
      elasticsearch: elasticsearchService.isConfigured(),
      openai: openaiAssistantSearchService.isConfigured(),
      semantic: true // Semantic search is always available as it uses Supabase
    };
  }
}

export const enhancedSemanticSearchService = new EnhancedSemanticSearchService();
export default enhancedSemanticSearchService;