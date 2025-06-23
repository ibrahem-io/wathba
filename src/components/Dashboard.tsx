import React from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Clock,
  Download,
  Eye,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  PlayCircle,
  Volume2,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDocuments } from '../data/mockData';

interface DashboardProps {
  onDocumentSelect: (document: any) => void;
}

export default function Dashboard({ onDocumentSelect }: DashboardProps) {
  const { t, language } = useLanguage();

  // Digital Library Categories
  const digitalLibraryCategories = [
    {
      id: 'contracts',
      titleAr: 'العقود والمشاريع',
      titleEn: 'Contracts and Projects',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: 245
    },
    {
      id: 'agreements',
      titleAr: 'نماذج الاتفاقيات الإطارية للجهات الحكومية',
      titleEn: 'Framework Agreement Templates for Government Entities',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: 89
    },
    {
      id: 'regulations',
      titleAr: 'الأنظمة والتعليمات',
      titleEn: 'Regulations and Instructions',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: 156
    },
    {
      id: 'budget-data',
      titleAr: 'بيانات الميزانية',
      titleEn: 'Budget Data',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: 78
    },
    {
      id: 'statistics',
      titleAr: 'بيانات إحصائية',
      titleEn: 'Statistical Data',
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      count: 134
    },
    {
      id: 'ministry-forms',
      titleAr: 'نماذج الوزارة',
      titleEn: 'Ministry Forms',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      count: 67
    },
    {
      id: 'ministry-contracts',
      titleAr: 'عقود وزارة المالية',
      titleEn: 'Ministry of Finance Contracts',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: 92
    },
    {
      id: 'procedures',
      titleAr: 'القواعد والإجراءات',
      titleEn: 'Rules and Procedures',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      count: 123
    },
    {
      id: 'open-data',
      titleAr: 'البيانات المفتوحة',
      titleEn: 'Open Data',
      icon: BarChart3,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      count: 201
    }
  ];

  const mediaLibraryCategories = [
    {
      id: 'video-library',
      titleAr: 'مكتبة الفيديو',
      titleEn: 'Video Library',
      icon: PlayCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      count: 45
    },
    {
      id: 'image-library',
      titleAr: 'مكتبة الصور',
      titleEn: 'Image Library',
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: 234
    }
  ];

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي الوثائق' : 'Total Documents',
      value: '2,847',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: language === 'ar' ? 'المشاهدات اليوم' : 'Views Today',
      value: '1,234',
      change: '+8%',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: language === 'ar' ? 'التحميلات' : 'Downloads',
      value: '567',
      change: '+15%',
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: language === 'ar' ? 'المستخدمون النشطون' : 'Active Users',
      value: '89',
      change: '+5%',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentDocuments = mockDocuments.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-saudi-green to-saudi-green-light text-white rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative px-8 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ar' ? 'مرحباً بك في منصة معارف' : 'Welcome to Maaref Platform'}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              {language === 'ar' 
                ? 'منصة المعرفة الشاملة لوزارة المالية - ابحث واستكشف واستفد من المساعد الذكي'
                : 'Comprehensive knowledge platform for Ministry of Finance - Search, explore, and benefit from AI assistance'
              }
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-saudi-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {language === 'ar' ? 'استكشف المكتبة الرقمية' : 'Explore Digital Library'}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-saudi-green transition-colors">
                {language === 'ar' ? 'جرب المساعد الذكي' : 'Try AI Assistant'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Digital Library */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'المكتبة الرقمية' : 'Digital Library'}
              </h2>
              <button className="text-saudi-green hover:text-saudi-green-dark text-sm font-medium">
                {language === 'ar' ? 'عرض الكل' : 'View All'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {digitalLibraryCategories.map((category) => {
                const Icon = category.icon;
                const title = language === 'ar' ? category.titleAr : category.titleEn;
                
                return (
                  <div
                    key={category.id}
                    className="group cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200 border border-gray-200 hover:border-saudi-green hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${category.bgColor} ${category.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs bg-saudi-green text-white px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-saudi-green transition-colors">
                      {title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Media Library */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'مكتبة الوسائط' : 'Media Library'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaLibraryCategories.map((category) => {
                const Icon = category.icon;
                const title = language === 'ar' ? category.titleAr : category.titleEn;
                
                return (
                  <div
                    key={category.id}
                    className="group cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-all duration-200 border border-gray-200 hover:border-saudi-green hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${category.bgColor} ${category.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm bg-saudi-green text-white px-3 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-saudi-green transition-colors">
                      {title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-saudi-green" />
              {language === 'ar' ? 'الوثائق الحديثة' : 'Recent Documents'}
            </h3>
            
            <div className="space-y-3">
              {recentDocuments.map((doc) => {
                const title = language === 'ar' ? doc.title : doc.titleEn;
                const department = language === 'ar' ? doc.department : doc.departmentEn;
                
                return (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onDocumentSelect(doc)}
                  >
                    <img
                      src={doc.thumbnailUrl}
                      alt={title}
                      className="w-10 h-10 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                        {title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{department}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <div className="font-medium text-gray-900 text-sm">
                  {language === 'ar' ? 'البحث المتقدم' : 'Advanced Search'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {language === 'ar' ? 'بحث تفصيلي في الوثائق' : 'Detailed document search'}
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <div className="font-medium text-gray-900 text-sm">
                  {language === 'ar' ? 'طلب وثيقة' : 'Request Document'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {language === 'ar' ? 'طلب وثيقة غير متوفرة' : 'Request unavailable document'}
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                <div className="font-medium text-gray-900 text-sm">
                  {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {language === 'ar' ? 'احصل على مساعدة فورية' : 'Get instant assistance'}
                </div>
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'العلامات الشائعة' : 'Popular Tags'}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {[
                { ar: 'ميزانية', en: 'Budget' },
                { ar: 'سياسات', en: 'Policies' },
                { ar: 'إجراءات', en: 'Procedures' },
                { ar: 'تقارير', en: 'Reports' },
                { ar: 'نماذج', en: 'Forms' },
                { ar: 'قوانين', en: 'Laws' }
              ].map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-saudi-green hover:text-white cursor-pointer transition-colors"
                >
                  {language === 'ar' ? tag.ar : tag.en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}