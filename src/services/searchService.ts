import documentIndexingService, { IndexedDocument } from './documentIndexingService';

export interface DocumentSearchResult {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  lastModified?: string;
  author?: string;
  tags: string[];
  category: string;
  relevanceScore?: number;
  viewCount?: number;
  downloadCount?: number;
  url?: string;
  content?: string;
  isRAG?: boolean;
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

// Convert IndexedDocument to DocumentSearchResult
function convertToSearchResult(doc: IndexedDocument): DocumentSearchResult {
  return {
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
    relevanceScore: (doc as any).relevanceScore || 0,
    viewCount: Math.floor(Math.random() * 100) + 10, // Mock view count
    downloadCount: Math.floor(Math.random() * 50) + 5, // Mock download count
    content: doc.content
  };
}

export async function searchDocuments(
  query: string,
  filters: SearchFilters,
  sortBy: string = 'relevance',
  sortOrder: string = 'desc',
  tab: string = 'all'
): Promise<DocumentSearchResult[]> {
  try {
    // Search using the document indexing service
    const indexedResults = await documentIndexingService.searchDocuments(query, {
      fileTypes: filters.fileTypes,
      tags: filters.tags,
      dateRange: filters.dateRange
    });

    let results = indexedResults.map(convertToSearchResult);

    // Apply additional filters
    if (filters.fileSizeRange.min > 0) {
      results = results.filter(doc => doc.fileSize >= filters.fileSizeRange.min * 1024 * 1024);
    }
    
    if (filters.fileSizeRange.max < 100) {
      results = results.filter(doc => doc.fileSize <= filters.fileSizeRange.max * 1024 * 1024);
    }
    
    if (filters.authors.length > 0) {
      results = results.filter(doc => 
        filters.authors.some(author => doc.author?.includes(author))
      );
    }

    // Apply tab filtering
    if (tab !== 'all') {
      switch (tab) {
        case 'documents':
          results = results.filter(doc => ['pdf', 'doc', 'docx', 'txt'].includes(doc.fileType));
          break;
        case 'reports':
          results = results.filter(doc => 
            doc.tags.some(tag => tag.toLowerCase().includes('تقرير') || tag.toLowerCase().includes('report')) ||
            doc.title.toLowerCase().includes('تقرير') ||
            doc.category.toLowerCase().includes('تقرير')
          );
          break;
        case 'presentations':
          results = results.filter(doc => ['ppt', 'pptx'].includes(doc.fileType));
          break;
      }
    }

    // Apply sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = (b.relevanceScore || 0) - (a.relevanceScore || 0);
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

    return results;
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}

export async function getDocuments(): Promise<DocumentSearchResult[]> {
  try {
    const indexedDocs = await documentIndexingService.getAllDocuments();
    return indexedDocs.map(convertToSearchResult);
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<DocumentSearchResult | null> {
  try {
    const doc = await documentIndexingService.getDocument(id);
    return doc ? convertToSearchResult(doc) : null;
  } catch (error) {
    console.error('Error getting document by ID:', error);
    return null;
  }
}

export async function getDocumentStats() {
  try {
    return await documentIndexingService.getDocumentStats();
  } catch (error) {
    console.error('Error getting document stats:', error);
    return {
      totalDocuments: 0,
      totalSize: 0,
      fileTypes: {},
      categories: {},
      ragEnabled: 0
    };
  }
}