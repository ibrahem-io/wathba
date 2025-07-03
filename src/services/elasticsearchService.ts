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
  private indexName = 'mof-documents';
  private initialized = false;

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
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
        throw new Error(`ElasticSearch request failed: ${response.status