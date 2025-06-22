import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, badge: null },
    { id: 'resolve-ai', label: 'محرك ResolveAI', icon: MessageSquare, badge: '127' },
    { id: 'case-manager', label: 'مساعد إدارة القضايا', icon: FileText, badge: '43' },
    { id: 'network-forecasting', label: 'توقعات الشبكة', icon: TrendingUp, badge: '8' },
    { id: 'compliance-hub', label: 'مركز الامتثال', icon: Shield, badge: '12' },
    { id: 'sentiment-analyzer', label: 'محلل المشاعر العامة', icon: BarChart3, badge: '2.8K' },
  ];

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'w-80' : 'w-0 md:w-20'
      }`}
    >
      {isOpen && (
        <div className="p-4 flex-1">
          <nav className="mt-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={<item.icon className="h-5 w-5" />}
                  text={item.label}
                  badge={item.badge}
                  isActive={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  isCollapsed={!isOpen}
                />
              ))}
            </div>
          </nav>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">حالة النظام</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">خدمات الذكاء الاصطناعي</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">قاعدة البيانات</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">واجهات API</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            text="الإعدادات"
            isActive={false}
            onClick={() => {}}
            isCollapsed={!isOpen}
          />
          <SidebarItem
            icon={<LogOut className="h-5 w-5" />}
            text="تسجيل الخروج"
            isActive={false}
            onClick={() => {}}
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
  badge?: string | null;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  badge,
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
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
    >
      <div className="flex items-center">
        {icon}
        {!isCollapsed && <span className="mr-3 font-medium">{text}</span>}
      </div>
      {!isCollapsed && badge && (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          isActive 
            ? 'bg-white bg-opacity-20 text-white' 
            : 'bg-green-100 text-green-700'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;