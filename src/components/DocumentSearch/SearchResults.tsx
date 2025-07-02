import React from 'react';
import { FileText, Download, Eye, Share2, Calendar, User, Tag, Star, Clock, AlertCircle } from 'lucide-react';
import { DocumentSearchResult } from '../../services/searchService';

interface SearchResultsProps {
  results: DocumentSearchResult[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onDocumentClick: (document: DocumentSearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
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
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
        <p className="text-gray-600 mb-4">جرب تعديل مصطلحات البحث أو المرشحات</p>
        <div className="text-sm text-gray-500">
          <p>نصائح للبحث:</p>
          <ul className="mt-2 space-y-1">
            <li>• استخدم كلمات مفتاحية مختلفة</li>
            <li>• تحقق من الإملاء</li>
            <li>• استخدم مصطلحات أوسع</li>
            <li>• جرب البحث باللغة الإنجليزية</li>
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-saudi-green transition-all cursor-pointer"
            onClick={() => onDocumentClick(document)}
          >
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  {getFileIcon(document.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {highlightText(document.title, searchQuery)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="uppercase">{document.fileType}</span>
                    <span>•</span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </div>
                </div>
              </div>

              {document.excerpt && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {highlightText(document.excerpt, searchQuery)}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(document.uploadDate)}</span>
                </div>
                {document.relevanceScore && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(document.relevanceScore)}`}>
                    {document.relevanceScore}% مطابقة
                  </span>
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
                    className="text-saudi-green hover:text-saudi-green-dark text-sm font-medium"
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
                {document.viewCount && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{document.viewCount}</span>
                  </div>
                )}
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
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-saudi-green transition-all cursor-pointer"
          onClick={() => onDocumentClick(document)}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-lg flex-shrink-0">
                {getFileIcon(document.fileType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-saudi-green transition-colors line-clamp-2">
                    {highlightText(document.title, searchQuery)}
                  </h3>
                  {document.relevanceScore && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ml-4 flex-shrink-0 ${getRelevanceColor(document.relevanceScore)}`}>
                      {document.relevanceScore}% مطابقة
                    </span>
                  )}
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
                      className="flex items-center gap-2 text-saudi-green hover:text-saudi-green-dark font-medium"
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

export default SearchResults;