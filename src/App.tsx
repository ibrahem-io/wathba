import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SearchResults from './components/SearchResults';
import ChatPanel from './components/ChatPanel';
import DocumentPreview from './components/DocumentPreview';
import { Document } from './types';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveSection('search');
    }
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section !== 'search') {
      setSearchQuery('');
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onDocumentSelect={handleDocumentSelect} />;
      case 'search':
        return (
          <SearchResults 
            searchQuery={searchQuery} 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'documents':
        return (
          <SearchResults 
            searchQuery="" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'policies':
        return (
          <SearchResults 
            searchQuery="سياسة policy" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'procedures':
        return (
          <SearchResults 
            searchQuery="إجراء procedure" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'training':
        return (
          <SearchResults 
            searchQuery="تدريب training" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'forms':
        return (
          <SearchResults 
            searchQuery="نموذج form" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'announcements':
        return (
          <SearchResults 
            searchQuery="إعلان announcement" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      case 'multimedia':
        return (
          <SearchResults 
            searchQuery="فيديو صوت video audio" 
            onDocumentSelect={handleDocumentSelect}
          />
        );
      default:
        return <Dashboard onDocumentSelect={handleDocumentSelect} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSearch={handleSearch}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            {renderMainContent()}
          </main>
        </div>

        {/* Chat Panel */}
        <ChatPanel
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          isMinimized={chatMinimized}
          onMinimize={() => setChatMinimized(!chatMinimized)}
          currentDocument={selectedDocument}
        />

        {/* Document Preview Modal */}
        {selectedDocument && (
          <DocumentPreview
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;