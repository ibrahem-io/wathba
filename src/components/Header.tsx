import React from 'react';
import { Menu, X, Bell, User, Settings, Satellite } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  notifications: number;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, notifications }) => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white hover:text-green-200 focus:outline-none md:hidden"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg ml-3">
                <Satellite className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  منصة الحلول الذكية للجنة الفضاء والاتصالات والتقنية
                </h1>
                <p className="text-xs text-green-100">
                  CSTC AI Solutions Platform - Saudi Space, Telecom & Technology Committee
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button className="p-2 text-white hover:text-green-200 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">محلل CSTC</p>
                <p className="text-xs text-green-100">متصل</p>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;