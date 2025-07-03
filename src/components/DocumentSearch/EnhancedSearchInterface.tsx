import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Upload, Download, Eye, Share2, FileText, Calendar, User, Tag, ChevronDown, X, SortAsc, SortDesc, ArrowLeft, Mic, MicOff, Bot, Sparkles, Zap, BarChart3, Brain, Target, MessageCircle, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewer from './DocumentViewer';
import SearchFilters from './SearchFilters';
import EnhancedSearchResults from './EnhancedSearchResults';
import { enhancedSemanticSearchService, EnhancedSearchResult, SearchFilters as ISearchFilters } from '../../services/enhancedSemanticSearchService';
import elasticsearchService from '../../services/elasticsearchService';

interface EnhancedSearchInterfaceProps {
  onNavigateBack?: () => void;
  initialSearchQuery?: string;
}

const EnhancedSearchInterface: React.FC<EnhancedSearchInterfaceProps> = ({ onNavigateBack, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<EnhancedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDocument, setSelectedDocument] = useState<EnhancedSearchResult | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'size'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [documentStats, setDocumentStats] = useState<any>({
    totalDocuments: 0,
    ragDocuments: 0,
    elasticsearchDocuments: 0,
    fileTypes: {},
    categories: {}
  });
  const [searchTime, setSearchTime] = useState<number>(0);
  const [openaiResults, setOpenaiResults] = useState<number>(0);
  const [elasticsearchResults, setElasticsearchResults] = useState<number>(0);
  const [showQuestionMode, setShowQuestionMode] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState<{ answer: string; citations: string[] } | null>(null);
  const [searchStrategy, setSearchStrategy] = useState<'elasticsearch' | 'openai_fallback' | 'both'>('elasticsearch');
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState<ISearchFilters>({
    dateRange: { start: '', end: '' },
    fileTypes: [],
    fileSizeRange: { min: 0, max: 100 },
    tags: [],
    authors: []
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    loadSearchHistory();
    initializeSpeechRecognition();
    loadDocumentStats();
  }, []);

  useEffect(() => {
    if (initialSearchQuery) {
      performSearch();
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() && !isSearching) {
      performSearch();
    } else if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setNoResultsMessage(null);
    }
  }, [debouncedSearchQuery, filters, sortBy, sortOrder]);

  const loadDocumentStats = async () => {
    try {
      const stats = await enhancedSemanticSearchService.getDocumentStats();
      setDocumentStats(stats);
    } catch (error) {
      console.error('Error loading document stats:', error);
      // Set default stats
      setDocumentStats({
        totalDocuments: 0,
        ragDocuments: 0,
        elasticsearchDocuments: 0,
        fileTypes: {},
        categories: {}
      });
    }
  };

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
    const query = searchQuery || initialSearchQuery;
    if (!query.trim() || isSearching) return;

    setIsLoading(true);
    setIsSearching(true);
    setQuestionAnswer(null);
    setNoResultsMessage(null);

    try {
      console.log('Performing search with query:', query);
      const response = await enhancedSemanticSearchService.searchDocuments(query, filters, sortBy, sortOrder);
      console.log('Search response:', response);
      
      setSearchResults(response.results);
      setSearchTime(response.searchTime);
      setOpenaiResults(response.openaiResults || 0);
      setElasticsearchResults(response.elasticsearchResults || 0);
      setSearchStrategy(response.searchStrategy || 'elasticsearch');
      setNoResultsMessage(response.noResultsMessage || null);

      if (query) {
        saveSearchHistory(query);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      setNoResultsMessage('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleAskQuestion = async () => {
    const query = searchQuery || initialSearchQuery;
    if (!query.trim() || isSearching) return;

    setIsLoading(true);
    setIsSearching(true);
    setQuestionAnswer(null);

    try {
      const response = await enhancedSemanticSearchService.askQuestion(query);
      setQuestionAnswer(response);
      
      if (query) {
        saveSearchHistory(query);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setQuestionAnswer({
        answer: 'عذراً، حدث خطأ أثناء معالجة سؤالك. يرجى المحاولة مرة أخرى.',
        citations: []
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !isSearching) {
      if (showQuestionMode) {
        handleAskQuestion();
      } else {
        performSearch();
      }
      setShowSearchHistory(false);
    }
  };

  const handleDocumentClick = (document: EnhancedSearchResult) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleUploadSuccess = async () => {
    await loadDocumentStats();
    setShowUploadModal(false);
  };

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

  const getRAGResultsCount = () => {
    return searchResults.filter(r => r.isRAGResult).length;
  };

  const getElasticsearchResultsCount = () => {
    return searchResults.filter(r => r.source === 'elasticsearch').length;
  };

  const getSearchStrategyMessage = () => {
    if (searchStrategy === 'openai_fallback') {
      return (
        <div className="flex items-center gap-2 text-orange-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>تم استخدام البحث الذكي بعد عدم العثور على نتائج في البحث التقليدي</span>
        </div>
      );
    }
    return null;
  };

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
                <div className="bg-gradient-to-r from-saudi-green to-saudi-green-light text-white p-2 rounded-lg ml-3">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    البحث الذكي المتقدم
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      ElasticSearch
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600">
                    {documentStats ? (
                      <>
                        {documentStats.totalDocuments} مستند • {documentStats.elasticsearchDocuments} في ElasticSearch
                      </>
                    ) : (
                      'البحث المتقدم مع ElasticSearch'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {documentStats && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{searchResults.length} نتيجة</span>
                  {searchQuery && getElasticsearchResultsCount() > 0 && (
                    <span className="text-blue-600">• {getElasticsearchResultsCount()} من ElasticSearch</span>
                  )}
                  {searchQuery && getRAGResultsCount() > 0 && (
                    <span className="text-green-600">• {getRAGResultsCount()} من OpenAI</span>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-saudi-green to-saudi-green-light text-white px-4 py-2 rounded-lg hover:from-saudi-green-dark hover:to-saudi-green transition-all shadow-lg flex items-center gap-2"
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
                      placeholder={
                        showQuestionMode
                          ? "اطرح سؤالاً عن المستندات..."
                          : documentStats?.totalDocuments > 0
                            ? `ابحث في ${documentStats.totalDocuments} مستند بـ ElasticSearch...`
                            : "ابحث في المستندات... (ارفع ملفات أولاً)"
                      }
                      className="w-full pr-12 pl-4 py-4 border-0 focus:ring-0 focus:outline-none text-lg font-cairo"
                      dir="rtl"
                    />
                  </div>
                  
                  {/* Mode Toggle */}
                  <div className="flex items-center border-r border-gray-200 pr-3">
                    <button
                      type="button"
                      onClick={() => setShowQuestionMode(!showQuestionMode)}
                      className={`p-2 rounded-lg transition-colors ${
                        showQuestionMode 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={showQuestionMode ? 'وضع البحث' : 'وضع الأسئلة'}
                    >
                      {showQuestionMode ? <MessageCircle className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Search Engine Indicators */}
                  <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-600">ElasticSearch</span>
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
                  
                  {/* Filters Button (only in search mode) */}
                  {!showQuestionMode && (
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
                  )}
                  
                  {/* Search/Ask Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !searchQuery.trim() || isSearching}
                    className="bg-gradient-to-r from-saudi-green to-saudi-green-light text-white px-6 py-4 hover:from-saudi-green-dark hover:to-saudi-green transition-all flex items-center gap-2 font-cairo font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : showQuestionMode ? (
                      <>
                        <MessageCircle className="h-5 w-5" />
                        اسأل
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        <Brain className="h-5 w-5" />
                        بحث ذكي
                      </>
                    )}
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

            {/* Mode Description */}
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              {showQuestionMode ? (
                <>
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>وضع الأسئلة: اطرح أسئلة مباشرة واحصل على إجابات من المستندات</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 text-blue-500" />
                  <span>وضع البحث: ابحث في ElasticSearch</span>
                </>
              )}
              
              <span className="text-gray-400">|</span>
              <span className="text-purple-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                وضع المحاكاة مفعل (لا يوجد اتصال بـ ElasticSearch)
              </span>
            </div>

            {/* Quick Search Terms */}
            <div className="mt-4 space-y-3">
              {documentStats?.totalDocuments === 0 ? (
                <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
                  <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">لا توجد مستندات مفهرسة</h3>
                  <p className="text-blue-700 mb-4">ابدأ برفع بعض المستندات لتتمكن من البحث المتقدم فيها</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    رفع مستندات
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                    <Zap className="h-4 w-4 text-saudi-green" />
                    {showQuestionMode ? 'أسئلة شائعة:' : 'عمليات بحث شائعة:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickSearchTerms.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(showQuestionMode ? `ما هي ${term}؟` : term);
                          if (showQuestionMode) {
                            handleAskQuestion();
                          } else {
                            performSearch();
                          }
                        }}
                        className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-saudi-green hover:to-saudi-green-light hover:text-white text-gray-700 px-3 py-1 rounded-full text-sm transition-all font-cairo"
                      >
                        {showQuestionMode ? `ما هي ${term}؟` : term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar (only in search mode) */}
          {showFilters && !showQuestionMode && (
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
            {/* Question Answer Display */}
            {showQuestionMode && questionAnswer && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">إجابة السؤال</h3>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium mb-2">السؤال:</p>
                    <p className="text-blue-700">"{searchQuery}"</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">الإجابة:</p>
                    <div className="text-green-700 whitespace-pre-wrap leading-relaxed">
                      {questionAnswer.answer}
                    </div>
                    
                    {questionAnswer.citations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-green-800 font-medium mb-2">المراجع:</p>
                        <div className="space-y-1">
                          {questionAnswer.citations.map((citation, index) => (
                            <div
                              key={index}
                              className="text-xs bg-white text-green-800 px-3 py-2 rounded border border-green-300"
                            >
                              📄 {citation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results Header (only in search mode) */}
            {!showQuestionMode && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                {/* Results Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-lg">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-saudi-green border-t-transparent rounded-full animate-spin" />
                          <span>جاري البحث المتقدم...</span>
                        </div>
                      ) : (
                        <>
                          تم العثور على <span className="font-semibold text-saudi-green">{searchResults.length}</span> نتيجة
                          {(searchQuery || initialSearchQuery) && (
                            <span> لـ "<span className="font-medium">{searchQuery || initialSearchQuery}</span>"</span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {searchQuery && searchResults.length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        {getElasticsearchResultsCount() > 0 && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Database className="h-4 w-4" />
                            <span>{getElasticsearchResultsCount()} من ElasticSearch</span>
                          </div>
                        )}
                        {getRAGResultsCount() > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Brain className="h-4 w-4" />
                            <span>{getRAGResultsCount()} من OpenAI</span>
                          </div>
                        )}
                      </div>
                    )}
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
                        <option value="relevance-desc">الصلة المتقدمة</option>
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

                {/* Search Strategy Message */}
                {getSearchStrategyMessage()}

                {/* No Results Message */}
                {noResultsMessage && searchResults.length === 0 && !isLoading && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">{noResultsMessage}</span>
                    </div>
                  </div>
                )}

                {/* Search Performance Info */}
                {(searchQuery || initialSearchQuery) && searchTime > 0 && !showQuestionMode && (
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span>وقت البحث: {(searchTime / 1000).toFixed(2)} ثانية</span>
                      {elasticsearchResults > 0 && (
                        <span className="text-blue-600">• {elasticsearchResults} نتيجة من ElasticSearch</span>
                      )}
                      {openaiResults > 0 && (
                        <span className="text-green-600">• {openaiResults} نتيجة من OpenAI</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span>ElasticSearch</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Search Results (only in search mode) */}
            {!showQuestionMode && (
              <EnhancedSearchResults
                results={searchResults}
                isLoading={isLoading}
                viewMode={viewMode}
                searchQuery={searchQuery || initialSearchQuery}
                onDocumentClick={handleDocumentClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
          enableRAGUpload={false}
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

export default EnhancedSearchInterface;