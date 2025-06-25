import React, { useState, useEffect } from 'react';
import { Search, Bot, Sparkles, X, Send, FileText, Calendar, MapPin, Eye, Download, Share2, Tag, Upload, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import openaiService from '../services/openaiService';

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

export default function HeroBanner() {
  const { t } = useLanguage();
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<string | null>(null);
  
  // RAG Integration
  const [assistantReady, setAssistantReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
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
  }, []);

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

  const generateMockSearchResults = (query: string): SearchResult[] => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'سياسة المصروفات الرأسمالية للعام المالي 2024',
        description: 'دليل شامل للسياسات والإجراءات المتعلقة بالمصروفات الرأسمالية وآليات الاعتماد والمتابعة',
        department: 'إدارة الميزانية',
        uploadDate: '2024-01-15',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        tags: ['سياسة', 'مصروفات رأسمالية', 'ميزانية', '2024'],
        category: 'السياسات المالية',
        content: 'تحدد هذه السياسة الإجراءات المطلوبة لاعتماد المصروفات الرأسمالية، بما في ذلك حدود الصلاحيات ومتطلبات التوثيق والمراجعة. تشمل السياسة تعريفات واضحة للمصروفات الرأسمالية، وإجراءات التخطيط والموافقة، ومعايير التقييم والمتابعة.',
        riskLevel: 'low',
        relevanceScore: 95,
        fileId: 'mock-pdf-1'
      },
      {
        id: '2',
        title: 'دليل إجراءات المحاسبة الحكومية',
        description: 'دليل تفصيلي لجميع الإجراءات المحاسبية المطبقة في الوزارة وفقاً للمعايير الدولية',
        department: 'إدارة المحاسبة',
        uploadDate: '2024-01-10',
        fileType: 'PDF',
        fileSize: '5.1 MB',
        tags: ['محاسبة', 'إجراءات', 'معايير دولية', 'دليل'],
        category: 'الأدلة والإجراءات',
        content: 'يغطي الدليل جميع العمليات المحاسبية من القيد إلى إعداد التقارير المالية، مع التركيز على الامتثال للمعايير الدولية. يتضمن أمثلة عملية وحالات دراسية لتطبيق الإجراءات المحاسبية.',
        riskLevel: 'medium',
        relevanceScore: 88,
        fileId: 'mock-pdf-2'
      }
    ];

    if (!query.trim()) return mockResults;

    const queryLower = query.toLowerCase();
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(queryLower) ||
      result.description.toLowerCase().includes(queryLower) ||
      result.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
      result.category.toLowerCase().includes(queryLower)
    );
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const results = generateMockSearchResults(query);
    setSearchResults(results);
    setSelectedResult(null);
    setShowSearchWidget(true);

    // If no results found, automatically initiate AI chat
    if (results.length === 0 && query.trim()) {
      await initiateAIChatFromSearch(query);
    }
  };

  const initiateAIChatFromSearch = async (searchTerms: string) => {
    // Create a question from search terms
    const aiQuestion = `لم أجد مستندات مطابقة لمصطلحات البحث "${searchTerms}". هل يمكنك مساعدتي في العثور على معلومات ذات صلة أو تقديم إرشادات حول هذا الموضوع؟`;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: aiQuestion,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
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
        // Fallback to contextual response about the search terms
        setTimeout(() => {
          const contextualResponse = generateContextualResponse(searchTerms);
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

  const generateContextualResponse = (searchTerms: string): string => {
    const responses = {
      'ميزانية': `لم أجد مستندات محددة حول "${searchTerms}" في قاعدة البيانات الحالية، ولكن يمكنني مساعدتك بالمعلومات التالية:

📊 **حول الميزانية في وزارة المالية:**
• الميزانية العامة للدولة تُعد وفقاً للمعايير الدولية
• تشمل الإيرادات والمصروفات المخططة للسنة المالية
• يتم مراجعتها وتحديثها دورياً

💡 **اقتراحات للبحث:**
• جرب مصطلحات مثل "الميزانية العامة" أو "التخطيط المالي"
• ارفع مستندات ذات صلة للحصول على إجابات أكثر دقة
• تواصل مع إدارة الميزانية للحصول على الوثائق الرسمية`,

      'محاسبة': `لم أعثر على مستندات محددة حول "${searchTerms}"، ولكن إليك معلومات مفيدة:

📋 **المحاسبة الحكومية:**
• تطبق وزارة المالية معايير المحاسبة الدولية للقطاع العام
• النظام المحاسبي يشمل المحاسبة النقدية والاستحقاقية
• التقارير المالية تُعد وفقاً للمعايير السعودية والدولية

🔍 **للحصول على مزيد من المعلومات:**
• ابحث عن "دليل الإجراءات المحاسبية"
• راجع "معايير المحاسبة الحكومية"
• ارفع الوثائق المحاسبية للتحليل التفصيلي`,

      'سياسة': `لم أجد مستندات تطابق "${searchTerms}" تماماً، ولكن يمكنني توضيح:

📜 **السياسات في وزارة المالية:**
• السياسات المالية تحدد الإطار العام للعمليات المالية
• تشمل سياسات الإنفاق والاستثمار والرقابة
• يتم تحديثها بانتظام لتواكب التطورات

📝 **نصائح للبحث الفعال:**
• استخدم مصطلحات أكثر تحديداً
• جرب البحث بالإنجليزية أيضاً
• ارفع نسخ من السياسات للتحليل المفصل`
    };

    // Find the most relevant response based on search terms
    const searchLower = searchTerms.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (searchLower.includes(key)) {
        return response;
      }
    }

    // Default response for unmatched terms
    return `لم أعثر على مستندات تطابق مصطلحات البحث "${searchTerms}" في قاعدة البيانات الحالية.

🤔 **ماذا يمكنك فعله:**

1. **جرب مصطلحات بديلة:**
   • استخدم كلمات مرادفة أو مصطلحات أوسع
   • جرب البحث باللغة الإنجليزية
   • استخدم مصطلحات أكثر تحديداً

2. **ارفع مستندات ذات صلة:**
   • ارفع ملفات PDF أو Word تحتوي على المعلومات المطلوبة
   • سأتمكن من تحليلها والإجابة على أسئلتك بدقة أكبر

3. **اطرح أسئلة مباشرة:**
   • بدلاً من البحث، اسألني مباشرة عما تريد معرفته
   • يمكنني تقديم معلومات عامة حول المواضيع المالية والإدارية

هل تريد المساعدة في صياغة استفسار أكثر تحديداً؟`;
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
    
    // Generate search results based on chat input
    const results = generateMockSearchResults(chatInput);
    setSearchResults(results);
    setSelectedResult(null);
    
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
          const aiResponse = generateAIResponse(userMessage.content, results);
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

  const generateAIResponse = (query: string, results: SearchResult[]) => {
    if (results.length === 0) {
      return generateContextualResponse(query);
    }

    const topResult = results[0];
    return `وجدت ${results.length} مستند${results.length > 1 ? 'ات' : ''} ذات صلة باستفسارك. أهم النتائج:

📄 **${topResult.title}**
من ${topResult.department} - ${topResult.category}

${topResult.content.substring(0, 200)}...

يمكنك الاطلاع على النتائج في القائمة الجانبية للحصول على تفاصيل أكثر.`;
  };

  const handleResultClick = (result: SearchResult) => {
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

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner py-12">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-white font-medium font-cairo text-sm">مدعوم بالذكاء الاصطناعي</span>
            <span className="text-white text-opacity-80 mr-2">•</span>
            <span className="text-white text-opacity-90 text-xs font-english">AI-Powered RAG</span>
            {assistantReady && (
              <>
                <span className="text-white text-opacity-80 mr-2">•</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </>
            )}
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            منصة معارف
            <br />
            <span className="text-lg md:text-xl font-normal text-white text-opacity-90">
              وزارة المالية
            </span>
          </h1>

          <p className="hero-subtitle text-base md:text-lg text-white text-opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            <span className="font-cairo">اكتشف المعرفة واستكشف الوثائق واحصل على إجابات فورية</span>
            <br />
            <span className="text-sm font-english">Discover Knowledge & Get Instant AI Assistance with RAG</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في المعارف والوثائق..."
                  className="w-full px-4 py-3 pr-12 rounded-lg text-base border-0 shadow-lg focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all font-cairo"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="ابحث في المعارف والوثائق..."]') as HTMLInputElement;
                    if (input?.value) {
                      handleSearch(input.value);
                    }
                  }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-saudi-green text-white p-2 rounded-lg hover:bg-saudi-green-dark transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Agent Button */}
            <button
              onClick={() => setShowSearchWidget(true)}
              className="bg-white text-saudi-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap font-cairo"
            >
              <Bot className="h-5 w-5" />
              المساعد الذكي
              {isInitializing && <Clock className="h-4 w-4 animate-spin" />}
            </button>
          </div>
        </div>
      </section>

      {/* Search Widget Modal */}
      {showSearchWidget && (
        <div className="search-widget animate-fade-in">
          <div className="search-widget-content animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-saudi-green text-white p-2 rounded-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-cairo">البحث والمساعد الذكي</h2>
                  <p className="text-gray-600 text-sm font-cairo">
                    ابحث في المعارف أو تحدث مع المساعد الذكي
                    {assistantReady && uploadedFiles.filter(f => f.status === 'ready').length > 0 && (
                      <span className="text-green-600"> • RAG نشط</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSearchWidget(false);
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
                      <div className="text-sm whitespace-pre-wrap">
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
                          message.content
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
                          const results = generateMockSearchResults(e.target.value);
                          setSearchResults(results);
                          
                          // Auto-initiate AI chat if no results and query is not empty
                          if (results.length === 0 && e.target.value.trim()) {
                            setTimeout(() => initiateAIChatFromSearch(e.target.value), 500);
                          }
                        }}
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
                                    {getRiskBadge(result.riskLevel)}
                                    {result.isRAGResult && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-cairo">
                                        RAG
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 font-cairo">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {result.department}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {result.uploadDate}
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
                              {getRiskBadge(selectedResult.riskLevel)}
                            </div>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">الإدارة:</span>
                            <span className="font-medium font-cairo">{selectedResult.department}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">نوع الملف:</span>
                            <span className="font-medium">{selectedResult.fileType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">حجم الملف:</span>
                            <span className="font-medium">{selectedResult.fileSize}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">تاريخ الرفع:</span>
                            <span className="font-medium font-cairo">{selectedResult.uploadDate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-cairo">درجة الصلة:</span>
                            <span className="font-medium">{selectedResult.relevanceScore}%</span>
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
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2 font-cairo">معاينة المحتوى</h5>
                          <p className="text-gray-700 text-sm leading-relaxed font-cairo bg-gray-50 p-3 rounded-lg">
                            {selectedResult.content}
                          </p>
                        </div>

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
                              if (selectedResult.fileId) {
                                setSelectedPDFFile(selectedResult.fileId);
                                setShowPDFViewer(true);
                              }
                            }}
                            className="flex-1 bg-saudi-green text-white px-3 py-2 rounded-lg hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2 text-sm font-cairo"
                          >
                            <Eye className="h-4 w-4" />
                            معاينة PDF
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