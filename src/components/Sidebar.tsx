import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Settings,
  GraduationCap,
  FileCheck,
  Megaphone,
  PlayCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, key: 'sidebar.dashboard' },
  { id: 'documents', icon: FileText, key: 'sidebar.documents' },
  { id: 'policies', icon: Shield, key: 'sidebar.policies' },
  { id: 'procedures', icon: Settings, key: 'sidebar.procedures' },
  { id: 'training', icon: GraduationCap, key: 'sidebar.training' },
  { id: 'forms', icon: FileCheck, key: 'sidebar.forms' },
  { id: 'announcements', icon: Megaphone, key: 'sidebar.announcements' },
  { id: 'multimedia', icon: PlayCircle, key: 'sidebar.multimedia' }
];

export default function Sidebar({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const { t, dir } = useLanguage();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">القائمة</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose(); // Close sidebar on mobile after selection
                  }}
                  className={`sidebar-item w-full ${
                    isActive
                      ? 'bg-saudi-green text-white'
                      : 'text-gray-700 hover:bg-saudi-green hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 ml-3" />
                  <span className="font-medium">{t(item.key)}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>منصة معارف v2.0</p>
              <p>وزارة المالية - 2024</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}