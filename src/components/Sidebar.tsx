import { LayoutDashboard, FileText, MessageCircle, LogOut, Settings } from 'lucide-react';
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
      className={`bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'w-64' : 'w-0 md:w-20'
      }`}
    >
      {isOpen && (
        <div className="p-4 flex-1">
          <nav className="mt-6">
            <div className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard className="h-5 w-5" />}
                text="لوحة المراجعة"
                isActive={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                isCollapsed={!isOpen}
              />
              <SidebarItem
                icon={<FileText className="h-5 w-5" />}
                text="المستندات"
                isActive={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                isCollapsed={!isOpen}
              />
              <SidebarItem
                icon={<MessageCircle className="h-5 w-5" />}
                text="المحادثات"
                isActive={activeTab === 'chat'}
                onClick={() => setActiveTab('chat')}
                isCollapsed={!isOpen}
              />
              {hasAdminAccess && (
                <SidebarItem
                  icon={<Settings className="h-5 w-5" />}
                  text="الإعدادات"
                  isActive={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                  isCollapsed={!isOpen}
                />
              )}
            </div>
          </nav>
          
          {activeTab === 'documents' && !isPublicMode && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <FolderTree 
                onSelectFolder={setSelectedFolderId}
                selectedFolderId={selectedFolderId}
              />
            </div>
          )}
        </div>
      )}
      {isOpen && !isPublicMode && (
        <div className="p-4 border-t border-gray-200">
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
      className={`flex items-center w-full p-3 rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-[#0c5997] text-white'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
    >
      {icon}
      {!isCollapsed && <span className="mr-3">{text}</span>}
    </button>
  );
};

export default Sidebar;