import React, { useState } from 'react';
import { Search, Globe, User, LogOut, Bell, Menu, ChevronDown } from 'lucide-react';
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
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={toggleLanguage}
                className="text-gray-600 hover:text-saudi-green transition-colors duration-200 flex items-center"
                title={language === 'ar' ? 'English' : 'العربية'}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span className="font-medium">
                  {language === 'ar' ? 'EN' : 'ع'}
                </span>
              </button>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">
                {language === 'ar' ? 'الاثنين 26/12/1446 هـ' : 'Monday 26/12/1446 H'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse text-gray-600">
              <a href="#" className="hover:text-saudi-green transition-colors">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors">
                {language === 'ar' ? 'أوان خاصة' : 'Special Times'}
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors">
                {language === 'ar' ? 'الأوامر الملكية' : 'Royal Orders'}
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-saudi-green transition-colors">
                {language === 'ar' ? 'البيانات المفتوحة' : 'Open Data'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center">
              <button
                onClick={onMenuToggle}
                className="lg:hidden text-gray-600 hover:text-saudi-green mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center">
                <div className="flex items-center mr-6">
                  <img
                    src="https://www.mof.gov.sa/themes/custom/mof/logo.svg"
                    alt="Ministry of Finance Logo"
                    className="h-12 w-auto"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23006341'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3Eم%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="mr-4">
                    <h1 className="text-xl font-bold text-gray-900">
                      {language === 'ar' ? 'وزارة المالية' : 'Ministry of Finance'}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors">
                {language === 'ar' ? 'عن الوزارة' : 'About Ministry'}
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors">
                {language === 'ar' ? 'ميزانية الدولة' : 'State Budget'}
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors">
                {language === 'ar' ? 'المركز الإعلامي' : 'Media Center'}
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors">
                {language === 'ar' ? 'الخدمات الإلكترونية' : 'E-Services'}
              </a>
              <a href="#" className="text-gray-700 hover:text-saudi-green font-medium transition-colors">
                {language === 'ar' ? 'مركز المعرفة' : 'Knowledge Center'}
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Search */}
              <div className="hidden md:flex">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('header.search.placeholder')}
                    className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-saudi-green text-gray-900"
                    dir={dir}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <Search className="h-5 w-5 text-gray-400 hover:text-saudi-green" />
                  </button>
                </form>
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center text-gray-700 hover:text-saudi-green transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-saudi-green rounded-full flex items-center justify-center mr-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {language === 'ar' ? mockUser.name : mockUser.nameEn}
                  </span>
                  <ChevronDown className="h-4 w-4 mr-1" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {language === 'ar' ? mockUser.name : mockUser.nameEn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? mockUser.department : mockUser.departmentEn}
                      </p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {t('header.profile')}
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('header.search.placeholder')}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-saudi-green text-gray-900"
                  dir={dir}
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
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'ar' ? 'منصة معارف' : 'Maaref Platform'}
                </h2>
                <p className="text-saudi-green-light text-sm">
                  {language === 'ar' ? 'منصة المعرفة الشاملة لوزارة المالية' : 'Comprehensive Knowledge Platform for Ministry of Finance'}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
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