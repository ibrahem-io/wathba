import React from 'react';
import { Menu, X, Search, Globe, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center space-x-6 space-x-reverse">
              <span className="text-gray-600">الخميس، ١ محرم ١٤٤٧ هـ - ٦ يوليو ٢٠٢٥ م</span>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 ml-1" />
                <span className="text-gray-600">مستخدم عام</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <Globe className="h-4 w-4 ml-1" />
                <span>English</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <Search className="h-4 w-4 ml-1" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800 focus:outline-none md:hidden ml-4"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center">
                <img
                  src="/src/assets/images/gca-logo copy.svg"
                  alt="الديوان العام للمحاسبة"
                  className="h-16 w-auto ml-4"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">
                    منصة المراجعة الرقمية (شامل)
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    الديوان العام للمحاسبة - Digital Audit Platform (Shamel)
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                عن الديوان
              </a>
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                التواصل مع الديوان
              </a>
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                المركز الإعلامي
              </a>
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                العلاقات الدولية
              </a>
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                الخدمات الإلكترونية
              </a>
              <a href="#" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                الأنظمة واللوائح
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;