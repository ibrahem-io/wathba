import { LayoutDashboard, FileText, MessageCircle, LogOut, Settings, ChevronDown } from 'lucide-react';
import FolderTree from './FolderTree';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isPublicMode?: boolean;
  hasAdminAccess?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  isPublicMode = false,
  hasAdminAccess = false
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  return (
    <aside
      className={`bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'w-80' : 'w-0 md:w-20'
      }`}
    >
      {isOpen && (
        <div className="p-6 flex-1">
          {/* User Profile Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <div className="mr-3">
                <h3 className="font-semibold text-gray-900">مستخدم عام</h3>
                <p className="text-sm text-gray-600">مراجع</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              text="لوحة المراجعة"
              isActive={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              isCollapsed={!isOpen}
            />
            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              text="إدارة المستندات"
              isActive={activeTab === 'documents'}
              onClick={() => setActiveTab('documents')}
              isCollapsed={!isOpen}
            />
            <SidebarItem
              icon={<MessageCircle className="h-5 w-5" />}
              text="المساعد الذكي"
              isActive={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
              isCollapsed={!isOpen}
            />
            {hasAdminAccess && (
              <SidebarItem
                icon={<Settings className="h-5 w-5" />}
                text="إعدادات النظام"
                isActive={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                isCollapsed={!isOpen}
              />
            )}
          </nav>
          
          {activeTab === 'documents' && !isPublicMode && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <span>هيكل المجلدات</span>
                <ChevronDown className="h-4 w-4 mr-2" />
              </h4>
              <FolderTree 
                onSelectFolder={setSelectedFolderId}
                selectedFolderId={selectedFolderId}
              />
            </div>
          )}
        </div>
      )}
      
      {isOpen && !isPublicMode && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <SidebarItem
            icon={<LogOut className="h-5 w-5" />}
            text="تسجيل الخروج"
            isActive={false}
            onClick={onLogout}
            isCollapsed={!isOpen}
          />
        </div>
      )}
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isActive,
  onClick,
  isCollapsed,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-green-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100 hover:text-green-700'
      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
    >
      {icon}
      {!isCollapsed && <span className="mr-3 font-medium">{text}</span>}
    </button>
  );
};

export default Sidebar;