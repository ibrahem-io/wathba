import documentIndexingService, { IndexedDocument } from './documentIndexingService';
import openaiService from './openaiService';

export interface SemanticSearchResult {
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
  matchedSections: string[];
  semanticSummary?: string;
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

class SemanticSearchService {
  private async performSemanticAnalysis(query: string, documents: IndexedDocument[]): Promise<SemanticSearchResult[]> {
    if (documents.length === 0) {
      return [];
    }

    try {
      // Use OpenAI to perform semantic analysis
      const analysisPrompt = `
أنت محلل ذكي للمستندات. قم بتحليل الاستعلام التالي وإيجاد المستندات الأكثر صلة:

الاستعلام: "${query}"

المستندات المتاحة:
${documents.map((doc, index) => `
${index + 1}. العنوان: ${doc.title}
   التصنيف: ${doc.category}
   العلامات: ${doc.tags.join(', ')}
   المحتوى: ${doc.content.substring(0, 300)}...
`).join('\n')}

يرجى تحليل كل مستند وتقديم النتائج بالتنسيق التالي:

[RESULT_START]
رقم المستند: [رقم]
درجة الصلة: [رقم من 0 إلى 100]
الأقسام المطابقة: [قائمة بالأقسام أو الجمل المطابقة]
ملخص الصلة: [شرح مختصر لسبب الصلة]
[RESULT_END]

ركز على المعنى والسياق وليس فقط الكلمات المطابقة.
`;

      const response = await openaiService.sendMessage(analysisPrompt);
      return this.parseSemanticResults(response.content, documents, query);
    } catch (error) {
      console.error('Semantic analysis failed:', error);
      // Fallback to keyword-based search
      return this.performKeywordSearch(query, documents);
    }
  }

  private parseSemanticResults(aiResponse: string, documents: IndexedDocument[], query: string): SemanticSearchResult[] {
    const results: SemanticSearchResult[] = [];
    
    try {
      const resultBlocks = aiResponse.split('[RESULT_START]').slice(1);
      
      resultBlocks.forEach(block => {
        const endIndex = block.indexOf('[RESULT_END]');
        if (endIndex === -1) return;
        
        const content = block.substring(0, endIndex).trim();
        const lines = content.split('\n').filter(line => line.trim());
        
        let docNumber = 0;
        let relevanceScore = 0;
        let matchedSections: string[] = [];
        let semanticSummary = '';
        
        lines.forEach(line => {
          if (line.includes('رقم المستند:')) {
            const match = line.match(/\d+/);
            if (match) docNumber = parseInt(match[0]);
          } else if (line.includes('درجة الصلة:')) {
            const match = line.match(/\d+/);
            if (match) relevanceScore = parseInt(match[0]);
          } else if (line.includes('الأقسام المطابقة:')) {
            const sections = line.replace('الأقسام المطابقة:', '').trim();
            matchedSections = sections.split('،').map(s => s.trim()).filter(s => s);
          } else if (line.includes('ملخص الصلة:')) {
            semanticSummary = line.replace('ملخص الصلة:', '').trim();
          }
        });
        
        if (docNumber > 0 && docNumber <= documents.length && relevanceScore > 30) {
          const doc = documents[docNumber - 1];
          results.push(this.convertToSemanticResult(doc, relevanceScore, matchedSections, semanticSummary, true));
        }
      });
    } catch (error) {
      console.error('Error parsing semantic results:', error);
    }
    
    // If no semantic results, fallback to keyword search
    if (results.length === 0) {
      return this.performKeywordSearch(query, documents);
    }
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private performKeywordSearch(query: string, documents: IndexedDocument[]): SemanticSearchResult[] {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    return documents.map(doc => {
      let score = 0;
      const matchedSections: string[] = [];
      const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')} ${doc.category}`.toLowerCase();
      
      searchTerms.forEach(term => {
        const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const contentMatches = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const tagMatches = doc.tags.filter(tag => tag.toLowerCase().includes(term)).length;
        
        score += titleMatches * 15 + contentMatches * 3 + tagMatches * 8;
        
        if (titleMatches > 0) matchedSections.push(`العنوان: ${doc.title}`);
        if (contentMatches > 0) {
          const sentences = doc.content.split('.').filter(s => s.toLowerCase().includes(term));
          matchedSections.push(...sentences.slice(0, 2).map(s => s.trim()));
        }
      });
      
      const relevanceScore = Math.min(100, score);
      return this.convertToSemanticResult(
        doc, 
        relevanceScore, 
        matchedSections.slice(0, 3),
        `تطابق كلمات مفتاحية مع "${query}"`,
        false
      );
    })
    .filter(result => result.relevanceScore > 10)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private convertToSemanticResult(
    doc: IndexedDocument, 
    relevanceScore: number, 
    matchedSections: string[], 
    semanticSummary: string,
    isSemanticMatch: boolean
  ): SemanticSearchResult {
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
      relevanceScore,
      viewCount: Math.floor(Math.random() * 100) + 10,
      downloadCount: Math.floor(Math.random() * 50) + 5,
      content: doc.content,
      isSemanticMatch,
      matchedSections,
      semanticSummary
    };
  }

  async searchDocuments(
    query: string,
    filters: SearchFilters,
    sortBy: string = 'relevance',
    sortOrder: string = 'desc'
  ): Promise<SemanticSearchResult[]> {
    try {
      // Get all indexed documents
      const allDocuments = await documentIndexingService.getAllDocuments();
      
      if (allDocuments.length === 0) {
        return [];
      }

      // Apply basic filters first
      let filteredDocs = allDocuments;

      if (filters.fileTypes.length > 0) {
        filteredDocs = filteredDocs.filter(doc => filters.fileTypes.includes(doc.fileType));
      }

      if (filters.tags.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filters.tags.some(tag => doc.tags.some(docTag => docTag.includes(tag)))
        );
      }

      if (filters.dateRange.start) {
        filteredDocs = filteredDocs.filter(doc => 
          new Date(doc.uploadDate) >= new Date(filters.dateRange.start)
        );
      }

      if (filters.dateRange.end) {
        filteredDocs = filteredDocs.filter(doc => 
          new Date(doc.uploadDate) <= new Date(filters.dateRange.end)
        );
      }

      // Perform semantic search
      let results = await this.performSemanticAnalysis(query, filteredDocs);

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

      // Apply sorting
      results.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'relevance':
            comparison = b.relevanceScore - a.relevanceScore;
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
      console.error('Error in semantic search:', error);
      return [];
    }
  }

  async getDocuments(): Promise<SemanticSearchResult[]> {
    try {
      const indexedDocs = await documentIndexingService.getAllDocuments();
      return indexedDocs.map(doc => this.convertToSemanticResult(
        doc, 
        100, 
        [], 
        'مستند مفهرس',
        false
      ));
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }

  async getDocumentById(id: string): Promise<SemanticSearchResult | null> {
    try {
      const doc = await documentIndexingService.getDocument(id);
      return doc ? this.convertToSemanticResult(doc, 100, [], 'مستند مفهرس', false) : null;
    } catch (error) {
      console.error('Error getting document by ID:', error);
      return null;
    }
  }

  async getDocumentStats() {
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
}

export const semanticSearchService = new SemanticSearchService();
export default semanticSearchService;