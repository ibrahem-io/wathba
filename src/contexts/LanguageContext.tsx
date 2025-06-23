import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  // Header
  'header.title': {
    ar: 'منصة معارف',
    en: 'Maaref Platform'
  },
  'header.subtitle': {
    ar: 'وزارة المالية - المملكة العربية السعودية',
    en: 'Ministry of Finance - Kingdom of Saudi Arabia'
  },
  'header.search.placeholder': {
    ar: 'ابحث في المعارف والوثائق...',
    en: 'Search knowledge and documents...'
  },
  'header.profile': {
    ar: 'الملف الشخصي',
    en: 'Profile'
  },
  'header.logout': {
    ar: 'تسجيل الخروج',
    en: 'Logout'
  },

  // Sidebar
  'sidebar.dashboard': {
    ar: 'لوحة التحكم',
    en: 'Dashboard'
  },
  'sidebar.documents': {
    ar: 'الوثائق',
    en: 'Documents'
  },
  'sidebar.policies': {
    ar: 'السياسات',
    en: 'Policies'
  },
  'sidebar.procedures': {
    ar: 'الإجراءات',
    en: 'Procedures'
  },
  'sidebar.training': {
    ar: 'التدريب',
    en: 'Training'
  },
  'sidebar.forms': {
    ar: 'النماذج',
    en: 'Forms'
  },
  'sidebar.announcements': {
    ar: 'الإعلانات',
    en: 'Announcements'
  },
  'sidebar.multimedia': {
    ar: 'الوسائط المتعددة',
    en: 'Multimedia'
  },

  // Search
  'search.title': {
    ar: 'البحث في المعارف',
    en: 'Knowledge Search'
  },
  'search.filters': {
    ar: 'المرشحات',
    en: 'Filters'
  },
  'search.type': {
    ar: 'نوع الملف',
    en: 'File Type'
  },
  'search.department': {
    ar: 'الإدارة',
    en: 'Department'
  },
  'search.dateRange': {
    ar: 'نطاق التاريخ',
    en: 'Date Range'
  },
  'search.tags': {
    ar: 'العلامات',
    en: 'Tags'
  },
  'search.results': {
    ar: 'النتائج',
    en: 'Results'
  },
  'search.noResults': {
    ar: 'لم يتم العثور على نتائج',
    en: 'No results found'
  },
  'search.showing': {
    ar: 'عرض',
    en: 'Showing'
  },
  'search.of': {
    ar: 'من',
    en: 'of'
  },
  'search.results.count': {
    ar: 'نتيجة',
    en: 'results'
  },

  // Chat
  'chat.title': {
    ar: 'المساعد الذكي',
    en: 'AI Assistant'
  },
  'chat.placeholder': {
    ar: 'اسأل عن السياسات والإجراءات...',
    en: 'Ask about policies and procedures...'
  },
  'chat.send': {
    ar: 'إرسال',
    en: 'Send'
  },
  'chat.typing': {
    ar: 'يكتب...',
    en: 'Typing...'
  },
  'chat.welcome': {
    ar: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    en: 'Hello! How can I help you today?'
  },
  'chat.upload': {
    ar: 'رفع ملف للتحليل',
    en: 'Upload file for analysis'
  },
  'chat.references': {
    ar: 'المراجع',
    en: 'References'
  },

  // Documents
  'document.download': {
    ar: 'تحميل',
    en: 'Download'
  },
  'document.preview': {
    ar: 'معاينة',
    en: 'Preview'
  },
  'document.share': {
    ar: 'مشاركة',
    en: 'Share'
  },
  'document.size': {
    ar: 'الحجم',
    en: 'Size'
  },
  'document.date': {
    ar: 'التاريخ',
    en: 'Date'
  },
  'document.department': {
    ar: 'الإدارة',
    en: 'Department'
  },

  // Common
  'common.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...'
  },
  'common.error': {
    ar: 'حدث خطأ',
    en: 'An error occurred'
  },
  'common.retry': {
    ar: 'إعادة المحاولة',
    en: 'Retry'
  },
  'common.close': {
    ar: 'إغلاق',
    en: 'Close'
  },
  'common.save': {
    ar: 'حفظ',
    en: 'Save'
  },
  'common.cancel': {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  'common.yes': {
    ar: 'نعم',
    en: 'Yes'
  },
  'common.no': {
    ar: 'لا',
    en: 'No'
  },

  // Departments
  'dept.finance': {
    ar: 'المالية',
    en: 'Finance'
  },
  'dept.budget': {
    ar: 'الميزانية',
    en: 'Budget'
  },
  'dept.accounting': {
    ar: 'المحاسبة',
    en: 'Accounting'
  },
  'dept.treasury': {
    ar: 'الخزانة',
    en: 'Treasury'
  },
  'dept.tax': {
    ar: 'الضرائب',
    en: 'Tax'
  },
  'dept.customs': {
    ar: 'الجمارك',
    en: 'Customs'
  },
  'dept.hr': {
    ar: 'الموارد البشرية',
    en: 'Human Resources'
  },
  'dept.it': {
    ar: 'تقنية المعلومات',
    en: 'Information Technology'
  },
  'dept.legal': {
    ar: 'الشؤون القانونية',
    en: 'Legal Affairs'
  },
  'dept.planning': {
    ar: 'التخطيط والتطوير',
    en: 'Planning & Development'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Set document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation ? translation[language] : key;
  };

  const value = {
    language,
    setLanguage,
    t,
    dir: language === 'ar' ? 'rtl' as const : 'ltr' as const
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}