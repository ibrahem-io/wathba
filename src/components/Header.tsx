import React from 'react';
import { Menu, X, Bell, User, Settings, Search, Globe } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  notifications: number;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, notifications }) => {
  return (
    <header className="nav-modern sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="btn-ghost md:hidden"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center ml-6">
              <img 
                src="/src/assets/cst-logo.svg" 
                alt="CST Logo" 
                className="h-12 w-auto"
              />
              <div className="mr-4">
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  منصة الحلول الذكية
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  لجنة الاتصالات والفضاء والتقنية
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="البحث..."
                className="input-modern pr-10 py-2 w-64 text-sm"
              />
            </div>

            {/* Language Toggle */}
            <button className="btn-ghost flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">العربية</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="btn-ghost relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="btn-ghost">
              <Settings className="h-5 w-5" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">محلل CST</p>
                <p className="text-xs text-emerald-600 font-medium">متصل</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-saudi-primary to-saudi-secondary rounded-xl flex items-center justify-center shadow-soft">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="md:hidden flex items-center gap-2">
            <button className="btn-ghost relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-saudi-primary to-saudi-secondary rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;