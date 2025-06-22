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
  Zap,
  Wifi
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
      description: 'نظرة عامة شاملة'
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
      description: 'إدارة التراخيص'
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
      description: 'مراقبة الامتثال'
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
      className={`bg-white/90 backdrop-blur-md shadow-medium transition-all duration-300 overflow-hidden flex flex-col border-l border-slate-200/50 ${
        isOpen ? 'w-80' : 'w-0 md:w-20'
      }`}
    >
      {/* Sidebar Content */}
      <div className={`flex-1 ${isOpen ? 'p-6' : 'p-3'}`}>
        {/* Navigation Menu */}
        <nav className={`${isOpen ? 'mt-6' : 'mt-4'}`}>
          <div className="space-items">
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
          <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
              <Activity className="h-4 w-4 ml-2 text-saudi-primary" />
              حالة النظام
            </h4>
            <div className="space-items">
              <StatusItem 
                label="خدمات الذكاء الاصطناعي" 
                status="نشط" 
                color="emerald" 
                icon={<Zap className="h-3 w-3" />}
              />
              <StatusItem 
                label="قاعدة البيانات" 
                status="متصل" 
                color="emerald" 
                icon={<Activity className="h-3 w-3" />}
              />
              <StatusItem 
                label="واجهات API" 
                status="تحديث" 
                color="amber" 
                icon={<Wifi className="h-3 w-3" />}
              />
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">معدل الاستجابة</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-saudi-accent rounded-full ml-2 animate-pulse"></div>
                    <span className="text-xs text-slate-800 font-semibold">99.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Actions - Only show when expanded */}
      {isOpen && (
        <div className="p-6 border-t border-slate-200/50 bg-slate-50/50">
          <div className="space-items">
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

interface StatusItemProps {
  label: string;
  status: string;
  color: 'emerald' | 'amber' | 'rose';
  icon: React.ReactNode;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status, color, icon }) => {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-100',
    amber: 'text-amber-600 bg-amber-100',
    rose: 'text-rose-600 bg-rose-100',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-600">{label}</span>
      <div className="flex items-center">
        <div className={`p-1 rounded-full ${colorClasses[color]} ml-2`}>
          {icon}
        </div>
        <span className={`text-xs font-medium ${color === 'emerald' ? 'text-emerald-700' : color === 'amber' ? 'text-amber-700' : 'text-rose-700'}`}>
          {status}
        </span>
      </div>
    </div>
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
  const baseClasses = "flex items-center w-full p-3 rounded-xl transition-all duration-300 group";
  const activeClasses = isActive 
    ? "bg-gradient-to-r from-saudi-primary to-saudi-secondary text-white shadow-soft" 
    : variant === 'secondary'
    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
    : "text-slate-700 hover:bg-slate-100 hover:text-saudi-primary";

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
                isActive ? 'text-white/80' : 'text-slate-500'
              }`}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      {!isCollapsed && badge && (
        <span className={`badge text-xs font-semibold px-2 py-1 rounded-lg ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-saudi-primary text-white'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;