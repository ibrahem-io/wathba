import React, { useState, useEffect } from 'react';
import { Search, Bot, Sparkles, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroBannerProps {
  onNavigateToSearch?: (query?: string) => void;
}

export default function HeroBanner({ onNavigateToSearch }: HeroBannerProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition if available
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
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onNavigateToSearch) {
      onNavigateToSearch(searchQuery.trim());
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

  const handleQuickSearch = (query: string) => {
    if (onNavigateToSearch) {
      onNavigateToSearch(query);
    }
  };

  const quickSearchTerms = [
    'السياسات المالية',
    'التقارير الربعية',
    'دليل الإجراءات',
    'الميزانية العامة',
    'معايير المحاسبة'
  ];

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
            <span className="text-white text-opacity-90 text-xs font-english">AI-Powered Search</span>
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
            <span className="text-sm font-english">Discover Knowledge & Get Instant AI Assistance</span>
          </p>

          {/* Enhanced Search Interface */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في آلاف المستندات والتقارير والسياسات..."
                      className="w-full pr-12 pl-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none font-cairo"
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
                  
                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="bg-saudi-green text-white px-8 py-4 hover:bg-saudi-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-cairo font-semibold"
                  >
                    <Search className="h-5 w-5" />
                    بحث متقدم
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Search Terms */}
            <div className="mb-8">
              <p className="text-white text-opacity-80 text-sm mb-3 font-cairo">عمليات بحث شائعة:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {quickSearchTerms.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(term)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full text-sm transition-all backdrop-blur-sm font-cairo"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold mb-2 font-cairo">بحث ذكي</h3>
                <p className="text-sm text-white text-opacity-90 font-cairo">
                  بحث متقدم في المحتوى مع فلترة دقيقة
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2 font-cairo">نتائج مرتبة</h3>
                <p className="text-sm text-white text-opacity-90 font-cairo">
                  ترتيب النتائج حسب الصلة والأهمية
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold mb-2 font-cairo">عارض متطور</h3>
                <p className="text-sm text-white text-opacity-90 font-cairo">
                  عرض وتحليل المستندات مع الاستشهاد
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}