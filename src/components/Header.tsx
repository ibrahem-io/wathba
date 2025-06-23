import React, { useState } from 'react';
import { Search, Globe, User, LogOut, Bell, Menu, ChevronDown, Calendar, Phone, Mail, Star, Grid3X3, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t, dir } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
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
                  src="/images/mof-logo.png"
                  alt="Ministry of Finance Logo"
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%23006341' stroke='%23FFB300' stroke-width='2'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EMOF%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="text-right mr-4">
                <h1 className="ministry-title text-gray-900 leading-tight">
                  وزارة المالية
                </h1>
                <p className="ministry-subtitle text-gray-600">
                  Ministry of Finance
                </p>
              </div>
            </div>

            {/* Center - Main Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#" className="nav-link">
                مركز المعرفة
              </a>
              <a href="#" className="nav-link">
                الخدمات الإلكترونية
              </a>
              <a href="#" className="nav-link">
                المركز الإعلامي
              </a>
              <a href="#" className="nav-link">
                ميزانية الدولة
              </a>
              <a href="#" className="nav-link">
                عن الوزارة
              </a>
            </nav>

            {/* Left Side - Login Button */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex">
                <button className="bg-saudi-green text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-saudi-green-light transition-colors flex items-center">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button className="lg:hidden text-gray-600 hover:text-saudi-green">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}