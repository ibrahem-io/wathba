import React from 'react';
import { Menu, X } from 'lucide-react';
import saudiLogo from '../assets/images (1).png';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-[#0c5997] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none md:hidden"
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
                src={saudiLogo}
                alt="Saudi GCA Logo"
                className="h-10 w-auto ml-3"
              />
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  منصة المراجعة الرقمية (شامل)
                </h1>
                <p className="text-xs text-gray-300">
                  الديوان العام للمحاسبة - Digital Audit Platform (Shamel)
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">أ</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;