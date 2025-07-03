import { EnhancedSearchResult } from './enhancedSemanticSearchService';

export interface ElasticSearchDocument {
  id: string;
  title: string;
  content: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  author: string;
  tags: string[];
  category: string;
  filename: string;
  extractedText: string;
  summary?: string;
  metadata: {
    [key: string]: any;
  };
}

export interface ElasticSearchResponse {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _id: string;
      _score: number;
      _source: ElasticSearchDocument;
      highlight?: {
        [field: string]: string[];
      };
    }>;
  };
  took: number;
  aggregations?: any;
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

class ElasticSearchService {
  private baseUrl = 'https://my-elasticsearch-project-f3e988.es.us-central1.gcp.elastic.cloud:443';
  private apiKey = 'T1B1OHpKY0JGTzVJOXhyWUYtUW86clpsb3ZJVzV0Q0dOSlBFdTFUQ3RKdw==';
  private indexName = 'mof-documents';
  private initialized = false;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `ApiKey ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // For HEAD requests, just return the status
      if (options.method === 'HEAD') {
        return response.ok;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElasticSearch error:', errorText);
        throw new Error(`ElasticSearch request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('ElasticSearch request error:', error);
      throw error;
    }
  }

  async checkIndexExists(): Promise<boolean> {
    try {
      return await this.makeRequest(`/${this.indexName}`, { method: 'HEAD' }) as boolean;
    } catch (error) {
      return false;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const health = await this.makeRequest('/_cluster/health');
      return health.status === 'green' || health.status === 'yellow';
    } catch (error) {
      console.error('ElasticSearch health check failed:', error);
      return false;
    }
  }

  async initializeIndex(): Promise<boolean> {
    try {
      if (this.initialized) {
        return true;
      }

      // Check if index exists
      const indexExists = await this.checkIndexExists();
      if (indexExists) {
        console.log('ElasticSearch index already exists');
        this.initialized = true;
        return true;
      }

      // Create index with proper mapping
      const indexMapping = {
        mappings: {
          properties: {
            title: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                arabic: { 
                  type: 'text',
                  analyzer: 'arabic'
                }
              }
            },
            content: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                arabic: { 
                  type: 'text',
                  analyzer: 'arabic'
                }
              }
            },
            extractedText: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                arabic: { 
                  type: 'text',
                  analyzer: 'arabic'
                }
              }
            },
            summary: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                arabic: { 
                  type: 'text',
                  analyzer: 'arabic'
                }
              }
            },
            fileType: { type: 'keyword' },
            fileSize: { type: 'long' },
            uploadDate: { type: 'date' },
            author: { 
              type: 'text',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            tags: { type: 'keyword' },
            category: { type: 'keyword' },
            filename: { 
              type: 'text',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            metadata: { type: 'object' }
          }
        },
        settings: {
          analysis: {
            analyzer: {
              arabic: {
                tokenizer: 'standard',
                filter: ['lowercase', 'arabic_normalization', 'arabic_stem']
              }
            }
          }
        }
      };

      await this.makeRequest(`/${this.indexName}`, {
        method: 'PUT',
        body: JSON.stringify(indexMapping)
      });

      console.log('ElasticSearch index created successfully');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize ElasticSearch index:', error);
      return false;
    }
  }

  async indexDocument(document: ElasticSearchDocument): Promise<{ success: boolean; error?: string }> {
    try {
      await this.initializeIndex();

      const response = await this.makeRequest(`/${this.indexName}/_doc/${document.id}`, {
        method: 'PUT',
        body: JSON.stringify(document)
      });

      console.log('Document indexed successfully:', response);
      return { success: true };
    } catch (error) {
      console.error('Error indexing document:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'فشل في فهرسة المستند' 
      };
    }
  }

  async searchDocuments(
    query: string, 
    filters: SearchFilters = {
      dateRange: { start: '', end: '' },
      fileTypes: [],
      fileSizeRange: { min: 0, max: 100 },
      tags: [],
      authors: []
    },
    from: number = 0,
    size: number = 20
  ): Promise<{ results: EnhancedSearchResult[]; totalCount: number; searchTime: number }> {
    try {
      await this.initializeIndex();

      const searchBody = this.buildSearchQuery(query, filters, from, size);
      
      const startTime = Date.now();
      const response: ElasticSearchResponse = await this.makeRequest(`/${this.indexName}/_search`, {
        method: 'POST',
        body: JSON.stringify(searchBody)
      });
      const searchTime = Date.now() - startTime;

      const results = this.convertElasticResultsToEnhanced(response, query);
      
      return {
        results,
        totalCount: response.hits.total.value,
        searchTime
      };
    } catch (error) {
      console.error('ElasticSearch search error:', error);
      return {
        results: [],
        totalCount: 0,
        searchTime: 0
      };
    }
  }

  private buildSearchQuery(query: string, filters: SearchFilters, from: number, size: number) {
    const mustClauses: any[] = [];
    const filterClauses: any[] = [];

    // Main search query
    if (query.trim()) {
      mustClauses.push({
        multi_match: {
          query: query,
          fields: [
            'title^3',
            'title.arabic^3',
            'content^2',
            'content.arabic^2',
            'extractedText^2',
            'extractedText.arabic^2',
            'summary^1.5',
            'summary.arabic^1.5',
            'tags^2',
            'category^1.5',
            'filename^1.5'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',
          operator: 'or'
        }
      });
    } else {
      // If no query, match all documents
      mustClauses.push({ match_all: {} });
    }

    // Apply filters
    if (filters.fileTypes.length > 0) {
      filterClauses.push({
        terms: { fileType: filters.fileTypes }
      });
    }

    if (filters.tags.length > 0) {
      filterClauses.push({
        terms: { tags: filters.tags }
      });
    }

    if (filters.authors.length > 0) {
      filterClauses.push({
        terms: { 'author.keyword': filters.authors }
      });
    }

    if (filters.dateRange.start) {
      filterClauses.push({
        range: {
          uploadDate: {
            gte: filters.dateRange.start
          }
        }
      });
    }

    if (filters.dateRange.end) {
      filterClauses.push({
        range: {
          uploadDate: {
            lte: filters.dateRange.end
          }
        }
      });
    }

    if (filters.fileSizeRange.min > 0) {
      filterClauses.push({
        range: {
          fileSize: {
            gte: filters.fileSizeRange.min * 1024 * 1024
          }
        }
      });
    }

    if (filters.fileSizeRange.max < 100) {
      filterClauses.push({
        range: {
          fileSize: {
            lte: filters.fileSizeRange.max * 1024 * 1024
          }
        }
      });
    }

    const searchBody = {
      from,
      size,
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses
        }
      },
      highlight: {
        fields: {
          title: { fragment_size: 150, number_of_fragments: 1 },
          'title.arabic': { fragment_size: 150, number_of_fragments: 1 },
          content: { fragment_size: 200, number_of_fragments: 3 },
          'content.arabic': { fragment_size: 200, number_of_fragments: 3 },
          extractedText: { fragment_size: 200, number_of_fragments: 3 },
          'extractedText.arabic': { fragment_size: 200, number_of_fragments: 3 },
          summary: { fragment_size: 150, number_of_fragments: 1 },
          'summary.arabic': { fragment_size: 150, number_of_fragments: 1 }
        },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>']
      },
      _source: true
    };

    return searchBody;
  }

  private convertElasticResultsToEnhanced(response: ElasticSearchResponse, query: string): EnhancedSearchResult[] {
    return response.hits.hits.map(hit => {
      const source = hit._source;
      const highlights = hit.highlight || {};
      
      // Extract highlighted sections
      const matchedSections: string[] = [];
      Object.values(highlights).forEach(highlightArray => {
        matchedSections.push(...highlightArray.map(h => h.replace(/<\/?mark>/g, '')));
      });

      // Calculate relevance score (ElasticSearch score normalized to 0-100)
      const maxScore = response.hits.hits[0]?._score || 1;
      const relevanceScore = Math.round((hit._score / maxScore) * 100);

      // Create excerpt from highlighted content or original content
      let excerpt = source.summary || source.content.substring(0, 300) + '...';
      if (highlights.content && highlights.content.length > 0) {
        excerpt = highlights.content[0];
      } else if (highlights.extractedText && highlights.extractedText.length > 0) {
        excerpt = highlights.extractedText[0];
      }

      return {
        id: hit._id,
        title: source.title,
        description: source.summary || source.content.substring(0, 200) + '...',
        excerpt,
        fileType: source.fileType,
        fileSize: source.fileSize,
        uploadDate: source.uploadDate,
        lastModified: source.uploadDate,
        author: source.author,
        tags: source.tags || [],
        category: source.category,
        relevanceScore,
        viewCount: Math.floor(Math.random() * 100) + 10,
        downloadCount: Math.floor(Math.random() * 50) + 5,
        content: source.content,
        isSemanticMatch: true, // ElasticSearch provides semantic-like search
        isRAGResult: false, // This is ElasticSearch, not OpenAI RAG
        matchedSections: matchedSections.slice(0, 5),
        semanticSummary: source.summary,
        citations: [source.filename],
        source: 'elasticsearch' as any
      };
    });
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/${this.indexName}/_doc/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting document from ElasticSearch:', error);
      return false;
    }
  }

  async getDocumentStats() {
    try {
      const response = await this.makeRequest(`/${this.indexName}/_stats`);
      const countResponse = await this.makeRequest(`/${this.indexName}/_count`);
      
      // Get aggregations for file types and categories
      const aggsResponse = await this.makeRequest(`/${this.indexName}/_search`, {
        method: 'POST',
        body: JSON.stringify({
          size: 0,
          aggs: {
            file_types: {
              terms: { field: 'fileType', size: 20 }
            },
            categories: {
              terms: { field: 'category', size: 20 }
            },
            total_size: {
              sum: { field: 'fileSize' }
            }
          }
        })
      });

      const fileTypes: Record<string, number> = {};
      const categories: Record<string, number> = {};

      aggsResponse.aggregations.file_types.buckets.forEach((bucket: any) => {
        fileTypes[bucket.key] = bucket.doc_count;
      });

      aggsResponse.aggregations.categories.buckets.forEach((bucket: any) => {
        categories[bucket.key] = bucket.doc_count;
      });

      return {
        totalDocuments: countResponse.count,
        totalSize: aggsResponse.aggregations.total_size.value || 0,
        fileTypes,
        categories,
        elasticsearchEnabled: true
      };
    } catch (error) {
      console.error('Error getting ElasticSearch stats:', error);
      return {
        totalDocuments: 0,
        totalSize: 0,
        fileTypes: {},
        categories: {},
        elasticsearchEnabled: false
      };
    }
  }

  async getAllDocuments(): Promise<EnhancedSearchResult[]> {
    try {
      const response = await this.searchDocuments('', {
        dateRange: { start: '', end: '' },
        fileTypes: [],
        fileSizeRange: { min: 0, max: 100 },
        tags: [],
        authors: []
      }, 0, 1000); // Get up to 1000 documents

      return response.results;
    } catch (error) {
      console.error('Error getting all documents from ElasticSearch:', error);
      return [];
    }
  }
}

export const elasticsearchService = new ElasticSearchService();
export default elasticsearchService;