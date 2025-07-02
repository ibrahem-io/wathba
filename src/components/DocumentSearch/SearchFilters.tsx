import React from 'react';
import { X, Calendar, FileText, Tag, User, Filter } from 'lucide-react';
import { SearchFilters as ISearchFilters } from '../../services/searchService';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
  onClose: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose
}) => {
  const fileTypes = [
    { value: 'pdf', label: 'PDF', count: 45 },
    { value: 'doc', label: 'Word', count: 32 },
    { value: 'docx', label: 'Word (حديث)', count: 28 },
    { value: 'xls', label: 'Excel', count: 15 },
    { value: 'xlsx', label: 'Excel (حديث)', count: 12 },
    { value: 'ppt', label: 'PowerPoint', count: 8 },
    { value: 'pptx', label: 'PowerPoint (حديث)', count: 6 },
    { value: 'txt', label: 'نص', count: 4 },
    { value: 'csv', label: 'CSV', count: 3 }
  ];

  const popularTags = [
    'تقرير مالي', 'سياسة', 'إجراءات', 'ميزانية', 'محاسبة', 'مراجعة',
    'حوكمة', 'امتثال', 'أداء', 'استراتيجية', 'تخطيط', 'تطوير'
  ];

  const authors = [
    'إدارة المالية', 'إدارة الميزانية', 'إدارة المحاسبة', 'إدارة المراجعة',
    'إدارة التخطيط', 'إدارة الموارد البشرية', 'إدارة تقنية المعلومات'
  ];

  const updateFilters = (key: keyof ISearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'fileTypes' | 'tags' | 'authors', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { start: '', end: '' },
      fileTypes: [],
      fileSizeRange: { min: 0, max: 100 },
      tags: [],
      authors: []
    });
  };

  const hasActiveFilters = 
    filters.dateRange.start || 
    filters.dateRange.end || 
    filters.fileTypes.length > 0 || 
    filters.tags.length > 0 || 
    filters.authors.length > 0 ||
    filters.fileSizeRange.min > 0 ||
    filters.fileSizeRange.max < 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-saudi-green" />
          <h3 className="text-lg font-semibold text-gray-900">المرشحات</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {hasActiveFilters && (
        <div className="mb-6">
          <button
            onClick={clearAllFilters}
            className="text-sm text-saudi-green hover:text-saudi-green-dark font-medium"
          >
            مسح جميع المرشحات
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">نطاق التاريخ</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">من تاريخ</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilters('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilters('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
              />
            </div>
          </div>
        </div>

        {/* File Types */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">نوع الملف</h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fileTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fileTypes.includes(type.value)}
                  onChange={() => toggleArrayFilter('fileTypes', type.value)}
                  className="rounded border-gray-300 text-saudi-green focus:ring-saudi-green"
                />
                <span className="text-sm text-gray-700 flex-1">{type.label}</span>
                <span className="text-xs text-gray-500">({type.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Size Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">حجم الملف (ميجابايت)</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الحد الأدنى</label>
              <input
                type="number"
                min="0"
                value={filters.fileSizeRange.min}
                onChange={(e) => updateFilters('fileSizeRange', { 
                  ...filters.fileSizeRange, 
                  min: parseInt(e.target.value) || 0 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الحد الأقصى</label>
              <input
                type="number"
                min="0"
                value={filters.fileSizeRange.max}
                onChange={(e) => updateFilters('fileSizeRange', { 
                  ...filters.fileSizeRange, 
                  max: parseInt(e.target.value) || 100 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">العلامات</h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {popularTags.map((tag) => (
              <label key={tag} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => toggleArrayFilter('tags', tag)}
                  className="rounded border-gray-300 text-saudi-green focus:ring-saudi-green"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Authors/Departments */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">الإدارة/المؤلف</h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {authors.map((author) => (
              <label key={author} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.authors.includes(author)}
                  onChange={() => toggleArrayFilter('authors', author)}
                  className="rounded border-gray-300 text-saudi-green focus:ring-saudi-green"
                />
                <span className="text-sm text-gray-700">{author}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;