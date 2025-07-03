import React from 'react';
import { FileText, Download, Eye, Share2, Calendar, User, Tag, Star, Clock, AlertCircle, Brain, Target, Zap, Quote, Bot, Search, ExternalLink, Database } from 'lucide-react';
import { EnhancedSearchResult } from '../../services/enhancedSemanticSearchService';

interface EnhancedSearchResultsProps {
  results: EnhancedSearchResult[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onDocumentClick: (document: EnhancedSearchResult) => void;
}

const EnhancedSearchResults: React.FC<EnhancedSearchResultsProps> = ({
  results,
  isLoading,
  viewMode,
  searchQuery,
  onDocumentClick
}) => {
  const getFileIcon = (fileType: string) => {
    const iconClass = "h-5 w-5";
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'xls':
      case 'xlsx':
        return <FileText className={`${iconClass} text-green-500`} />;
      case 'ppt':
      case 'pptx':
        return <FileText className={`${iconClass} text-orange-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    // Check if text already contains <mark> tags from ElasticSearch
    if (typeof text === 'string' && text.includes('<mark>')) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSourceIcon = (result: EnhancedSearchResult) => {
    if (result.isRAGResult) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Bot className="h-4 w-4" />
          <span className="text-xs font-medium">OpenAI RAG</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <Database className="h-4 w-4" />
          <span className="text-xs font-medium">ElasticSearch</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            
            <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
        <p className="text-gray-600 mb-4">جرب تعديل مصطلحات البحث أو استخدم مفاهيم مختلفة</p>
        <div className="text-sm text-gray-500">
          <p className="mb-2">نصائح للبحث الذكي:</p>
          <ul className="space-y-1">
            <li>• استخدم جمل كاملة بدلاً من كلمات منفردة</li>
            <li>• اطرح أسئلة مباشرة في وضع الأسئلة</li>
            <li>• استخدم مفاهيم ومصطلحات متخصصة</li>
            <li>• جرب مرادفات أو تعبيرات مختلفة</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((document, index) => (
        <div
          key={document.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
          onClick={() => onDocumentClick(document)}
        >
          <div className="p-6">
            {/* Header with title and metadata */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-2 leading-tight">
                  {typeof document.title === 'string' && document.title.includes('<mark>') 
                    ? <span dangerouslySetInnerHTML={{ __html: document.title }} />
                    : highlightText(document.title, searchQuery)}
                </h3>
                
                {/* Metadata row */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    {getFileIcon(document.fileType)}
                    <span className="uppercase font-medium">{document.fileType}</span>
                  </div>
                  <span>•</span>
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(document.uploadDate)}</span>
                  </div>
                  {document.author && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{document.author}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Source and relevance indicators */}
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                {getSourceIcon(document)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRelevanceColor(document.relevanceScore)}`}>
                  {document.relevanceScore}% مطابقة
                </span>
              </div>
            </div>

            {/* Description/Excerpt */}
            {document.excerpt && (
              <p className="text-gray-700 mb-4 leading-relaxed text-base">
                {typeof document.excerpt === 'string' && document.excerpt.includes('<mark>') 
                  ? <span dangerouslySetInnerHTML={{ __html: document.excerpt }} />
                  : highlightText(document.excerpt, searchQuery)}
              </p>
            )}

            {/* RAG Summary */}
            {document.isRAGResult && document.semanticSummary && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">تحليل OpenAI Assistant</span>
                </div>
                <p className="text-sm text-green-700 leading-relaxed">{document.semanticSummary}</p>
              </div>
            )}

            {/* Matched Sections */}
            {document.matchedSections && document.matchedSections.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Quote className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">المقاطع المطابقة:</span>
                </div>
                <div className="space-y-2">
                  {document.matchedSections.slice(0, 2).map((section, sectionIndex) => (
                    <div key={sectionIndex} className={`border rounded-lg p-3 ${
                      document.isRAGResult 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <p className={`text-sm leading-relaxed ${
                        document.isRAGResult ? 'text-green-800' : 'text-blue-800'
                      }`}>
                        {typeof section === 'string' && section.includes('<mark>') 
                          ? <span dangerouslySetInnerHTML={{ __html: section }} />
                          : highlightText(section.substring(0, 200) + (section.length > 200 ? '...' : ''), searchQuery)}
                      </p>
                    </div>
                  ))}
                  {document.matchedSections.length > 2 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      +{document.matchedSections.length - 2} مقطع إضافي
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Citations for RAG results */}
            {document.isRAGResult && document.citations && document.citations.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">المراجع من OpenAI:</span>
                </div>
                <div className="space-y-1">
                  {document.citations.map((citation, citationIndex) => (
                    <div key={citationIndex} className="bg-gray-50 border border-gray-200 rounded p-2">
                      <p className="text-sm text-gray-700">📄 {citation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      <Tag className="h-3 w-3 ml-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentClick(document);
                  }}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    document.isRAGResult ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  عرض المستند
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  تحميل
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح
                </button>
              </div>
              
              {/* View count and last modified */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {document.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{document.viewCount} مشاهدة</span>
                  </div>
                )}
                {document.lastModified && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>آخر تعديل: {formatDate(document.lastModified)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedSearchResults;