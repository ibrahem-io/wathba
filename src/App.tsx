import { useState, useEffect } from 'react';
import { FileIcon, LayoutDashboard, FileText, LogOut, Menu, X, Settings } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';
import AuditDashboard from './components/AuditDashboard';
import ApiConfiguration from './components/ApiConfiguration';
import Auth from './pages/Auth';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';

const AppContent = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { user, signOut, isPublicMode, publicUser } = useAuth();

  // Use public user if in public mode, otherwise use authenticated user
  const currentUser = isPublicMode ? publicUser : user;

  useEffect(() => {
    // Load documents from localStorage if available
    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  useEffect(() => {
    // Save documents to localStorage when updated
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleFileUpload = (files: File[]) => {
    const newDocuments = files.map(file => {
      // Generate random labels
      const possibleLabels = ['مالي', 'قانوني', 'تشغيلي', 'ضريبي', 'أداء', 'امتثال', 'مخاطر', 'حوكمة'];
      const numLabels = Math.floor(Math.random() * 3) + 1;
      const labels = [];
      
      for (let i = 0; i < numLabels; i++) {
        const randomIndex = Math.floor(Math.random() * possibleLabels.length);
        const label = possibleLabels[randomIndex];
        if (!labels.includes(label)) {
          labels.push(label);
        }
      }

      return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        uploadDate: new Date().toISOString(),
        labels: labels,
      };
    });

    setDocuments([...documents, ...newDocuments]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if user has admin role for configuration access
  const hasAdminAccess = () => {
    if (isPublicMode) return true; // Allow access in public mode for demo
    return currentUser?.user_metadata?.role === 'admin' || currentUser?.role === 'admin';
  };

  // In public mode, always show the app. Otherwise, check for authenticated user
  if (!isPublicMode && !user) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={isPublicMode ? () => {} : signOut}
          isPublicMode={isPublicMode}
          hasAdminAccess={hasAdminAccess()}
        />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 p-4 md:p-6`}>
          {activeTab === 'dashboard' && (
            <>
              <AuditDashboard />
              {isPublicMode && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    🔓 تعمل المنصة حالياً في الوضع العام - جميع البيانات محفوظة محلياً
                  </p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'documents' && (
            <>
              <DocumentUpload onFileUpload={handleFileUpload} />
              <DocumentList 
                documents={documents} 
                selectedFolderId={selectedFolderId}
              />
            </>
          )}

          {activeTab === 'chat' && (
            <ChatInterface selectedFolderId={selectedFolderId} />
          )}

          {activeTab === 'settings' && hasAdminAccess() && (
            <ApiConfiguration />
          )}

          {activeTab === 'settings' && !hasAdminAccess() && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">غير مصرح</h3>
                <p className="text-gray-500">تحتاج إلى صلاحيات المدير للوصول إلى الإعدادات</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;