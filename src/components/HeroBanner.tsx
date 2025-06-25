import React, { useState } from 'react';
import { Search, Bot, Sparkles, X, Send, FileText, Calendar, MapPin, Eye, Download, Share2, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
}

export default function HeroBanner() {
  const { t } = useLanguage();
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'assistant' as const,
      content: 'مرحباً! أنا المساعد الذكي لمنصة معارف وزارة المالية. كيف يمكنني مساعدتك في العثور على المعلومات التي تحتاجها؟',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateSearchResults = (query: string): SearchResult[] => {
    const allResults: SearchResult[] = [
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
        relevanceScore: 95
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
        relevanceScore: 88
      },
      {
        id: '3',
        title: 'تقرير الأداء المالي الربعي Q4 2023',
        description: 'تقرير شامل عن الأداء المالي للربع الأخير من عام 2023',
        department: 'إدارة المحاسبة',
        uploadDate: '2024-01-01',
        fileType: 'Excel',
        fileSize: '3.2 MB',
        tags: ['تقرير', 'أداء مالي', 'ربعي', '2023'],
        category: 'التقارير المالية',
        content: 'يعرض التقرير المؤشرات المالية الرئيسية والمقارنات مع الفترات السابقة والأهداف المحددة. يشمل تحليل الإيرادات والمصروفات، ومؤشرات الأداء، والتوصيات للتحسين.',
        riskLevel: 'low',
        relevanceScore: 82
      },
      {
        id: '4',
        title: 'نموذج طلب اعتماد مصروف',
        description: 'النموذج الرسمي لطلب اعتماد المصروفات بجميع أنواعها',
        department: 'إدارة المالية',
        uploadDate: '2024-01-08',
        fileType: 'Word',
        fileSize: '156 KB',
        tags: ['نموذج', 'اعتماد', 'مصروف', 'طلب'],
        category: 'النماذج والاستمارات',
        content: 'نموذج موحد لطلب اعتماد المصروفات يتضمن جميع البيانات المطلوبة والتوقيعات اللازمة. يشمل تعليمات مفصلة لملء النموذج ومتطلبات المرفقات.',
        riskLevel: 'low',
        relevanceScore: 75
      },
      {
        id: '5',
        title: 'لائحة الحوكمة المؤسسية المحدثة',
        description: 'اللائحة المحدثة للحوكمة المؤسسية وإجراءات الامتثال',
        department: 'إدارة الامتثال',
        uploadDate: '2023-12-20',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        tags: ['حوكمة', 'امتثال', 'لائحة', 'مؤسسية'],
        category: 'الحوكمة والامتثال',
        content: 'تحدد اللائحة إطار الحوكمة المؤسسية ومسؤوليات الإدارات المختلفة في ضمان الامتثال. تشمل آليات الرقابة الداخلية وإجراءات إدارة المخاطر.',
        riskLevel: 'high',
        relevanceScore: 90
      },
      {
        id: '6',
        title: 'دليل المعايير المحاسبية السعودية',
        description: 'دليل شامل للمعايير المحاسبية المطبقة في المملكة العربية السعودية',
        department: 'إدارة المحاسبة',
        uploadDate: '2023-11-15',
        fileType: 'PDF',
        fileSize: '8.7 MB',
        tags: ['معايير محاسبية', 'سعودية', 'دليل', 'تطبيق'],
        category: 'المعايير والقوانين',
        content: 'يوضح الدليل جميع المعايير المحاسبية المعتمدة في المملكة مع أمثلة تطبيقية وحالات عملية. يتضمن التحديثات الأخيرة والتفسيرات الرسمية.',
        riskLevel: 'medium',
        relevanceScore: 85
      }
    ];

    if (!query.trim()) return allResults;

    const queryLower = query.toLowerCase();
    return allResults
      .filter(result => 
        result.title.toLowerCase().includes(queryLower) ||
        result.description.toLowerCase().includes(queryLower) ||
        result.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
        result.category.toLowerCase().includes(queryLower) ||
        result.department.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = generateSearchResults(query);
    setSearchResults(results);
    setSelectedResult(null);
    setShowSearchWidget(true);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Generate search results based on chat input
    const results = generateSearchResults(chatInput);
    setSearchResults(results);
    setSelectedResult(null);
    
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: generateAIResponse(chatInput, results),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string, results: SearchResult[]) => {
    if (results.length === 0) {
      return 'عذراً، لم أجد مستندات مطابقة لاستفسارك. يمكنك تجربة كلمات مفتاحية أخرى أو التواصل مع فريق الدعم للمساعدة.';
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
      {/* Hero Banner - Reduced Height */}
      <section className="hero-banner py-12">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
            <span className="text-white font-medium font-cairo text-sm">مدعوم بالذكاء الاصطناعي</span>
            <span className="text-white text-opacity-80 mr-2">•</span>
            <span className="text-white text-opacity-90 text-xs font-english">AI-Powered</span>
          </div>

          {/* Main Title - Reduced Size */}
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
            <span className="text-sm font-english">Discover Knowledge & Get Instant AI Assistance</span>
          </p>

          {/* Action Buttons - Compact */}
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
                  <p className="text-gray-600 text-sm font-cairo">ابحث في المعارف أو تحدث مع المساعد الذكي</p>
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
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-saudi-green" />
                  <h3 className="font-semibold text-gray-900 font-cairo">المساعد الذكي</h3>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
                </div>

                <div className="chat-messages custom-scrollbar">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${
                        message.type === 'user' ? 'message-user' : 'message-assistant'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                  
                  {isTyping && (
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
                      placeholder="اسأل عن السياسات والإجراءات..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-cairo"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleChatSend();
                        }
                      }}
                    />
                    <button
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || isTyping}
                      className="bg-saudi-green text-white px-4 py-3 rounded-lg hover:bg-saudi-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
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
                          const results = generateSearchResults(e.target.value);
                          setSearchResults(results);
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
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-cairo">لم يتم العثور على نتائج</p>
                            <p className="text-sm font-cairo">جرب كلمات مفتاحية أخرى</p>
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
                          <button className="flex-1 bg-saudi-green text-white px-3 py-2 rounded-lg hover:bg-saudi-green-dark transition-colors flex items-center justify-center gap-2 text-sm font-cairo">
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
    </>
  );
}