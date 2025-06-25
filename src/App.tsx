import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import MainSections from './components/MainSections';
import DigitalLibrary from './components/DigitalLibrary';
import NewsSection from './components/NewsSection';
import PlatformSections from './components/PlatformSections';
import RAGDemo from './pages/RAGDemo';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'rag'>('home');

  const navigateToRAG = () => {
    setCurrentPage('rag');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'rag') {
    return (
      <AuthProvider>
        <LanguageProvider>
          <RAGDemo />
        </LanguageProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main>
            {/* Hero Banner with AI */}
            <HeroBanner />
            
            {/* Hero Sections */}
            <MainSections />
            
            {/* News Section */}
            <NewsSection />
            
            {/* Digital Library */}
            <DigitalLibrary />
            
            {/* Platform Sections */}
            <PlatformSections />

            {/* RAG Demo Section */}
            <section className="py-16 bg-gradient-to-r from-saudi-green to-saudi-green-light">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    🚀 جرب نظام RAG التجريبي
                  </h2>
                  <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
                    اختبر قوة الذكاء الاصطناعي في تحليل المستندات والإجابة على الأسئلة. 
                    ارفع مستنداتك واحصل على إجابات فورية مع المراجع.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={navigateToRAG}
                      className="bg-white text-saudi-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>🤖</span>
                      تجربة النظام التجريبي
                    </button>
                    <div className="text-white text-opacity-80 text-sm">
                      مدعوم بـ OpenAI Assistant API
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-2xl mb-2">📄</div>
                    <h3 className="font-semibold mb-2">رفع المستندات</h3>
                    <p className="text-sm text-white text-opacity-90">
                      ادعم PDF، Word، Excel والمزيد
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-2xl mb-2">🧠</div>
                    <h3 className="font-semibold mb-2">تحليل ذكي</h3>
                    <p className="text-sm text-white text-opacity-90">
                      فهم المحتوى وفهرسة تلقائية
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-2xl mb-2">💬</div>
                    <h3 className="font-semibold mb-2">محادثة تفاعلية</h3>
                    <p className="text-sm text-white text-opacity-90">
                      اسأل واحصل على إجابات مع المراجع
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;