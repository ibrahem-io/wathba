import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Upload, Download, Eye, Share2, FileText, Calendar, User, Tag, ChevronDown, X, SortAsc, SortDesc, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewer from './DocumentViewer';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { searchDocuments, getDocuments, DocumentSearchResult, SearchFilters as ISearchFilters } from '../../services/searchService';

interface SearchInterfaceProps {
  onNavigateBack?: () => void;
  initialSearchQuery?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onNavigateBack, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDocument, setSelectedDocument] = useState<DocumentSearchResult | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'reports' | 'presentations'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'size'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const [filters, setFilters] = useState<ISearchFilters>({
    dateRange: { start: '', end: '' },
    fileTypes: [],
    fileSizeRange: { min: 0, max: 100 },
    tags: [],
    authors: []
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    loadDocuments();
    loadSearchHistory();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (initialSearchQuery) {
      performSearch();
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults(allDocuments);
    }
  }, [debouncedSearchQuery, filters, sortBy, sortOrder, activeTab]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ar-SA';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  };

  const handleVoiceSearch = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const documents = await getDocuments();
      setAllDocuments(documents);
      setSearchResults(documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const saveSearchHistory = (query: string) => {
    if (!query.trim()) return;
    
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const query = searchQuery || initialSearchQuery;
      const results = await searchDocuments(query, filters, sortBy, sortOrder, activeTab);
      setSearchResults(results);
      if (query) {
        saveSearchHistory(query);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
      setShowSearchHistory(false);
    }
  };

  const handleDocumentClick = (document: DocumentSearchResult) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleUploadSuccess = () => {
    loadDocuments();
    setShowUploadModal(false);
  };

  const getTabCount = (tab: string) => {
    if (tab === 'all') return searchResults.length;
    return searchResults.filter(doc => {
      switch (tab) {
        case 'documents': return ['pdf', 'doc', 'docx', 'txt'].includes(doc.fileType);
        case 'reports': return doc.tags.some(tag => tag.toLowerCase().includes('report') || tag.toLowerCase().includes('تقرير'));
        case 'presentations': return ['ppt', 'pptx'].includes(doc.fileType);
        default: return true;
      }
    }).length;
  };

  const filteredResults = searchResults.filter(doc => {
    if (activeTab === 'all') return true;
    switch (activeTab) {
      case 'documents': return ['pdf', 'doc', 'docx', 'txt'].includes(doc.fileType);
      case 'reports': return doc.tags.some(tag => tag.toLowerCase().includes('report') || tag.toLowerCase().includes('تقرير'));
      case 'presentations': return ['ppt', 'pptx'].includes(doc.fileType);
      default: return true;
    }
  });

  const quickSearchTerms = [
    'السياسات المالية',
    'التقارير الربعية', 
    'دليل الإجراءات',
    'الميزانية العامة',
    'معايير المحاسبة',
    'الحوكمة المؤسسية',
    'المراجعة الداخلية',
    'التخطيط المالي'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              {onNavigateBack && (
                <button
                  onClick={onNavigateBack}
                  className="ml-4 text-gray-600 hover:text-saudi-green flex items-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>العودة</span>
                </button>
              )}
              <div className="flex items-center">
                <div className="bg-saudi-green text-white p-2 rounded-lg ml-3">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">مكتبة الوثائق</h1>
                  <p className="text-sm text-gray-600">البحث والإدارة المتقدمة</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {filteredResults.length} نتيجة
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-saudi-green text-white px-4 py-2 rounded-lg hover:bg-saudi-green-dark transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                رفع مستندات
              </button>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="pb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden focus-within:border-saudi-green transition-colors">
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearchHistory(true)}
                      placeholder="ابحث في المستندات... (استخدم علامات الاقتباس للبحث الدقيق)"
                      className="w-full pr-12 pl-4 py-4 border-0 focus:ring-0 focus:outline-none text-lg font-cairo"
                      dir="rtl"
                    />
                  </div>
                  
                  {/* Voice Search Button */}
                  {recognition && (
                    <button
                      type="button"
                      onClick={handleVoiceSearch}
                      className={`p-4 transition-colors ${
                        isListening 
                          ? 'text-red-500 bg-red-50 voice-recording' 
                          : 'text-gray-500 hover:text-saudi-green hover:bg-green-50'
                      }`}
                      title={isListening ? 'إيقاف التسجيل' : 'البحث الصوتي'}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                  )}
                  
                  {/* Filters Button */}
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-4 transition-colors ${
                      showFilters ? 'text-saudi-green bg-green-50' : 'text-gray-500 hover:text-saudi-green hover:bg-green-50'
                    }`}
                    title="المرشحات"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                  
                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-saudi-green text-white px-6 py-4 hover:bg-saudi-green-dark transition-colors flex items-center gap-2 font-cairo font-semibold"
                  >
                    <Search className="h-5 w-5" />
                    بحث
                  </button>
                </div>
              </div>

              {/* Search History Dropdown */}
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-2">عمليات البحث السابقة</div>
                    {searchHistory.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(query);
                          setShowSearchHistory(false);
                        }}
                        className="w-full text-right p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Quick Search Terms */}
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">عمليات بحث شائعة:</p>
              <div className="flex flex-wrap gap-2">
                {quickSearchTerms.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(term);
                      performSearch();
                    }}
                    className="bg-gray-100 hover:bg-saudi-green hover:text-white text-gray-700 px-3 py-1 rounded-full text-sm transition-all font-cairo"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              {/* Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1">
                  {[
                    { key: 'all', label: 'جميع النتائج' },
                    { key: 'documents', label: 'المستندات' },
                    { key: 'reports', label: 'التقارير' },
                    { key: 'presentations', label: 'العروض' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-saudi-green text-white'
                          : 'text-gray-600 hover:text-saudi-green hover:bg-gray-50'
                      }`}
                    >
                      {tab.label} ({getTabCount(tab.key)})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">ترتيب:</span>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort as any);
                        setSortOrder(order as any);
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="relevance-desc">الصلة</option>
                      <option value="date-desc">الأحدث</option>
                      <option value="date-asc">الأقدم</option>
                      <option value="title-asc">العنوان (أ-ي)</option>
                      <option value="title-desc">العنوان (ي-أ)</option>
                      <option value="size-desc">الحجم (الأكبر)</option>
                      <option value="size-asc">الحجم (الأصغر)</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-saudi-green text-white' : 'text-gray-600'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-saudi-green text-white' : 'text-gray-600'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count and Search Info */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  {isLoading ? (
                    'جاري البحث...'
                  ) : (
                    <>
                      تم العثور على <span className="font-semibold text-saudi-green">{filteredResults.length}</span> نتيجة
                      {(searchQuery || initialSearchQuery) && (
                        <span> لـ "<span className="font-medium">{searchQuery || initialSearchQuery}</span>"</span>
                      )}
                    </>
                  )}
                </div>
                {(searchQuery || initialSearchQuery) && (
                  <div className="text-xs text-gray-500">
                    وقت البحث: 0.{Math.floor(Math.random() * 9) + 1} ثانية
                  </div>
                )}
              </div>
            </div>

            {/* Search Results */}
            <SearchResults
              results={filteredResults}
              isLoading={isLoading}
              viewMode={viewMode}
              searchQuery={searchQuery || initialSearchQuery}
              onDocumentClick={handleDocumentClick}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {showDocumentViewer && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          searchQuery={searchQuery || initialSearchQuery}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Click outside to close search history */}
      {showSearchHistory && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSearchHistory(false)}
        />
      )}
    </div>
  );
};

export default SearchInterface;