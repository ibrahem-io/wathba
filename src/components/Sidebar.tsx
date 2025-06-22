import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Settings,
  LogOut,
  Activity,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSection, setActiveSection }) => {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'لوحة التحكم', 
      icon: LayoutDashboard, 
      badge: null,
      description: 'نظرة عامة على النظام'
    },
    { 
      id: 'resolve-ai', 
      label: 'محرك ResolveAI', 
      icon: MessageSquare, 
      badge: '127',
      description: 'معالجة الشكاوى الذكية'
    },
    { 
      id: 'case-manager', 
      label: 'مساعد إدارة القضايا', 
      icon: FileText, 
      badge: '43',
      description: 'إدارة التراخيص والقضايا'
    },
    { 
      id: 'network-forecasting', 
      label: 'توقعات الشبكة', 
      icon: TrendingUp, 
      badge: '8',
      description: 'تحليل الطلب والسعة'
    },
    { 
      id: 'compliance-hub', 
      label: 'مركز الامتثال', 
      icon: Shield, 
      badge: '12',
      description: 'مراقبة الامتثال التنظيمي'
    },
    { 
      id: 'sentiment-analyzer', 
      label: 'محلل المشاعر العامة', 
      icon: BarChart3, 
      badge: '2.8K',
      description: 'تحليل الرأي العام'
    },
  ];

  return (
    <aside
      className={`bg-white shadow-government-lg transition-all duration-300 overflow-hidden flex flex-col border-l border-cst-gray-200 ${
        isOpen ? 'w-80' : 'w-0 md:w-20'
      }`}
    >
      {/* Sidebar Content */}
      <div className={`flex-1 ${isOpen ? 'p-6' : 'p-2'}`}>
        {/* Navigation Menu */}
        <nav className={`${isOpen ? 'mt-6' : 'mt-4'}`}>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={<item.icon className="h-5 w-5" />}
                text={item.label}
                description={item.description}
                badge={item.badge}
                isActive={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                isCollapsed={!isOpen}
              />
            ))}
          </div>
        </nav>
        
        {/* System Status - Only show when expanded */}
        {isOpen && (
          <div className="mt-8 p-4 bg-cst-light rounded-government-lg border border-cst-primary/20">
            <h4 className="text-sm font-semibold text-cst-dark mb-3 flex items-center">
              <Activity className="h-4 w-4 ml-2" />
              حالة النظام
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cst-gray-700">خدمات الذكاء الاصطناعي</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-status-success rounded-full ml-2"></div>
                  <span className="text-xs text-status-success font-medium">نشط</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cst-gray-700">قاعدة البيانات</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-status-success rounded-full ml-2"></div>
                  <span className="text-xs text-status-success font-medium">متصل</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cst-gray-700">واجهات API</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-status-warning rounded-full ml-2"></div>
                  <span className="text-xs text-status-warning font-medium">تحديث</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-cst-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cst-gray-700">معدل الاستجابة</span>
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 text-cst-accent ml-1" />
                    <span className="text-xs text-cst-dark font-semibold">99.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Actions - Only show when expanded */}
      {isOpen && (
        <div className="p-6 border-t border-cst-gray-200 bg-cst-gray-50">
          <div className="space-y-2">
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              text="الإعدادات"
              description="إعدادات النظام"
              isActive={false}
              onClick={() => {}}
              isCollapsed={false}
              variant="secondary"
            />
            <SidebarItem
              icon={<LogOut className="h-5 w-5" />}
              text="تسجيل الخروج"
              description="إنهاء الجلسة"
              isActive={false}
              onClick={() => {}}
              isCollapsed={false}
              variant="secondary"
            />
          </div>
        </div>
      )}
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  description?: string;
  badge?: string | null;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  variant?: 'primary' | 'secondary';
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  description,
  badge,
  isActive,
  onClick,
  isCollapsed,
  variant = 'primary',
}) => {
  const baseClasses = "flex items-center w-full p-3 rounded-government transition-all duration-200 group";
  const activeClasses = isActive 
    ? "bg-gradient-to-r from-cst-primary to-cst-secondary text-white shadow-government" 
    : variant === 'secondary'
    ? "text-cst-gray-600 hover:bg-cst-gray-100 hover:text-cst-dark"
    : "text-cst-gray-700 hover:bg-cst-light hover:text-cst-primary";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      title={isCollapsed ? text : undefined}
    >
      <div className="flex items-center">
        <div className={`${isActive ? 'text-white' : ''} transition-colors`}>
          {icon}
        </div>
        {!isCollapsed && (
          <div className="mr-3 text-right">
            <span className="font-medium text-sm block">{text}</span>
            {description && (
              <span className={`text-xs block ${
                isActive ? 'text-white/80' : 'text-cst-gray-500'
              }`}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      {!isCollapsed && badge && (
        <span className={`badge-government text-xs font-semibold ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-cst-primary text-white'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;