import { useState, useEffect } from 'react';
import { Satellite, Menu, X, Bell, User, Settings, LogOut } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ResolveAI from './components/solutions/ResolveAI';
import CaseManager from './components/solutions/CaseManager';
import NetworkForecasting from './components/solutions/NetworkForecasting';
import ComplianceHub from './components/solutions/ComplianceHub';
import SentimentAnalyzer from './components/solutions/SentimentAnalyzer';
import { CSLCProvider } from './contexts/CSLCContext';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState(12);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'resolve-ai':
        return <ResolveAI />;
      case 'case-manager':
        return <CaseManager />;
      case 'network-forecasting':
        return <NetworkForecasting />;
      case 'compliance-hub':
        return <ComplianceHub />;
      case 'sentiment-analyzer':
        return <SentimentAnalyzer />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <CSLCProvider>
      <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          notifications={notifications}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            isOpen={isSidebarOpen} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </CSLCProvider>
  );
};

export default App;