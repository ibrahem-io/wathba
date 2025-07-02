// Enhanced semantic search service that combines OpenAI Assistant search with ElasticSearch
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
      // Perform both OpenAI Assistant search and ElasticSearch in parallel
      const [openaiResponse, elasticsearchResponse] = await Promise.all([
        this.performOpenAISearch(query),
        this.performElasticSearch(query, filters)
      ]);

      // Combine and deduplicate results
      const combinedResults = this.combineResults(
        openaiResponse.results, 
        elasticsearchResponse.results, 
        query
      );

      // Apply additional filters
      let filteredResults = this.applyAdditionalFilters(combinedResults, filters);

      // Apply sorting
      filteredResults = this.applySorting(filteredResults, sortBy, sortOrder);

      const searchTime = Date.now() - startTime;

      return {
        results: filteredResults,
        totalCount: filteredResults.length,
        searchTime,
        openaiResults: openaiResponse.results.length,
        elasticsearchResults: elasticsearchResponse.results.length,
        localResults: 0, // We're not using local search anymore
        suggestions: openaiResponse.suggestions
      };
    } catch (error) {
      console.error('Error in enhanced semantic search:', error);
      
      // Fallback to ElasticSearch only
      try {
        const elasticsearchResponse = await this.performElasticSearch(query, filters);
        const searchTime = Date.now() - startTime;
        
        return {
          results: elasticsearchResponse.results,
          totalCount: elasticsearchResponse.results.length,
          searchTime,
          openaiResults: 0,
          elasticsearchResults: elasticsearchResponse.results.length,
          localResults: 0,
          suggestions: []
        };
      } catch (fallbackError) {
        console.error('ElasticSearch fallback also failed:', fallbackError);
        
        const searchTime = Date.now() - startTime;
        return {
          results: [],
          totalCount: 0,
          searchTime,
          openaiResults: 0,
          elasticsearchResults: 0,
          localResults: 0,
          suggestions: []
        };
      }
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

  private combineResults(
    openaiResults: AssistantSearchResult[], 
    elasticsearchResults: EnhancedSearchResult[], 
    query: string
  ): EnhancedSearchResult[] {
    const combined: EnhancedSearchResult[] = [];
    const seenTitles = new Set<string>();

    // Add OpenAI results first (they're typically more relevant for chat-based queries)
    openaiResults.forEach(result => {
      const enhanced = this.convertOpenAIToEnhanced(result);
      if (!seenTitles.has(enhanced.title.toLowerCase())) {
        combined.push(enhanced);
        seenTitles.add(enhanced.title.toLowerCase());
      }
    });

    // Add ElasticSearch results that don't duplicate OpenAI results
    elasticsearchResults.forEach(result => {
      if (!seenTitles.has(result.title.toLowerCase())) {
        combined.push(result);
        seenTitles.add(result.title.toLowerCase());
      }
    });

    return combined;
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
          // Prioritize OpenAI results, then by relevance score
          if (a.isRAGResult && !b.isRAGResult) comparison = -1;
          else if (!a.isRAGResult && b.isRAGResult) comparison = 1;
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
      console.error('Error getting documents from ElasticSearch:', error);
      
      // Fallback to enhanced document indexing service
      try {
        const localDocs = await enhancedDocumentIndexingService.getAllDocuments();
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
          relevanceScore: 100,
          viewCount: Math.floor(Math.random() * 100) + 10,
          content: doc.content,
          isSemanticMatch: false,
          isRAGResult: false,
          matchedSections: [],
          semanticSummary: doc.summary,
          source: 'local' as const
        }));
      } catch (localError) {
        console.error('Error getting documents from local storage:', localError);
        return [];
      }
    }
  }

  async getDocumentStats() {
    try {
      // Get stats from ElasticSearch
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
        totalDocuments: 0,
        localDocuments: 0,
        ragDocuments: 0,
        elasticsearchDocuments: 0,
        totalSize: 0,
        fileTypes: {},
        categories: {},
        ragEnabled: 0,
        elasticsearchEnabled: false
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
      throw error;
    }
  }
}

export const enhancedSemanticSearchService = new EnhancedSemanticSearchService();
export default enhancedSemanticSearchService;