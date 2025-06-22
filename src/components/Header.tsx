import React from 'react';
import { Menu, X, Bell, User, Settings, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  notifications: number;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, notifications }) => {
  return (
    <header className="nav-government sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="text-cst-gray-600 hover:text-cst-primary focus:outline-none md:hidden p-2 rounded-government"
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
            <div className="flex items-center ml-4">
              <img 
                src="/src/assets/cst-logo.svg" 
                alt="CST Logo" 
                className="h-12 w-auto"
              />
              <div className="mr-4">
                <h1 className="text-xl font-bold text-cst-dark leading-tight">
                  منصة الحلول الذكية
                </h1>
                <p className="text-sm text-cst-gray-600">
                  لجنة الاتصالات والفضاء والتقنية
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cst-gray-400" />
              <input
                type="text"
                placeholder="البحث..."
                className="input-government pr-10 py-2 w-64 text-sm"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-cst-gray-600 hover:text-cst-primary transition-colors rounded-government hover:bg-cst-light">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-status-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 text-cst-gray-600 hover:text-cst-primary transition-colors rounded-government hover:bg-cst-light">
              <Settings className="h-5 w-5" />
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pr-4 border-r border-cst-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-cst-dark">محلل CST</p>
                <p className="text-xs text-cst-gray-600">متصل</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-cst-primary to-cst-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile User Info */}
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2 text-cst-gray-600 hover:text-cst-primary transition-colors rounded-government">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-status-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-cst-primary to-cst-secondary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;