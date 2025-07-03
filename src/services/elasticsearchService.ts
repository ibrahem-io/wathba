interface ElasticSearchConfig {
  url: string;
  apiKey: string;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  metadata?: any;
}

interface IndexResult {
  success: boolean;
  id?: string;
  error?: string;
}

class ElasticSearchService {
  private config: ElasticSearchConfig | null = null;
  private baseUrl: string;

  constructor() {
    this.initializeConfig();
    this.baseUrl = this.config?.url || '/api/elasticsearch';
  }

  private initializeConfig() {
    const url = import.meta.env.VITE_ELASTIC_URL;
    const apiKey = import.meta.env.VITE_ELASTIC_API_KEY;
    
    if (!url || !apiKey || url.trim() === '' || apiKey.trim() === '') {
      console.warn('Elasticsearch not configured. Please add VITE_ELASTIC_URL and VITE_ELASTIC_API_KEY to your .env file.');
      this.config = null;
      return;
    }
    
    this.config = {
      url: url.trim(),
      apiKey: apiKey.trim()
    };
  }

  private checkConfiguration(): boolean {
    if (!this.config) {
      throw new Error('Elasticsearch service not configured. Please add VITE_ELASTIC_URL and VITE_ELASTIC_API_KEY to your .env file.');
    }
    return true;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    this.checkConfiguration();
    
    const url = this.config!.url.startsWith('http') 
      ? `${this.config!.url}${endpoint}`
      : `/api/elasticsearch${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };

    // Add authorization header if we have an API key
    if (this.config!.apiKey) {
      headers['Authorization'] = `ApiKey ${this.config!.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`ElasticSearch request failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('Elasticsearch request error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.checkConfiguration();
      await this.makeRequest('/_cluster/health');
      return true;
    } catch (error) {
      console.error('Elasticsearch connection test failed:', error);
      return false;
    }
  }

  async createIndex(indexName: string): Promise<boolean> {
    try {
      this.checkConfiguration();
      
      const indexConfig = {
        mappings: {
          properties: {
            title: {
              type: 'text',
              analyzer: 'standard'
            },
            content: {
              type: 'text',
              analyzer: 'standard'
            },
            filename: {
              type: 'keyword'
            },
            file_type: {
              type: 'keyword'
            },
            file_size: {
              type: 'long'
            },
            uploaded_by: {
              type: 'keyword'
            },
            folder_id: {
              type: 'keyword'
            },
            created_at: {
              type: 'date'
            },
            metadata: {
              type: 'object',
              enabled: true
            },
            embeddings: {
              type: 'dense_vector',
              dims: 1536
            }
          }
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
          analysis: {
            analyzer: {
              arabic_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'arabic_normalization', 'arabic_stem']
              }
            }
          }
        }
      };

      await this.makeRequest(`/${indexName}`, {
        method: 'PUT',
        body: JSON.stringify(indexConfig)
      });

      return true;
    } catch (error) {
      console.error('Error creating index:', error);
      return false;
    }
  }

  async indexExists(indexName: string): Promise<boolean> {
    try {
      this.checkConfiguration();
      await this.makeRequest(`/${indexName}`, { method: 'HEAD' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async indexDocument(indexName: string, documentId: string, document: any): Promise<IndexResult> {
    try {
      this.checkConfiguration();
      
      // Ensure index exists
      const exists = await this.indexExists(indexName);
      if (!exists) {
        await this.createIndex(indexName);
      }

      const result = await this.makeRequest(`/${indexName}/_doc/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify(document)
      });

      return {
        success: true,
        id: result._id
      };
    } catch (error) {
      console.error('Error indexing document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async searchDocuments(indexName: string, query: string, options: any = {}): Promise<SearchResult[]> {
    try {
      this.checkConfiguration();
      
      const searchQuery = {
        query: {
          multi_match: {
            query: query,
            fields: ['title^2', 'content', 'filename'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        },
        highlight: {
          fields: {
            title: {},
            content: {}
          }
        },
        size: options.size || 10,
        from: options.from || 0
      };

      const result = await this.makeRequest(`/${indexName}/_search`, {
        method: 'POST',
        body: JSON.stringify(searchQuery)
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        title: hit._source.title || hit._source.filename || 'Untitled',
        content: hit._source.content || '',
        score: hit._score,
        metadata: hit._source.metadata || {},
        highlight: hit.highlight
      }));
    } catch (error) {
      console.error('ElasticSearch search error:', error);
      throw error;
    }
  }

  async deleteDocument(indexName: string, documentId: string): Promise<boolean> {
    try {
      this.checkConfiguration();
      
      await this.makeRequest(`/${indexName}/_doc/${documentId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  async vectorSearch(indexName: string, vector: number[], options: any = {}): Promise<SearchResult[]> {
    try {
      this.checkConfiguration();
      
      const searchQuery = {
        query: {
          script_score: {
            query: { match_all: {} },
            script: {
              source: "cosineSimilarity(params.query_vector, 'embeddings') + 1.0",
              params: {
                query_vector: vector
              }
            }
          }
        },
        size: options.size || 10
      };

      const result = await this.makeRequest(`/${indexName}/_search`, {
        method: 'POST',
        body: JSON.stringify(searchQuery)
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        title: hit._source.title || hit._source.filename || 'Untitled',
        content: hit._source.content || '',
        score: hit._score,
        metadata: hit._source.metadata || {}
      }));
    } catch (error) {
      console.error('Vector search error:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  getConfig(): ElasticSearchConfig | null {
    return this.config;
  }
}

export const elasticsearchService = new ElasticSearchService();
export default elasticsearchService;