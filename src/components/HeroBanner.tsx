import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bot, Sparkles, X, Send, FileText, Calendar, MapPin, Eye, Download, Share2, Tag, Upload, Clock, CheckCircle, XCircle, Trash2, Filter, Grid, List, MessageCircle, Zap, Brain, BookOpen, ArrowRight, Plus, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDropzone } from 'react-dropzone';
import openaiService from '../services/openaiService';
import { searchDocuments, getDocuments, DocumentSearchResult, SearchFilters as ISearchFilters } from '../services/searchService';
import { useDebounce } from '../hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  department: string;
  uploadDate: string;
  fileType: string;
  fileSize: string;
  tags: string[];
  category: string;
  content: string;
  riskLevel: 'low' | 'medium' | 'high';
  relevanceScore: number;
  isRAGResult?: boolean;
  fileId?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  fileId?: string;
  error?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Array<{
    title: string;
    fileId?: string;
    content?: string;
  }>;
  isStreaming?: boolean;
  searchResults?: DocumentSearchResult[];
}

export default function HeroBanner() {
  const { t } = useLanguage();
  const [showSmartInterface, setShowSmartInterface] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DocumentSearchResult | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'search' | 'chat' | 'hybrid'>('hybrid');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // RAG Integration
  const [assistantReady, setAssistantReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🎯 **مرحباً! أنا مساعدك الذكي لمنصة معارف وزارة المالية**\n\nيمكنني مساعدتك في:\n• 🔍 **البحث المتقدم** في آلاف المستندات\n• 💬 **المحادثة التفاعلية** مع مستنداتك المرفوعة\n• 📊 **التحليل الذكي** للمحتوى والبيانات\n• 📋 **الحصول على ملخصات** وإجابات فورية\n\n**ابدأ بكتابة سؤالك أو ارفع مستندات للتحليل!**',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState<ISearchFilters>({
    dateRange: { start: '', end: '' },
    fileTypes: [],
    fileSizeRange: { min: 0, max: 100 },
    tags: [],
    authors: []
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize RAG assistant when component mounts
  useEffect(() => {
    initializeRAGAssistant();
    loadDocuments();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() && activeMode !== 'chat') {
      performSearch();
    } else if (!debouncedSearchQuery.trim()) {
      setSearchResults(allDocuments.slice(0, 10));
    }
  }, [debouncedSearchQuery, filters, activeMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDocuments = async () => {
    try {
      const documents = await getDocuments();
      setAllDocuments(documents);
      setSearchResults(documents.slice(0, 10));
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const performSearch = async () => {
    if (!debouncedSearchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchDocuments(debouncedSearchQuery, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const initializeRAGAssistant = async () => {
    setIsInitializing(true);
    try {
      await openaiService.getOrCreateAssistant();
      setAssistantReady(true);
      
      // Load existing files
      const existingFiles = await openaiService.listUploadedFiles();
      const fileList: UploadedFile[] = existingFiles.map(file => ({
        id: file.id,
        name: file.id,
        size: 0,
        status: 'ready',
        progress: 100,
        fileId: file.id
      }));
      setUploadedFiles(fileList);
    } catch (error) {
      console.error('Failed to initialize RAG assistant:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!assistantReady) return;

    for (const file of files) {
      if (file.size > 25 * 1024 * 1024) continue;

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      try {
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId && f.progress < 90 
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);

        const result = await openaiService.uploadFile(file);
        
        clearInterval(progressInterval);
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'processing', 
                progress: 100, 
                fileId: result.fileId 
              }
            : f
        ));

        // Check processing status
        const checkStatus = async () => {
          const status = await openaiService.checkFileStatus(result.fileId);
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: status === 'ready' ? 'ready' : status }
              : f
          ));

          if (status === 'processing') {
            setTimeout(checkStatus, 2000);
          }
        };

        setTimeout(checkStatus, 2000);

      } catch (error) {
        console.error('Upload failed:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'فشل في رفع الملف'
              }
            : f
        ));
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, [assistantReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 25 * 1024 * 1024,
    noClick: true
  });

  const handleSmartSearch = async (query: string, includeChat: boolean = true) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsSearching(true);

    try {
      // Perform document search
      const searchResults = await searchDocuments(query, filters);
      setSearchResults(searchResults);

      if (includeChat && (assistantReady || uploadedFiles.some(f => f.status === 'ready'))) {
        // Add streaming placeholder
        const streamingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
          searchResults: searchResults.slice(0, 5)
        };
        setChatMessages(prev => [...prev, streamingMessage]);

        // Get AI response
        const response = await openaiService.sendMessage(query, threadId || undefined);
        
        setChatMessages(prev => prev.map(msg => 
          msg.isStreaming 
            ? {
                ...msg,
                content: response.content,
                citations: response.citations?.map(citation => ({
                  title: citation,
                  fileId: `rag-file-${Math.random()}`,
                  content: 'محتوى من الوثيقة المرفوعة...'
                })),
                isStreaming: false,
                searchResults: searchResults.slice(0, 5)
              }
            : msg
        ));

        if (response.threadId) {
          setThreadId(response.threadId);
        }
      } else {
        // Generate contextual response based on search results
        const contextualResponse = generateSearchResponse(query, searchResults);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: contextualResponse,
          timestamp: new Date(),
          searchResults: searchResults.slice(0, 5)
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Smart search error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'عذراً، حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  };

  const generateSearchResponse = (query: string, results: DocumentSearchResult[]): string => {
    if (results.length === 0) {
      return `<div class="ai-response">
        <h3>🔍 نتائج البحث عن "${query}"</h3>
        <p>لم أعثر على مستندات تطابق استفسارك في قاعدة البيانات الحالية.</p>
        
        <div class="suggestions-section">
          <h4>💡 اقتراحات للبحث:</h4>
          <ul>
            <li>جرب مصطلحات مختلفة أو أوسع</li>
            <li>تحقق من الإملاء</li>
            <li>استخدم كلمات مفتاحية أساسية</li>
            <li>ارفع مستندات ذات صلة للحصول على إجابات أكثر دقة</li>
          </ul>
        </div>
      </div>`;
    }

    const topResult = results[0];
    return `<div class="ai-response">
      <h3>🎯 وجدت ${results.length} مستند${results.length > 1 ? 'ات' : ''} ذات صلة بـ "${query}"</h3>
      
      <div class="result-highlight">
        <h4>📄 أهم النتائج:</h4>
        <div class="document-card">
          <h5><strong>${topResult.title}</strong></h5>
          <p><em>من ${topResult.author || 'وزارة المالية'} - ${topResult.category}</em></p>
          <p>${topResult.excerpt?.substring(0, 200) || topResult.description?.substring(0, 200)}...</p>
          ${topResult.relevanceScore ? `<p><strong>درجة المطابقة:</strong> ${topResult.relevanceScore}%</p>` : ''}
        </div>
      </div>

      <div class="info-section">
        <h4>📊 ملخص النتائج:</h4>
        <ul>
          <li><strong>إجمالي المستندات:</strong> ${results.length}</li>
          <li><strong>أنواع الملفات:</strong> ${[...new Set(results.map(r => r.fileType.toUpperCase()))].join(', ')}</li>
          <li><strong>التصنيفات:</strong> ${[...new Set(results.map(r => r.category))].slice(0, 3).join(', ')}</li>
        </ul>
      </div>

      <div class="action-note">
        <p>💡 يمكنك الاطلاع على النتائج التفصيلية في القائمة الجانبية أو طرح أسئلة محددة حول المحتوى.</p>
      </div>
    </div>`;
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isTyping) return;

    await handleSmartSearch(chatInput, true);
    setChatInput('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSmartSearch(searchQuery, activeMode === 'hybrid');
    }
  };

  const handleResultClick = (result: DocumentSearchResult) => {
    setSelectedResult(result);
  };

  const handleCitationClick = (citation: { title: string; fileId?: string; content?: string }) => {
    if (citation.fileId) {
      setSelectedPDFFile(citation.fileId);
      setShowPDFViewer(true);
    }
  };

  const handleDeleteFile = async (fileId: string, openaiFileId?: string) => {
    if (openaiFileId) {
      try {
        await openaiService.deleteFile(openaiFileId);
      } catch (error) {
        console.error('Failed to delete file from OpenAI:', error);
      }
    }
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

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
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
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

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner py-8" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Brain className="h-5 w-5 text-yellow-300 mr-3" />
            <span className="text-white font-medium font-cairo text-sm">مدعوم بالذكاء الاصطناعي المتقدم</span>
            <span className="text-white text-opacity-80 mr-3">•</span>
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-white text-opacity-90 text-xs font-english">AI-Powered Smart Search & Chat</span>
            {assistantReady && (
              <>
                <span className="text-white text-opacity-80 mr-3">•</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </>
            )}
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            منصة معارف الذكية
            <br />
            <span className="text-lg md:text-xl font-normal text-white text-opacity-90">
              ابحث • تحدث • اكتشف مع مساعدك الذكي
            </span>
          </h1>

          <p className="hero-subtitle text-base md:text-lg text-white text-opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-cairo">محرك بحث ذكي ومساعد تفاعلي لاستكشاف المعرفة والحصول على إجابات فورية من مكتبة وزارة المالية</span>
          </p>

          {/* Smart Search Interface */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <div className="relative">
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المستندات أو اسأل مساعدك الذكي... (جرب: 'ما هي سياسة المصروفات؟' أو 'تقارير الأداء المالي')"
                  className="w-full pr-16 pl-6 py-4 text-lg border-0 rounded-2xl shadow-2xl focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all font-cairo bg-white bg-opacity-95 backdrop-blur-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isSearching && (
                    <div className="w-5 h-5 border-2 border-saudi-green border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <button
                    type="button"
                    onClick={startVoiceRecognition}
                    className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-saudi-green hover:bg-gray-100'}`}
                    title="البحث الصوتي"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    type="submit"
                    className="bg-saudi-green text-white p-2 rounded-lg hover:bg-saudi-green-dark transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Mode Selector */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-1 flex">
                <button
                  onClick={() => setActiveMode('search')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === 'search' 
                      ? 'bg-white text-saudi-green shadow-lg' 
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Search className="h-4 w-4 inline ml-2" />
                  بحث متقدم
                </button>
                <button
                  onClick={() => setActiveMode('hybrid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === 'hybrid' 
                      ? 'bg-white text-saudi-green shadow-lg' 
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Zap className="h-4 w-4 inline ml-2" />
                  ذكي مدمج
                </button>
                <button
                  onClick={() => setActiveMode('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === 'chat' 
                      ? 'bg-white text-saudi-green shadow-lg' 
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline ml-2" />
                  محادثة ذكية
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setShowSmartInterface(true)}
                className="bg-white text-saudi-green px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2"
              >
                <Bot className="h-5 w-5" />
                فتح المساعد الذكي
              </button>
              
              <div className="text-white text-opacity-80 text-sm flex items-center gap-2">
                <span>أو</span>
                <Upload className="h-4 w-4" />
                <span>اسحب ملفاتك هنا للتحليل الفوري</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-white">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">بحث ذكي</h3>
                <p className="text-sm text-white text-opacity-90">
                  بحث متقدم في المحتوى
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">محادثة تفاعلية</h3>
                <p className="text-sm text-white text-opacity-90">
                  اسأل واحصل على إجابات
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">تحليل ذكي</h3>
                <p className="text-sm text-white text-opacity-90">
                  فهم وتحليل المستندات
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">مراجع موثقة</h3>
                <p className="text-sm text-white text-opacity-90">
                  إجابات مع المصادر
                </p>
              </div>
            </div>
          </div>

          {/* Drag & Drop Overlay */}
          {isDragActive && (
            <div className="absolute inset-0 bg-saudi-green bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center text-white">
                <Upload className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">أفلت الملفات للتحليل الفوري</h3>
                <p className="text-lg">سيتم تحليل مستنداتك بالذكاء الاصطناعي</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Smart Interface Modal */}
      {showSmartInterface && (
        <div className="smart-interface animate-fade-in">
          <div className="smart-interface-content animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-saudi-green to-saudi-green-light text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">المساعد الذكي لمنصة معارف</h2>
                  <p className="text-green-100 text-sm">
                    بحث متقدم ومحادثة تفاعلية مع الذكاء الاصطناعي
                    {assistantReady && uploadedFiles.filter(f => f.status === 'ready').length > 0 && (
                      <span className="mr-2">• RAG نشط مع {uploadedFiles.filter(f => f.status === 'ready').length} ملف</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSmartInterface(false);
                  setSelectedResult(null);
                }}
                className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveMode('hybrid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMode === 'hybrid'
                      ? 'bg-saudi-green text-white'
                      : 'text-gray-600 hover:text-saudi-green hover:bg-gray-100'
                  }`}
                >
                  <Zap className="h-4 w-4 inline ml-2" />
                  الوضع الذكي المدمج
                </button>
                <button
                  onClick={() => setActiveMode('search')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMode === 'search'
                      ? 'bg-saudi-green text-white'
                      : 'text-gray-600 hover:text-saudi-green hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-4 w-4 inline ml-2" />
                  البحث المتقدم
                </button>
                <button
                  onClick={() => setActiveMode('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMode === 'chat'
                      ? 'bg-saudi-green text-white'
                      : 'text-gray-600 hover:text-saudi-green hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline ml-2" />
                  المحادثة الذكية
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg ${showFilters ? 'text-saudi-green bg-green-50' : 'text-gray-500 hover:text-saudi-green'}`}
                >
                  <Filter className="h-4 w-4" />
                </button>
                <div className="flex border border-gray-300 rounded-lg">
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

            {/* Content Grid */}
            <div className="flex h-full">
              {/* Chat Panel */}
              <div className="flex-1 chat-panel">
                {/* File Upload Status */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">الملفات المرفوعة</span>
                      <span className="text-xs text-gray-500">{uploadedFiles.length} ملف</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getStatusIcon(file.status)}
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.fileId)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="chat-messages custom-scrollbar">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="mb-6">
                      <div
                        className={`message-bubble ${
                          message.type === 'user' ? 'message-user' : 'message-assistant'
                        }`}
                      >
                        <div className="text-sm">
                          {message.isStreaming ? (
                            <div className="flex items-center gap-2">
                              <span>جاري التحليل والبحث</span>
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="ai-formatted-content"
                              dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                          )}
                        </div>
                        
                        {/* Citations */}
                        {message.citations && message.citations.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2 font-medium">المراجع من الملفات المرفوعة:</p>
                            <div className="space-y-1">
                              {message.citations.map((citation, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleCitationClick(citation)}
                                  className="block w-full text-left text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  📄 {citation.title}
                                  {citation.fileId && (
                                    <Eye className="h-3 w-3 inline mr-1 opacity-60" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Search Results */}
                        {message.searchResults && message.searchResults.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2 font-medium">نتائج البحث ذات الصلة:</p>
                            <div className="space-y-2">
                              {message.searchResults.slice(0, 3).map((result, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleResultClick(result)}
                                  className="block w-full text-left p-2 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {getFileIcon(result.fileType)}
                                    <span className="text-xs font-medium text-gray-900 truncate">{result.title}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2">{result.description}</p>
                                  {result.relevanceScore && (
                                    <span className="text-xs text-green-600 font-medium">
                                      {result.relevanceScore}% مطابقة
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && !chatMessages.some(m => m.isStreaming) && (
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        assistantReady 
                          ? uploadedFiles.filter(f => f.status === 'ready').length > 0
                            ? "اسأل عن المستندات المرفوعة أو ابحث في المكتبة..."
                            : "ابحث في المكتبة أو اسأل عن السياسات والإجراءات..."
                          : "جاري تهيئة المساعد..."
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-cairo"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleChatSend();
                        }
                      }}
                      disabled={isTyping || !assistantReady}
                    />
                    <button
                      onClick={startVoiceRecognition}
                      className={`px-3 py-3 rounded-lg transition-colors ${
                        isListening 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="البحث الصوتي"
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || isTyping || !assistantReady}
                      className="px-4 py-3 bg-saudi-green text-white rounded-lg hover:bg-saudi-green-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      {isTyping ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    مدعوم بـ OpenAI GPT-4 • اضغط Enter للإرسال • استخدم الميكروفون للبحث الصوتي
                  </p>
                </div>
              </div>

              {/* Search Results Panel */}
              <div className="w-96 border-l border-gray-200 flex flex-col">
                {!selectedResult ? (
                  <>
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="h-5 w-5 text-saudi-green" />
                        <h3 className="font-semibold text-gray-900 font-cairo">نتائج البحث</h3>
                        <span className="text-sm text-gray-500 font-cairo">({searchResults.length})</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {searchResults.length > 0 ? (
                          searchResults.slice(0, 10).map((result) => (
                            <div 
                              key={result.id} 
                              className="search-result-item cursor-pointer"
                              onClick={() => handleResultClick(result)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg flex-shrink-0">
                                  {getFileIcon(result.fileType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="search-result-title font-semibold text-gray-900 mb-1 line-clamp-2">
                                    {highlightText(result.title, searchQuery)}
                                  </h4>
                                  <p className="search-result-description text-gray-600 text-sm mb-2 line-clamp-2">
                                    {result.description && highlightText(result.description, searchQuery)}
                                  </p>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-cairo">
                                      {result.category}
                                    </span>
                                    {result.relevanceScore && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-cairo">
                                        {result.relevanceScore}% مطابقة
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 font-cairo">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(result.uploadDate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {result.fileType.toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : searchQuery.trim() ? (
                          <div className="text-center py-8 text-gray-500">
                            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-cairo font-medium mb-2">لم يتم العثور على نتائج</p>
                            <p className="text-sm font-cairo mb-4">جرب مصطلحات بحث مختلفة</p>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-cairo">ابدأ البحث في المكتبة</p>
                            <p className="text-sm font-cairo">أو استخدم المحادثة الذكية</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Document Details View */
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="flex items-center gap-2 text-saudi-green hover:text-saudi-green-dark mb-3"
                      >
                        <X className="h-4 w-4" />
                        <span className="text-sm font-cairo">العودة للنتائج</span>
                      </button>
                      <h3 className="font-semibold text-gray-900 font-cairo">تفاصيل المستند</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {/* Document Header */}
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                            {getFileIcon(selectedResult.fileType)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2 leading-tight font-cairo">
                              {selectedResult.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-cairo">
                                {selectedResult.category}
                              </span>
                              {selectedResult.relevanceScore && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-cairo">
                                  {selectedResult.relevanceScore}% مطابقة
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">المؤلف:</span>
                            <span className="font-medium font-cairo">{selectedResult.author || 'وزارة المالية'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">نوع الملف:</span>
                            <span className="font-medium">{selectedResult.fileType.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">حجم الملف:</span>
                            <span className="font-medium">{formatFileSize(selectedResult.fileSize)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">تاريخ الرفع:</span>
                            <span className="font-medium font-cairo">{formatDate(selectedResult.uploadDate)}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 font-cairo">الوصف</h5>
                          <p className="text-gray-700 text-sm leading-relaxed font-cairo">
                            {selectedResult.description}
                          </p>
                        </div>

                        {/* Content Preview */}
                        {selectedResult.excerpt && (
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2 font-cairo">معاينة المحتوى</h5>
                            <p className="text-gray-700 text-sm leading-relaxed font-cairo bg-gray-50 p-3 rounded-lg">
                              {selectedResult.excerpt}
                            </p>
                          </div>
                        )}

                        {/* Tags */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 font-cairo">العلامات</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedResult.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-cairo"
                              >
                                <Tag className="h-3 w-3 ml-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => {
                              if (selectedResult.id) {
                                setSelectedPDFFile(selectedResult.id);
                                setShowPDFViewer(true);
                              }
                            }}
                            className="flex-1 bg-saudi-green text-white px-3 py-2 rounded-lg hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2 text-sm font-cairo"
                          >
                            <Eye className="h-4 w-4" />
                            معاينة
                          </button>
                          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-cairo">
                            <Download className="h-4 w-4" />
                            تحميل
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedPDFFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 font-cairo">معاينة المستند</h3>
              <button
                onClick={() => {
                  setShowPDFViewer(false);
                  setSelectedPDFFile(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 p-4 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-cairo">معاينة PDF للملف: {selectedPDFFile}</p>
                <p className="text-sm text-gray-500 mt-2 font-cairo">
                  في التطبيق الحقيقي، سيتم عرض محتوى PDF هنا
                </p>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">محتوى المستند</h4>
                  <p className="text-sm text-gray-700 text-right font-cairo">
                    هذا نص تجريبي يمثل محتوى المستند المحدد. في التطبيق الحقيقي، 
                    سيتم عرض محتوى PDF الفعلي مع إمكانية البحث والتنقل.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-cairo">
                <Download className="h-4 w-4" />
                تحميل
              </button>
              <button 
                onClick={() => {
                  setShowPDFViewer(false);
                  setSelectedPDFFile(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-cairo"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}