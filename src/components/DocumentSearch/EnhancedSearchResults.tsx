import React from 'react';
import { FileText, Download, Eye, Share2, Calendar, User, Tag, Star, Clock, AlertCircle, Brain, Target, Zap, Quote, Bot, Search } from 'lucide-react';
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
    if (!query.trim()) return text;
    
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
          <Search className="h-4 w-4" />
          <span className="text-xs font-medium">بحث محلي</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
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

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((document) => (
          <div
            key={document.id}
            className={`bg-white rounded-lg shadow-sm border transition-all cursor-pointer ${
              document.isRAGResult 
                ? 'border-green-200 hover:shadow-md hover:border-green-400' 
                : 'border-gray-200 hover:shadow-md hover:border-saudi-green'
            }`}
            onClick={() => onDocumentClick(document)}
          >
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-3 rounded-lg ${document.isRAGResult ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {getFileIcon(document.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {highlightText(document.title, searchQuery)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="uppercase">{document.fileType}</span>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getSourceIcon(document)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(document.relevanceScore)}`}>
                      {document.relevanceScore}% مطابقة
                    </span>
                  </div>
                </div>
              </div>

              {document.excerpt && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {highlightText(document.excerpt, searchQuery)}
                </p>
              )}

              {/* RAG Summary */}
              {document.isRAGResult && document.semanticSummary && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-800">تحليل OpenAI</span>
                  </div>
                  <p className="text-sm text-green-700">{document.semanticSummary}</p>
                </div>
              )}

              {/* Matched Sections */}
              {document.matchedSections.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Quote className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 font-medium">مقاطع مطابقة:</span>
                  </div>
                  <div className="space-y-1">
                    {document.matchedSections.slice(0, 2).map((section, index) => (
                      <div key={index} className={`text-xs p-2 rounded border ${
                        document.isRAGResult 
                          ? 'bg-green-50 text-green-800 border-green-200' 
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {highlightText(section.substring(0, 100) + '...', searchQuery)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations for RAG results */}
              {document.isRAGResult && document.citations && document.citations.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-600 font-medium mb-1">المراجع:</div>
                  <div className="space-y-1">
                    {document.citations.slice(0, 2).map((citation, index) => (
                      <div key={index} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded border">
                        📄 {citation}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(document.uploadDate)}</span>
                </div>
                {document.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{document.viewCount}</span>
                  </div>
                )}
              </div>

              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      <Tag className="h-3 w-3 ml-1" />
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{document.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentClick(document);
                    }}
                    className={`text-sm font-medium ${
                      document.isRAGResult ? 'text-green-600 hover:text-green-700' : 'text-saudi-green hover:text-saudi-green-dark'
                    }`}
                  >
                    عرض
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((document) => (
        <div
          key={document.id}
          className={`bg-white rounded-lg shadow-sm border transition-all cursor-pointer ${
            document.isRAGResult 
              ? 'border-green-200 hover:shadow-md hover:border-green-400' 
              : 'border-gray-200 hover:shadow-md hover:border-saudi-green'
          }`}
          onClick={() => onDocumentClick(document)}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg flex-shrink-0 ${document.isRAGResult ? 'bg-green-50' : 'bg-gray-50'}`}>
                {getFileIcon(document.fileType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-semibold transition-colors line-clamp-2 ${
                    document.isRAGResult ? 'text-gray-900 hover:text-green-600' : 'text-gray-900 hover:text-saudi-green'
                  }`}>
                    {highlightText(document.title, searchQuery)}
                  </h3>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {getSourceIcon(document)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRelevanceColor(document.relevanceScore)}`}>
                      {document.relevanceScore}% مطابقة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="uppercase">{document.fileType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(document.uploadDate)}</span>
                  </div>
                  {document.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{document.author}</span>
                    </div>
                  )}
                  {document.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{document.viewCount} مشاهدة</span>
                    </div>
                  )}
                </div>

                {document.excerpt && (
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {highlightText(document.excerpt, searchQuery)}
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
                {document.matchedSections.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Quote className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">المقاطع المطابقة:</span>
                    </div>
                    <div className="space-y-2">
                      {document.matchedSections.slice(0, 3).map((section, index) => (
                        <div key={index} className={`border rounded-lg p-3 ${
                          document.isRAGResult 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <p className={`text-sm leading-relaxed ${
                            document.isRAGResult ? 'text-green-800' : 'text-blue-800'
                          }`}>
                            {highlightText(section.substring(0, 200) + (section.length > 200 ? '...' : ''), searchQuery)}
                          </p>
                        </div>
                      ))}
                      {document.matchedSections.length > 3 && (
                        <div className="text-sm text-gray-500 text-center">
                          +{document.matchedSections.length - 3} مقطع إضافي
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
                      {document.citations.map((citation, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded p-2">
                          <p className="text-sm text-gray-700">📄 {citation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                      >
                        <Tag className="h-3 w-3 ml-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDocumentClick(document);
                      }}
                      className={`flex items-center gap-2 font-medium ${
                        document.isRAGResult ? 'text-green-600 hover:text-green-700' : 'text-saudi-green hover:text-saudi-green-dark'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      عرض المستند
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <Download className="h-4 w-4" />
                      تحميل
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <Share2 className="h-4 w-4" />
                      مشاركة
                    </button>
                  </div>
                  
                  {document.lastModified && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>آخر تعديل: {formatDate(document.lastModified)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedSearchResults;