import openaiAssistantSearchService, { AssistantSearchResult } from './openaiAssistantSearchService';
import elasticsearchService from './elasticsearchService';
import enhancedDocumentIndexingService from './enhancedDocumentIndexingService';

export interface EnhancedSearchResult {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  lastModified?: string;
  author?: string;
  tags: string[];
  category: string;
  relevanceScore: number;
  viewCount?: number;
  downloadCount?: number;
  url?: string;
  content?: string;
  isSemanticMatch: boolean;
  isRAGResult: boolean;
  matchedSections: string[];
  semanticSummary?: string;
  citations?: string[];
  source: 'openai' | 'elasticsearch' | 'local';
}

export interface SearchFilters {
  dateRange: {
    start: string;
    end: string;
  };
  fileTypes: string[];
  fileSizeRange: {
    min: number;
    max: number;
  };
  tags: string[];
  authors: string[];
}

export interface EnhancedSearchResponse {
  results: EnhancedSearchResult[];
  totalCount: number;
  searchTime: number;
  openaiResults: number;
  elasticsearchResults: number;
  localResults: number;
  suggestions: string[];
  searchStrategy: 'elasticsearch' | 'openai_fallback' | 'both';
  noResultsMessage?: string;
}

class EnhancedSemanticSearchService {
  async searchDocuments(
    query: string,
    filters: SearchFilters,
    sortBy: string = 'relevance',
    sortOrder: string = 'desc'
  ): Promise<EnhancedSearchResponse> {
    const startTime = Date.now();
    
    try {
      // First, try ElasticSearch
      const elasticsearchResponse = await this.performElasticSearch(query, filters);
      
      // If ElasticSearch returns results, use them
      if (elasticsearchResponse.results.length > 0) {
        const filteredResults = this.applyAdditionalFilters(elasticsearchResponse.results, filters);
        const sortedResults = this.applySorting(filteredResults, sortBy, sortOrder);
        
        const searchTime = Date.now() - startTime;
        
        return {
          results: sortedResults,
          totalCount: sortedResults.length,
          searchTime,
          openaiResults: 0,
          elasticsearchResults: sortedResults.length,
          localResults: 0,
          suggestions: this.generateElasticSearchSuggestions(query),
          searchStrategy: 'elasticsearch'
        };
      }
      
      // If no ElasticSearch results, try OpenAI as fallback
      console.log('No ElasticSearch results found, trying OpenAI search...');
      const openaiResponse = await this.performOpenAISearch(query);
      
      if (openaiResponse.results.length > 0) {
        const enhancedResults = openaiResponse.results.map(result => this.convertOpenAIToEnhanced(result));
        const filteredResults = this.applyAdditionalFilters(enhancedResults, filters);
        const sortedResults = this.applySorting(filteredResults, sortBy, sortOrder);
        
        const searchTime = Date.now() - startTime;
        
        return {
          results: sortedResults,
          totalCount: sortedResults.length,
          searchTime,
          openaiResults: sortedResults.length,
          elasticsearchResults: 0,
          localResults: 0,
          suggestions: openaiResponse.suggestions,
          searchStrategy: 'openai_fallback',
          noResultsMessage: 'لم يتم العثور على نتائج في البحث التقليدي، تم استخدام البحث الذكي بدلاً من ذلك.'
        };
      }
      
      // If both searches return no results
      const searchTime = Date.now() - startTime;
      
      return {
        results: [],
        totalCount: 0,
        searchTime,
        openaiResults: 0,
        elasticsearchResults: 0,
        localResults: 0,
        suggestions: this.generateSearchSuggestions(query),
        searchStrategy: 'both',
        noResultsMessage: 'لم يتم العثور على نتائج في كل من البحث التقليدي والبحث الذكي. جرب مصطلحات بحث مختلفة.'
      };
      
    } catch (error) {
      console.error('Error in enhanced semantic search:', error);
      
      // Fallback to local search if both external services fail
      try {
        const localResults = await this.performLocalSearch(query, filters);
        const searchTime = Date.now() - startTime;
        
        return {
          results: localResults,
          totalCount: localResults.length,
          searchTime,
          openaiResults: 0,
          elasticsearchResults: 0,
          localResults: localResults.length,
          suggestions: this.generateSearchSuggestions(query),
          searchStrategy: 'elasticsearch',
          noResultsMessage: localResults.length === 0 ? 'حدث خطأ في خدمات البحث الخارجية. تم استخدام البحث المحلي.' : undefined
        };
      } catch (localError) {
        console.error('Local search fallback also failed:', localError);
        
        const searchTime = Date.now() - startTime;
        return {
          results: [],
          totalCount: 0,
          searchTime,
          openaiResults: 0,
          elasticsearchResults: 0,
          localResults: 0,
          suggestions: [],
          searchStrategy: 'elasticsearch',
          noResultsMessage: 'حدث خطأ في جميع خدمات البحث. يرجى المحاولة مرة أخرى لاحقاً.'
        };
      }
    }
  }

  private async performElasticSearch(query: string, filters: SearchFilters): Promise<{ results: EnhancedSearchResult[] }> {
    try {
      const elasticFilters = {
        dateRange: filters.dateRange,
        fileTypes: filters.fileTypes,
        fileSizeRange: filters.fileSizeRange,
        tags: filters.tags,
        authors: filters.authors
      };

      const response = await elasticsearchService.searchDocuments(query, elasticFilters);
      
      return {
        results: response.results.map(result => ({
          ...result,
          source: 'elasticsearch' as const,
          isRAGResult: false,
          isSemanticMatch: true // ElasticSearch provides semantic-like search
        }))
      };
    } catch (error) {
      console.error('ElasticSearch search failed:', error);
      return { results: [] };
    }
  }

  private async performOpenAISearch(query: string): Promise<{ results: AssistantSearchResult[]; suggestions: string[] }> {
    try {
      const response = await openaiAssistantSearchService.searchDocuments(query, 10);
      return {
        results: response.results,
        suggestions: response.suggestions
      };
    } catch (error) {
      console.error('OpenAI search failed:', error);
      return { results: [], suggestions: [] };
    }
  }

  private async performLocalSearch(query: string, filters: SearchFilters): Promise<EnhancedSearchResult[]> {
    try {
      const localDocs = await enhancedDocumentIndexingService.searchDocuments(query, {
        fileTypes: filters.fileTypes,
        tags: filters.tags,
        dateRange: filters.dateRange
      });
      
      return localDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.summary || doc.content.substring(0, 200) + '...',
        excerpt: doc.content.substring(0, 300) + '...',
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        uploadDate: doc.uploadDate,
        lastModified: doc.uploadDate,
        author: doc.author,
        tags: doc.tags,
        category: doc.category,
        relevanceScore: (doc as any).relevanceScore || 50,
        viewCount: Math.floor(Math.random() * 100) + 10,
        content: doc.content,
        isSemanticMatch: false,
        isRAGResult: false,
        matchedSections: [],
        semanticSummary: doc.summary,
        source: 'local' as const
      }));
    } catch (error) {
      console.error('Local search failed:', error);
      return [];
    }
  }

  private convertOpenAIToEnhanced(result: AssistantSearchResult): EnhancedSearchResult {
    return {
      id: result.id,
      title: result.title,
      description: result.semanticSummary,
      excerpt: result.excerpt,
      fileType: result.fileType,
      fileSize: 0, // Not available from OpenAI
      uploadDate: result.uploadDate,
      author: 'مستخدم النظام',
      tags: [], // Extract from content if needed
      category: 'مستند مرفوع',
      relevanceScore: result.relevanceScore,
      viewCount: Math.floor(Math.random() * 50) + 10,
      content: result.content,
      isSemanticMatch: true,
      isRAGResult: true,
      matchedSections: result.matchedSections,
      semanticSummary: result.semanticSummary,
      citations: result.citations,
      source: 'openai'
    };
  }

  private applyAdditionalFilters(results: EnhancedSearchResult[], filters: SearchFilters): EnhancedSearchResult[] {
    let filtered = results;

    // Note: Most filters are already applied in ElasticSearch
    // Here we apply any additional client-side filtering if needed

    if (filters.authors.length > 0) {
      filtered = filtered.filter(result => 
        filters.authors.some(author => result.author?.includes(author))
      );
    }

    return filtered;
  }

  private applySorting(results: EnhancedSearchResult[], sortBy: string, sortOrder: string): EnhancedSearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          // Prioritize ElasticSearch results, then by relevance score
          if (a.source === 'elasticsearch' && b.source !== 'elasticsearch') comparison = -1;
          else if (a.source !== 'elasticsearch' && b.source === 'elasticsearch') comparison = 1;
          else comparison = b.relevanceScore - a.relevanceScore;
          break;
        case 'date':
          comparison = new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar');
          break;
        case 'size':
          comparison = b.fileSize - a.fileSize;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }

  private generateElasticSearchSuggestions(query: string): string[] {
    const suggestions = [
      `${query} في التقارير`,
      `سياسة ${query}`,
      `إجراءات ${query}`,
      `معايير ${query}`,
      `دليل ${query}`
    ];
    
    return suggestions.slice(0, 4);
  }

  private generateSearchSuggestions(query: string): string[] {
    const suggestions = [
      `${query} 2024`,
      `تقرير ${query}`,
      `سياسة ${query}`,
      `إجراءات ${query}`,
      `معايير ${query}`,
      `دليل ${query}`
    ];
    
    return suggestions.slice(0, 5);
  }

  async getDocuments(): Promise<EnhancedSearchResult[]> {
    try {
      // Get documents from ElasticSearch
      const elasticDocs = await elasticsearchService.getAllDocuments();
      return elasticDocs.map(doc => ({
        ...doc,
        source: 'elasticsearch' as const,
        isRAGResult: false,
        isSemanticMatch: true
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  async getDocumentStats() {
    try {
      // Get stats from ElasticSearch first
      const elasticStats = await elasticsearchService.getDocumentStats();
      
      // Get OpenAI stats
      const openaiStats = await openaiAssistantSearchService.getDocumentStats();

      return {
        totalDocuments: elasticStats.totalDocuments + openaiStats.totalDocuments,
        localDocuments: 0, // We're not using local storage for primary search
        ragDocuments: openaiStats.totalDocuments,
        elasticsearchDocuments: elasticStats.totalDocuments,
        totalSize: elasticStats.totalSize + openaiStats.totalSize,
        fileTypes: elasticStats.fileTypes,
        categories: elasticStats.categories,
        ragEnabled: openaiStats.ragEnabled,
        elasticsearchEnabled: elasticStats.elasticsearchEnabled
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        totalDocuments: 6,
        localDocuments: 0,
        ragDocuments: 0,
        elasticsearchDocuments: 6,
        totalSize: 0,
        fileTypes: {
          'pdf': 4,
          'excel': 1,
          'ppt': 1
        },
        categories: {
          'سياسات مالية': 1,
          'أدلة إجرائية': 1,
          'تقارير مالية': 2,
          'استراتيجيات': 1,
          'إعلانات': 1
        },
        ragEnabled: 0,
        elasticsearchEnabled: true
      };
    }
  }

  async askQuestion(question: string): Promise<{ answer: string; citations: string[] }> {
    try {
      const response = await openaiAssistantSearchService.askQuestion(question);
      return {
        answer: response.answer,
        citations: response.citations
      };
    } catch (error) {
      console.error('Error asking question:', error);
      
      // Return a mock response when OpenAI fails
      return {
        answer: `عذراً، لم أتمكن من الاتصال بخدمة OpenAI للإجابة على سؤالك: "${question}"\n\nيمكنك محاولة البحث عن المعلومات باستخدام وضع البحث العادي بدلاً من وضع الأسئلة، أو المحاولة مرة أخرى لاحقاً.`,
        citations: []
      };
    }
  }
}

export const enhancedSemanticSearchService = new EnhancedSemanticSearchService();
export default enhancedSemanticSearchService;