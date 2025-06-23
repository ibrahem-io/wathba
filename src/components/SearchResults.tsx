import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Calendar,
  Building,
  Tag,
  Filter,
  Grid,
  List,
  ChevronDown,
  Volume2,
  Video,
  Image,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Document, SearchFilters } from '../types';
import { mockDocuments, departments, documentTypes } from '../data/mockData';

interface SearchResultsProps {
  searchQuery: string;
  onDocumentSelect: (document: Document) => void;
}

export default function SearchResults({ searchQuery, onDocumentSelect }: SearchResultsProps) {
  const { t, language, dir } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    department: [],
    dateRange: { start: '', end: '' },
    tags: [],
    language: 'all'
  });

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let results = mockDocuments;

    // Apply search query
    if (searchQuery.trim()) {
      results = results.filter(doc => {
        const title = language === 'ar' ? doc.title : doc.titleEn;
        const description = language === 'ar' ? doc.description : doc.descriptionEn;
        const tags = language === 'ar' ? doc.tags : doc.tagsEn;
        
        const searchLower = searchQuery.toLowerCase();
        return (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply filters
    if (filters.type.length > 0) {
      results = results.filter(doc => filters.type.includes(doc.type));
    }

    if (filters.department.length > 0) {
      results = results.filter(doc => {
        const deptName = language === 'ar' ? doc.department : doc.departmentEn;
        return filters.department.includes(deptName);
      });
    }

    if (filters.language !== 'all') {
      results = results.filter(doc => 
        doc.language === filters.language || doc.language === 'both'
      );
    }

    return results;
  }, [searchQuery, filters, language]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return FileText;
      case 'excel':
        return FileSpreadsheet;
      case 'ppt':
        return Presentation;
      case 'video':
        return Video;
      case 'audio':
        return Volume2;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('search.results')}
          </h2>
          <p className="text-gray-600">
            {t('search.showing')} {filteredDocuments.length} {t('search.of')} {mockDocuments.length} {t('search.results.count')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-primary flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('search.filters')}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search.type')}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {documentTypes.map(type => (
                  <label key={type.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            type: [...prev.type, type.id]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            type: prev.type.filter(t => t !== type.id)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {language === 'ar' ? type.nameAr : type.nameEn}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search.department')}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {departments.map(dept => (
                  <label key={dept.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.department.includes(language === 'ar' ? dept.nameAr : dept.nameEn)}
                      onChange={(e) => {
                        const deptName = language === 'ar' ? dept.nameAr : dept.nameEn;
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            department: [...prev.department, deptName]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            department: prev.department.filter(d => d !== deptName)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {language === 'ar' ? dept.nameAr : dept.nameEn}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللغة / Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value as any }))}
                className="input-field"
              >
                <option value="all">الكل / All</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search.dateRange')}
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="input-field text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={() => setFilters({
                type: [],
                department: [],
                dateRange: { start: '', end: '' },
                tags: [],
                language: 'all'
              })}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              مسح المرشحات / Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('search.noResults')}
          </h3>
          <p className="text-gray-600">
            جرب تعديل مصطلحات البحث أو المرشحات
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredDocuments.map((document) => {
            const FileIcon = getFileIcon(document.type);
            const title = language === 'ar' ? document.title : document.titleEn;
            const description = language === 'ar' ? document.description : document.descriptionEn;
            const department = language === 'ar' ? document.department : document.departmentEn;
            const tags = language === 'ar' ? document.tags : document.tagsEn;
            const aiSummary = language === 'ar' ? document.aiSummary : document.aiSummaryEn;

            if (viewMode === 'grid') {
              return (
                <div
                  key={document.id}
                  className="document-card cursor-pointer"
                  onClick={() => onDocumentSelect(document)}
                >
                  {/* Thumbnail */}
                  <div className="relative mb-4">
                    <img
                      src={document.thumbnailUrl}
                      alt={title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(document.priority)}`}>
                        {document.priority === 'high' ? 'عالي' : document.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-black bg-opacity-75 text-white p-1 rounded">
                        <FileIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {description}
                    </p>

                    {aiSummary && (
                      <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                        <strong>ملخص ذكي:</strong> {aiSummary}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{tags.length - 3}</span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {department}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(document.uploadDate)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{document.fileSize}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDocumentSelect(document);
                          }}
                          className="text-saudi-green hover:text-saudi-green-dark"
                          title={t('document.preview')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-saudi-green hover:text-saudi-green-dark"
                          title={t('document.download')}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-saudi-green hover:text-saudi-green-dark"
                          title={t('document.share')}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              // List view
              return (
                <div
                  key={document.id}
                  className="document-card cursor-pointer"
                  onClick={() => onDocumentSelect(document)}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={document.thumbnailUrl}
                        alt={title}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-black bg-opacity-75 text-white p-1 rounded">
                          <FileIcon className="h-3 w-3" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {description}
                          </p>
                          
                          {aiSummary && (
                            <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 mb-2">
                              <strong>ملخص ذكي:</strong> {aiSummary}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {department}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(document.uploadDate)}
                            </div>
                            <span>{document.fileSize}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(document.priority)}`}>
                            {document.priority === 'high' ? 'عالي' : document.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDocumentSelect(document);
                            }}
                            className="text-saudi-green hover:text-saudi-green-dark"
                            title={t('document.preview')}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-saudi-green hover:text-saudi-green-dark"
                            title={t('document.download')}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-saudi-green hover:text-saudi-green-dark"
                            title={t('document.share')}
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tags.slice(0, 5).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {tags.length > 5 && (
                          <span className="text-xs text-gray-500">+{tags.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}