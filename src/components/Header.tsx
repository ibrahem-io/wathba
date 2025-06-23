import React, { useState } from 'react';
import { Search, Globe, User, LogOut, Bell, Menu, ChevronDown, Calendar, Phone, Mail, Star, Grid3X3, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockUser } from '../data/mockData';

interface HeaderProps {
  onMenuToggle: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ onMenuToggle, onSearch }: HeaderProps) {
  const { language, setLanguage, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            {/* Right Side - Search and Language */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-saudi-green transition-colors">
                <Search className="h-4 w-4" />
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={toggleLanguage}
                className="text-gray-600 hover:text-saudi-green transition-colors font-medium"
              >
                {language === 'ar' ? 'EN' : 'ع'}
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                الاثنين 26/12/1446 هـ
              </span>
            </div>
            
            {/* Left Side - Government Links */}
            <div className="flex items-center gap-4 text-gray-600 text-xs">
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                تواصل معنا
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors">
                أوقات خاصة
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors">
                الأوامر الملكية
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <Grid3X3 className="h-3 w-3 mr-1" />
                البيانات المفتوحة
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                ع
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <Star className="h-3 w-3 mr-1" />
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <Mail className="h-3 w-3 mr-1" />
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors flex items-center">
                <Grid3X3 className="h-3 w-3 mr-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Right Side - Logo and Title */}
            <div className="flex items-center">
              <div className="flex items-center">
                <img
                  src="/src/assets/images/image.png"
                  alt="Ministry of Finance Logo"
                  className="h-16 w-auto"
                  onError={(e) => {
                    // Fallback to a simple SVG if the image fails to load
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%23006341' stroke='%23FFB300' stroke-width='2'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EMOF%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="text-right mr-4">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  وزارة المالية
                </h1>
                <p className="text-xs text-gray-600">
                  Ministry of Finance
                </p>
              </div>
            </div>

            {/* Center - Main Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors text-sm">
                مركز المعرفة
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors text-sm">
                الخدمات الإلكترونية
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors text-sm">
                المركز الإعلامي
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors text-sm">
                ميزانية الدولة
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors text-sm">
                عن الوزارة
              </a>
            </nav>

            {/* Left Side - Mobile Menu and Login Button */}
            <div className="flex items-center gap-4">
              {/* Login Button */}
              <div className="hidden lg:flex">
                <button className="bg-saudi-green text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-saudi-green-light transition-colors flex items-center">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden text-gray-600 hover:text-saudi-green"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المعارف والوثائق..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-saudi-green text-gray-900"
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Knowledge Platform Header */}
      <div className="bg-saudi-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h2 className="text-2xl font-bold">
                  منصة معارف
                </h2>
                <p className="text-saudi-green-light text-sm">
                  منصة المعرفة الشاملة لوزارة المالية
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-sm font-medium">
                    مدعوم بالذكاء الاصطناعي
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}