import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import MainSections from './components/MainSections';
import DigitalLibrary from './components/DigitalLibrary';
import NewsSection from './components/NewsSection';
import PlatformSections from './components/PlatformSections';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Sections */}
          <MainSections />
          
          {/* News Section */}
          <NewsSection />
          
          {/* Digital Library */}
          <DigitalLibrary />
          
          {/* Platform Sections */}
          <PlatformSections />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;