// Enhanced semantic search service that combines OpenAI Assistant search with local indexing
import openaiAssistantSearchService, { AssistantSearchResult } from './openaiAssistantSearchService';
import documentIndexingService, { IndexedDocument } from './documentIndexingService';

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
  source: 'openai' | 'local';
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
      // Perform both OpenAI Assistant search and local search in parallel
      const [openaiResponse, localDocuments] = await Promise.all([
        this.performOpenAISearch(query),
        this.performLocalSearch(query, filters)
      ]);

      // Combine and deduplicate results
      const combinedResults = this.combineResults(openaiResponse.results, localDocuments, query);

      // Apply filters
      let filteredResults = this.applyFilters(combinedResults, filters);

      // Apply sorting
      filteredResults = this.applySorting(filteredResults, sortBy, sortOrder);

      const searchTime = Date.now() - startTime;

      return {
        results: filteredResults,
        totalCount: filteredResults.length,
        searchTime,
        openaiResults: openaiResponse.results.length,
        localResults: localDocuments.length,
        suggestions: openaiResponse.suggestions
      };
    } catch (error) {
      console.error('Error in enhanced semantic search:', error);
      
      // Fallback to local search only
      const localResults = await this.performLocalSearch(query, filters);
      const searchTime = Date.now() - startTime;
      
      return {
        results: localResults,
        totalCount: localResults.length,
        searchTime,
        openaiResults: 0,
        localResults: localResults.length,
        suggestions: []
      };
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
      const localResults = await documentIndexingService.searchDocuments(query, {
        fileTypes: filters.fileTypes,
        tags: filters.tags,
        dateRange: filters.dateRange
      });

      return localResults.map(doc => this.convertLocalToEnhanced(doc, query));
    } catch (error) {
      console.error('Local search failed:', error);
      return [];
    }
  }

  private combineResults(
    openaiResults: AssistantSearchResult[], 
    localResults: EnhancedSearchResult[], 
    query: string
  ): EnhancedSearchResult[] {
    const combined: EnhancedSearchResult[] = [];
    const seenTitles = new Set<string>();

    // Add OpenAI results first (they're typically more relevant)
    openaiResults.forEach(result => {
      const enhanced = this.convertOpenAIToEnhanced(result);
      if (!seenTitles.has(enhanced.title.toLowerCase())) {
        combined.push(enhanced);
        seenTitles.add(enhanced.title.toLowerCase());
      }
    });

    // Add local results that don't duplicate OpenAI results
    localResults.forEach(result => {
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

  private convertLocalToEnhanced(doc: IndexedDocument, query: string): EnhancedSearchResult {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.summary || doc.content.substring(0, 200) + '...',
      excerpt: doc.content.substring(0, 300) + '...',
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadDate: doc.uploadDate,
      author: doc.author,
      tags: doc.tags,
      category: doc.category,
      relevanceScore: (doc as any).relevanceScore || 50,
      viewCount: Math.floor(Math.random() * 100) + 10,
      content: doc.content,
      isSemanticMatch: false,
      isRAGResult: false,
      matchedSections: this.extractMatchedSections(doc.content, query),
      semanticSummary: doc.summary,
      source: 'local'
    };
  }

  private extractMatchedSections(content: string, query: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    const matchedSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return queryTerms.some(term => lowerSentence.includes(term));
    });

    return matchedSentences.slice(0, 3).map(s => s.trim());
  }

  private applyFilters(results: EnhancedSearchResult[], filters: SearchFilters): EnhancedSearchResult[] {
    let filtered = results;

    if (filters.fileTypes.length > 0) {
      filtered = filtered.filter(result => filters.fileTypes.includes(result.fileType));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(result => 
        filters.tags.some(tag => result.tags.some(resultTag => resultTag.includes(tag)))
      );
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(result => 
        new Date(result.uploadDate) >= new Date(filters.dateRange.start)
      );
    }

    if (filters.dateRange.end) {
      filtered = filtered.filter(result => 
        new Date(result.uploadDate) <= new Date(filters.dateRange.end)
      );
    }

    if (filters.fileSizeRange.min > 0) {
      filtered = filtered.filter(result => result.fileSize >= filters.fileSizeRange.min * 1024 * 1024);
    }

    if (filters.fileSizeRange.max < 100) {
      filtered = filtered.filter(result => result.fileSize <= filters.fileSizeRange.max * 1024 * 1024);
    }

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
      // Get documents from both sources
      const [openaiStats, localDocs] = await Promise.all([
        openaiAssistantSearchService.getDocumentStats(),
        documentIndexingService.getAllDocuments()
      ]);

      // Convert local documents to enhanced format
      const enhancedDocs = localDocs.map(doc => this.convertLocalToEnhanced(doc, ''));

      return enhancedDocs;
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  async getDocumentStats() {
    try {
      const [openaiStats, localStats] = await Promise.all([
        openaiAssistantSearchService.getDocumentStats(),
        documentIndexingService.getDocumentStats()
      ]);

      return {
        totalDocuments: localStats.totalDocuments + openaiStats.totalDocuments,
        localDocuments: localStats.totalDocuments,
        ragDocuments: openaiStats.totalDocuments,
        totalSize: localStats.totalSize + openaiStats.totalSize,
        fileTypes: localStats.fileTypes,
        categories: localStats.categories,
        ragEnabled: openaiStats.ragEnabled
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return {
        totalDocuments: 0,
        localDocuments: 0,
        ragDocuments: 0,
        totalSize: 0,
        fileTypes: {},
        categories: {},
        ragEnabled: 0
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