import React, { useState } from 'react';
import { Search, Globe, User, LogOut, Bell, Menu } from 'lucide-react';
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
    <header className="bg-saudi-green shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-white hover:text-saudi-gold mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-saudi-gold rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">م</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">
                  {t('header.title')}
                </h1>
                <p className="text-saudi-gold text-xs">
                  {t('header.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('header.search.placeholder')}
                  className="w-full px-4 py-2 pr-10 rounded-lg border-0 focus:ring-2 focus:ring-saudi-gold text-gray-900"
                  dir={dir}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Search className="h-5 w-5 text-gray-400 hover:text-saudi-green" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="text-white hover:text-saudi-gold transition-colors duration-200 flex items-center"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>

            {/* Notifications */}
            <button className="text-white hover:text-saudi-gold transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center text-white hover:text-saudi-gold transition-colors duration-200"
              >
                <img
                  src={mockUser.avatar}
                  alt={language === 'ar' ? mockUser.name : mockUser.nameEn}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <span className="hidden md:block text-sm font-medium">
                  {language === 'ar' ? mockUser.name : mockUser.nameEn}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
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
                className="w-full px-4 py-2 pr-10 rounded-lg border-0 focus:ring-2 focus:ring-saudi-gold text-gray-900"
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
  );
}