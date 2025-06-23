import React, { useState } from 'react';
import { Search, Bot, Sparkles, X, Send, FileText, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDocuments } from '../data/mockData';

export default function HeroBanner() {
  const { t } = useLanguage();
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: generateAIResponse(chatInput),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    const responses = [
      'بناءً على بحثي في قاعدة البيانات، وجدت عدة مستندات ذات صلة بسؤالك. يمكنك الاطلاع على سياسة المصروفات الرأسمالية ودليل الإجراءات المحاسبية.',
      'يمكنني مساعدتك في العثور على المعلومات المطلوبة. هناك عدة وثائق في النظام تتعلق بموضوعك.',
      'وفقاً للوثائق المتاحة في المنصة، يمكنني توجيهك إلى المراجع المناسبة لاستفسارك.',
      'تم العثور على معلومات مفيدة في عدة مستندات. دعني أوضح لك أهم النقاط المتعلقة بسؤالك.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner py-20">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-white font-medium font-cairo">مدعوم بالذكاء الاصطناعي</span>
            <span className="text-white text-opacity-80 mr-2">•</span>
            <span className="text-white text-opacity-90 text-sm font-english">AI-Powered Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            منصة معارف
            <br />
            <span className="text-2xl md:text-3xl font-normal text-white text-opacity-90">
              وزارة المالية
            </span>
          </h1>

          <p className="hero-subtitle text-xl text-white text-opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            <span className="font-cairo">اكتشف المعرفة، واستكشف الوثائق، واحصل على إجابات فورية من مساعدنا الذكي</span>
            <br />
            <span className="text-lg font-english">Discover Knowledge, Explore Documents, Get Instant AI Assistance</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في المعارف والوثائق..."
                  className="w-full px-6 py-4 pr-14 rounded-xl text-lg border-0 shadow-lg focus:ring-4 focus:ring-white focus:ring-opacity-30 transition-all font-cairo"
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-saudi-green text-white p-2 rounded-lg hover:bg-saudi-green-dark transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* AI Agent Button */}
            <button
              onClick={() => setShowSearchWidget(true)}
              className="bg-white text-saudi-green px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg flex items-center gap-3 whitespace-nowrap font-cairo"
            >
              <Bot className="h-6 w-6" />
              المساعد الذكي
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 font-cairo">بحث ذكي</h3>
              <p className="text-white text-opacity-80 font-cairo">ابحث في آلاف الوثائق والسياسات بسهولة</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 font-cairo">مساعد ذكي</h3>
              <p className="text-white text-opacity-80 font-cairo">احصل على إجابات فورية من الذكاء الاصطناعي</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 font-cairo">مكتبة شاملة</h3>
              <p className="text-white text-opacity-80 font-cairo">وصول سريع لجميع الوثائق والمراجع</p>
            </div>
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
                onClick={() => setShowSearchWidget(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Grid */}
            <div className="search-results-grid">
              {/* Chat Panel */}
              <div className="chat-panel">
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
              <div className="search-results-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-saudi-green" />
                  <h3 className="font-semibold text-gray-900 font-cairo">نتائج البحث</h3>
                  <span className="text-sm text-gray-500 font-cairo">({filteredDocuments.length} نتيجة)</span>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في الوثائق..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-cairo"
                  />
                </div>

                <div className="space-y-3 custom-scrollbar" style={{ maxHeight: 'calc(100% - 120px)', overflowY: 'auto' }}>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <div key={doc.id} className="search-result-item">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg flex-shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="search-result-title font-semibold text-gray-900 mb-1 line-clamp-2">
                              {doc.title}
                            </h4>
                            <p className="search-result-description text-gray-600 text-sm mb-2 line-clamp-2">
                              {doc.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 font-cairo">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {doc.department}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.uploadDate}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-cairo"
                                >
                                  {tag}
                                </span>
                              ))}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}