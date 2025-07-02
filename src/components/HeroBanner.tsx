import React, { useState, useEffect } from 'react';
import { Search, Bot, Sparkles, X, Send, FileText, Calendar, MapPin, Eye, Download, Share2, Tag, Upload, Clock, CheckCircle, XCircle, Trash2, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import openaiService from '../services/openaiService';
import { searchDocuments, DocumentSearchResult } from '../services/searchService';

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
}

type SearchMode = 'search' | 'chat' | 'hybrid';

export default function HeroBanner() {
  const { t } = useLanguage();
  const [showSmartInterface, setShowSmartInterface] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DocumentSearchResult | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('hybrid');
  const [isSearching, setIsSearching] = useState(false);
  
  // RAG Integration
  const [assistantReady, setAssistantReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي لمنصة معارف وزارة المالية. يمكنني مساعدتك في البحث عن المعلومات والإجابة على أسئلتك. ارفع مستندات للحصول على إجابات أكثر دقة!',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize RAG assistant when component mounts
  useEffect(() => {
    initializeRAGAssistant();
    initializeVoiceRecognition();
  }, []);

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ar-SA';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
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

  // Main search function that handles both regular search and AI integration
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    setShowSmartInterface(true);

    try {
      // Perform document search
      const results = await searchDocuments(query, {
        dateRange: { start: '', end: '' },
        fileTypes: [],
        fileSizeRange: { min: 0, max: 100 },
        tags: [],
        authors: []
      });

      setSearchResults(results);

      // If in hybrid or chat mode, also trigger AI response
      if (searchMode === 'hybrid' || searchMode === 'chat') {
        await initiateAIChatFromSearch(query, results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const initiateAIChatFromSearch = async (searchTerms: string, searchResults: DocumentSearchResult[]) => {
    try {
      // Create a contextual AI question based on search results
      let aiQuestion = `يمكنك مساعدتي في العثور على معلومات حول "${searchTerms}"؟`;
      
      if (searchResults.length > 0) {
        aiQuestion = `وجدت ${searchResults.length} مستند${searchResults.length > 1 ? 'ات' : ''} متعلقة بـ "${searchTerms}". يمكنك تلخيص أهم المعلومات من هذه المستندات وتوضيح كيف يمكن أن تساعدني؟`;
      } else {
        aiQuestion = `لم أجد مستندات مطابقة لـ "${searchTerms}" في قاعدة البيانات. يمكنك تقديم معلومات عامة حول هذا الموضوع أو اقتراح مصطلحات بحث بديلة؟`;
      }
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: aiQuestion,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Add streaming placeholder
      const streamingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };
      setChatMessages(prev => [...prev, streamingMessage]);

      if (assistantReady && uploadedFiles.some(f => f.status === 'ready')) {
        // Use RAG if files are uploaded
        const response = await openaiService.sendMessage(aiQuestion, threadId || undefined);
        
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
                isStreaming: false
              }
            : msg
        ));

        if (response.threadId) {
          setThreadId(response.threadId);
        }
      } else {
        // Fallback to contextual response about the search terms and results
        setTimeout(() => {
          const contextualResponse = generateContextualResponse(searchTerms, searchResults);
          setChatMessages(prev => prev.map(msg => 
            msg.isStreaming 
              ? { ...msg, content: contextualResponse, isStreaming: false }
              : msg
          ));
        }, 1500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => prev.filter(msg => !msg.isStreaming));
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة استفسارك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateContextualResponse = (searchTerms: string, searchResults: DocumentSearchResult[]): string => {
    if (searchResults.length > 0) {
      const topResults = searchResults.slice(0, 3);
      return `<div class="ai-response">
        <h3>🔍 نتائج البحث عن "${searchTerms}"</h3>
        <p>وجدت <strong>${searchResults.length} مستند${searchResults.length > 1 ? 'ات' : ''}</strong> ذات صلة بالموضوع:</p>
        
        <div class="result-highlight">
          <h4>📄 أهم النتائج:</h4>
          ${topResults.map(result => `
            <div class="document-card">
              <h5><strong>${result.title}</strong></h5>
              <p><em>${result.category} - ${result.fileType.toUpperCase()}</em></p>
              <p>${result.excerpt?.substring(0, 150)}...</p>
              <div class="text-xs text-gray-500">درجة المطابقة: ${result.relevanceScore}%</div>
            </div>
          `).join('')}
        </div>

        <div class="suggestions-section">
          <h4>💡 يمكنك:</h4>
          <ul>
            <li>النقر على أي نتيجة في القائمة الجانبية لعرض التفاصيل</li>
            <li>استخدام المرشحات لتضييق نطاق البحث</li>
            <li>رفع مستندات إضافية للحصول على إجابات أكثر دقة</li>
          </ul>
        </div>
      </div>`;
    }

    // Fallback responses for different search terms
    const responses = {
      'ميزانية': `<div class="ai-response">
        <h3>🔍 البحث عن "${searchTerms}"</h3>
        <p>لم أجد مستندات محددة حول <strong>"${searchTerms}"</strong> في قاعدة البيانات الحالية، ولكن يمكنني مساعدتك:</p>
        
        <div class="info-section">
          <h4>📊 حول الميزانية في وزارة المالية:</h4>
          <ul>
            <li>الميزانية العامة للدولة تُعد وفقاً للمعايير الدولية</li>
            <li>تشمل الإيرادات والمصروفات المخططة للسنة المالية</li>
            <li>يتم مراجعتها وتحديثها دورياً</li>
          </ul>
        </div>

        <div class="suggestions-section">
          <h4>💡 اقتراحات للبحث:</h4>
          <ul>
            <li>جرب مصطلحات مثل "الميزانية العامة" أو "التخطيط المالي"</li>
            <li>ارفع مستندات ذات صلة للحصول على إجابات أكثر دقة</li>
            <li>استخدم المرشحات لتحديد نوع المستند أو التاريخ</li>
          </ul>
        </div>
      </div>`,

      'محاسبة': `<div class="ai-response">
        <h3>🔍 البحث عن "${searchTerms}"</h3>
        <p>لم أعثر على مستندات محددة حول <strong>"${searchTerms}"</strong>، ولكن إليك معلومات مفيدة:</p>

        <div class="info-section">
          <h4>📋 المحاسبة الحكومية:</h4>
          <ul>
            <li>تطبق وزارة المالية معايير المحاسبة الدولية للقطاع العام</li>
            <li>النظام المحاسبي يشمل المحاسبة النقدية والاستحقاقية</li>
            <li>التقارير المالية تُعد وفقاً للمعايير السعودية والدولية</li>
          </ul>
        </div>

        <div class="suggestions-section">
          <h4>🔍 للحصول على مزيد من المعلومات:</h4>
          <ul>
            <li>ابحث عن "دليل الإجراءات المحاسبية"</li>
            <li>راجع "معايير المحاسبة الحكومية"</li>
            <li>ارفع الوثائق المحاسبية للتحليل التفصيلي</li>
          </ul>
        </div>
      </div>`
    };

    // Find the most relevant response based on search terms
    const searchLower = searchTerms.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (searchLower.includes(key)) {
        return response;
      }
    }

    // Default response for unmatched terms
    return `<div class="ai-response">
      <h3>🔍 البحث عن "${searchTerms}"</h3>
      <p>لم أعثر على مستندات تطابق مصطلحات البحث <strong>"${searchTerms}"</strong> في قاعدة البيانات الحالية.</p>

      <div class="suggestions-section">
        <h4>🤔 ماذا يمكنك فعله:</h4>
        
        <div class="suggestion-item">
          <h5>1. جرب مصطلحات بديلة:</h5>
          <ul>
            <li>استخدم كلمات مرادفة أو مصطلحات أوسع</li>
            <li>جرب البحث باللغة الإنجليزية</li>
            <li>استخدم مصطلحات أكثر تحديداً</li>
          </ul>
        </div>

        <div class="suggestion-item">
          <h5>2. ارفع مستندات ذات صلة:</h5>
          <ul>
            <li>ارفع ملفات PDF أو Word تحتوي على المعلومات المطلوبة</li>
            <li>سأتمكن من تحليلها والإجابة على أسئلتك بدقة أكبر</li>
          </ul>
        </div>

        <div class="suggestion-item">
          <h5>3. اطرح أسئلة مباشرة:</h5>
          <ul>
            <li>بدلاً من البحث، اسألني مباشرة عما تريد معرفته</li>
            <li>يمكنني تقديم معلومات عامة حول المواضيع المالية والإدارية</li>
          </ul>
        </div>
      </div>

      <div class="help-section">
        <p><strong>هل تريد المساعدة في صياغة استفسار أكثر تحديداً؟</strong></p>
      </div>
    </div>`;
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

  const handleChatSend = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Also perform search if in hybrid mode
    if (searchMode === 'hybrid') {
      const results = await searchDocuments(chatInput, {
        dateRange: { start: '', end: '' },
        fileTypes: [],
        fileSizeRange: { min: 0, max: 100 },
        tags: [],
        authors: []
      });
      setSearchResults(results);
    }
    
    setChatInput('');
    setIsTyping(true);

    // Add streaming placeholder
    const streamingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    setChatMessages(prev => [...prev, streamingMessage]);

    try {
      if (assistantReady && uploadedFiles.some(f => f.status === 'ready')) {
        // Use RAG if files are uploaded
        const response = await openaiService.sendMessage(userMessage.content, threadId || undefined);
        
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
                isStreaming: false
              }
            : msg
        ));

        if (response.threadId) {
          setThreadId(response.threadId);
        }
      } else {
        // Fallback to mock response
        setTimeout(() => {
          const aiResponse = generateAIResponse(userMessage.content, searchResults);
          setChatMessages(prev => prev.map(msg => 
            msg.isStreaming 
              ? { ...msg, content: aiResponse, isStreaming: false }
              : msg
          ));
        }, 1500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => prev.filter(msg => !msg.isStreaming));
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (query: string, results: DocumentSearchResult[]) => {
    if (results.length === 0) {
      return generateContextualResponse(query, results);
    }

    const topResult = results[0];
    return `<div class="ai-response">
      <h3>📋 وجدت ${results.length} مستند${results.length > 1 ? 'ات' : ''} ذات صلة باستفسارك</h3>
      
      <div class="result-highlight">
        <h4>📄 أهم النتائج:</h4>
        <div class="document-card">
          <h5><strong>${topResult.title}</strong></h5>
          <p><em>من ${topResult.author || 'وزارة المالية'} - ${topResult.category}</em></p>
          <p>${topResult.excerpt?.substring(0, 200)}...</p>
        </div>
      </div>

      <div class="action-note">
        <p>💡 يمكنك الاطلاع على النتائج في القائمة الجانبية للحصول على تفاصيل أكثر.</p>
      </div>
    </div>`;
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

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel as keyof typeof colors]}`}>
        {labels[riskLevel as keyof typeof labels]}
      </span>
    );
  };

  const getFileIcon = (fileType: string) => {
    const iconClass = "h-5 w-5";
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'word':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'excel':
        return <FileText className={`${iconClass} text-green-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner py-16">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-white font-medium font-cairo text-sm">مدعوم بالذكاء الاصطناعي</span>
            <span className="text-white text-opacity-80 mr-2">•</span>
            <span className="text-white text-opacity-90 text-xs font-english">AI-Powered Smart Search</span>
            {assistantReady && (
              <>
                <span className="text-white text-opacity-80 mr-2">•</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </>
            )}
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            منصة معارف الذكية
            <br />
            <span className="text-lg md:text-xl font-normal text-white text-opacity-90">
              وزارة المالية - البحث والمحادثة التفاعلية
            </span>
          </h1>

          <p className="hero-subtitle text-base md:text-lg text-white text-opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            <span className="font-cairo">ابحث في آلاف المستندات أو تحدث مع المساعد الذكي للحصول على إجابات فورية</span>
            <br />
            <span className="text-sm font-english">Smart Document Search & AI Chat Assistant</span>
          </p>

          {/* Enhanced Search Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              {/* Mode Selector */}
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-1 flex">
                  <button
                    onClick={() => setSearchMode('search')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      searchMode === 'search' 
                        ? 'bg-white text-saudi-green shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    🔍 بحث متقدم
                  </button>
                  <button
                    onClick={() => setSearchMode('chat')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      searchMode === 'chat' 
                        ? 'bg-white text-saudi-green shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    💬 محادثة ذكية
                  </button>
                  <button
                    onClick={() => setSearchMode('hybrid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      searchMode === 'hybrid' 
                        ? 'bg-white text-saudi-green shadow-sm' 
                        : 'text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    ⚡ هجين (الأفضل)
                  </button>
                </div>
              </div>

              {/* Smart Search Bar */}
              <div className="relative">
                <div className="flex items-center bg-white rounded-xl shadow-lg">
                  <Search className="h-6 w-6 text-gray-400 mr-4 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder={
                      searchMode === 'search' 
                        ? "ابحث في المستندات والتقارير..."
                        : searchMode === 'chat'
                        ? "اسأل المساعد الذكي..."
                        : "ابحث أو اسأل أي شيء..."
                    }
                    className="flex-1 px-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-0 font-cairo"
                    disabled={isSearching}
                  />
                  
                  {/* Voice Recognition Button */}
                  {recognition && (
                    <button
                      onClick={toggleVoiceRecognition}
                      className={`p-3 mx-2 rounded-lg transition-all ${
                        isListening 
                          ? 'bg-red-100 text-red-600 voice-recording' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isListening ? 'إيقاف التسجيل الصوتي' : 'بدء التسجيل الصوتي'}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                  )}

                  {/* Search/Send Button */}
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={!searchQuery.trim() || isSearching}
                    className="bg-saudi-green text-white px-6 py-4 rounded-xl hover:bg-saudi-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 mr-2"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : searchMode === 'chat' ? (
                      <Send className="h-5 w-5" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">
                      {searchMode === 'chat' ? 'إرسال' : 'بحث'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mode Description */}
              <div className="mt-4 text-center">
                <p className="text-white text-opacity-80 text-sm">
                  {searchMode === 'search' && "🔍 البحث المتقدم في قاعدة المستندات مع مرشحات ذكية"}
                  {searchMode === 'chat' && "💬 محادثة تفاعلية مع المساعد الذكي المدعوم بـ OpenAI"}
                  {searchMode === 'hybrid' && "⚡ بحث ذكي + محادثة تفاعلية للحصول على أفضل النتائج"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowSmartInterface(true)}
                className="bg-white text-saudi-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 font-cairo"
              >
                <Bot className="h-5 w-5" />
                فتح الواجهة الذكية
                {isInitializing && <Clock className="h-4 w-4 animate-spin" />}
              </button>
              
              <div className="text-white text-opacity-80 text-sm text-center">
                <div>مدعوم بـ OpenAI GPT-4 • البحث المتقدم</div>
                <div className="text-xs mt-1">
                  {uploadedFiles.filter(f => f.status === 'ready').length > 0 && 
                    `${uploadedFiles.filter(f => f.status === 'ready').length} ملف جاهز للاستعلام`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Interface Modal */}
      {showSmartInterface && (
        <div className="smart-interface animate-fade-in">
          <div className="smart-interface-content animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-saudi-green text-white p-2 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-cairo">الواجهة الذكية</h2>
                  <p className="text-gray-600 text-sm font-cairo">
                    بحث متقدم + محادثة ذكية
                    {assistantReady && uploadedFiles.filter(f => f.status === 'ready').length > 0 && (
                      <span className="text-green-600"> • RAG نشط</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSmartInterface(false);
                  setSelectedResult(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Grid */}
            <div className="flex h-full">
              {/* Chat Panel */}
              <div className="flex-1 chat-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-saudi-green" />
                    <h3 className="font-semibold text-gray-900 font-cairo">المساعد الذكي</h3>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${assistantReady ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.md,.xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                      title="رفع ملفات"
                    >
                      <Upload className="h-4 w-4" />
                    </label>
                    <span className="text-xs text-gray-500">
                      {uploadedFiles.filter(f => f.status === 'ready').length} ملف
                    </span>
                  </div>
                </div>

                {/* Uploaded Files Status */}
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
                    <div
                      key={message.id}
                      className={`message-bubble ${
                        message.type === 'user' ? 'message-user' : 'message-assistant'
                      }`}
                    >
                      <div className="text-sm">
                        {message.isStreaming ? (
                          <div className="flex items-center gap-2">
                            <span>جاري الكتابة</span>
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
                          <p className="text-xs text-gray-600 mb-2 font-medium">المراجع:</p>
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
                    </div>
                  ))}
                  
                  {isTyping && !chatMessages.some(m => m.isStreaming) && (
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  )}
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
                            ? "اسأل عن المستندات المرفوعة..."
                            : "اسأل عن السياسات والإجراءات..."
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
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || isTyping || !assistantReady}
                      className="bg-saudi-green text-white px-4 py-3 rounded-lg hover:bg-saudi-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isTyping ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
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
                        <span className="text-sm text-gray-500 font-cairo">({searchResults.length} نتيجة)</span>
                      </div>

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                        onKeyPress={handleSearchKeyPress}
                        placeholder="ابحث في الوثائق..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-cairo text-sm"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {searchResults.length > 0 ? (
                          searchResults.map((result) => (
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
                                    {result.title}
                                  </h4>
                                  <p className="search-result-description text-gray-600 text-sm mb-2 line-clamp-2">
                                    {result.description}
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
                                      <MapPin className="h-3 w-3" />
                                      {result.author || 'وزارة المالية'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(result.uploadDate).toLocaleDateString('ar-SA')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : searchQuery.trim() ? (
                          <div className="text-center py-8 text-gray-500">
                            <Bot className="h-12 w-12 mx-auto mb-4 text-saudi-green animate-pulse" />
                            <p className="font-cairo font-medium mb-2">لم يتم العثور على نتائج</p>
                            <p className="text-sm font-cairo mb-4">تم تشغيل المساعد الذكي تلقائياً للمساعدة</p>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-xs text-blue-700 font-cairo">
                                💡 المساعد الذكي يحلل استفسارك ويقدم إجابات مفيدة حتى لو لم توجد مستندات مطابقة
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-cairo">ابدأ البحث في الوثائق</p>
                            <p className="text-sm font-cairo">أو استخدم المساعد الذكي للاستفسار</p>
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
                            <span className="font-medium font-cairo">{new Date(selectedResult.uploadDate).toLocaleDateString('ar-SA')}</span>
                          </div>
                          {selectedResult.relevanceScore && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 font-cairo">درجة الصلة:</span>
                              <span className="font-medium">{selectedResult.relevanceScore}%</span>
                            </div>
                          )}
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
                <p className="text-gray-600 font-cairo">معاينة المستند: {selectedPDFFile}</p>
                <p className="text-sm text-gray-500 mt-2 font-cairo">
                  في التطبيق الحقيقي، سيتم عرض محتوى المستند هنا
                </p>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">محتوى المستند</h4>
                  <p className="text-sm text-gray-700 text-right font-cairo">
                    هذا نص تجريبي يمثل محتوى المستند المحدد. في التطبيق الحقيقي، 
                    سيتم عرض محتوى المستند الفعلي مع إمكانية البحث والتنقل.
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