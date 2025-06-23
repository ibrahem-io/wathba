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
  PieChart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockDocuments } from '../data/mockData';

interface DashboardProps {
  onDocumentSelect: (document: any) => void;
}

export default function Dashboard({ onDocumentSelect }: DashboardProps) {
  const { t, language } = useLanguage();

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

  const recentDocuments = mockDocuments.slice(0, 5);
  const popularDocuments = [...mockDocuments].sort(() => Math.random() - 0.5).slice(0, 4);

  const departmentStats = [
    { name: language === 'ar' ? 'الميزانية' : 'Budget', value: 45, color: 'bg-blue-500' },
    { name: language === 'ar' ? 'المحاسبة' : 'Accounting', value: 32, color: 'bg-green-500' },
    { name: language === 'ar' ? 'الخزانة' : 'Treasury', value: 28, color: 'bg-yellow-500' },
    { name: language === 'ar' ? 'الضرائب' : 'Tax', value: 18, color: 'bg-red-500' },
    { name: language === 'ar' ? 'أخرى' : 'Others', value: 12, color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-saudi-green to-saudi-green-light text-white rounded-lg p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'ar' ? 'مرحباً بك في منصة معارف' : 'Welcome to Maaref Platform'}
          </h1>
          <p className="text-lg opacity-90 mb-6">
            {language === 'ar' 
              ? 'منصة المعرفة الشاملة لوزارة المالية - ابحث واستكشف واستفد من المساعد الذكي'
              : 'Comprehensive knowledge platform for Ministry of Finance - Search, explore, and benefit from AI assistance'
            }
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-saudi-green px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {language === 'ar' ? 'استكشف الوثائق' : 'Explore Documents'}
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-saudi-green transition-colors">
              {language === 'ar' ? 'جرب المساعد الذكي' : 'Try AI Assistant'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-saudi-green" />
                {language === 'ar' ? 'الوثائق الحديثة' : 'Recent Documents'}
              </h2>
              <button className="text-saudi-green hover:text-saudi-green-dark text-sm font-medium">
                {language === 'ar' ? 'عرض الكل' : 'View All'}
              </button>
            </div>
            
            <div className="space-y-4">
              {recentDocuments.map((doc) => {
                const title = language === 'ar' ? doc.title : doc.titleEn;
                const department = language === 'ar' ? doc.department : doc.departmentEn;
                
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onDocumentSelect(doc)}
                  >
                    <img
                      src={doc.thumbnailUrl}
                      alt={title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{title}</h3>
                      <p className="text-sm text-gray-600">{department}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{doc.fileSize}</span>
                      <button className="text-saudi-green hover:text-saudi-green-dark">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="space-y-6">
          {/* Popular Documents */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-saudi-gold" />
              {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
            </h2>
            
            <div className="space-y-3">
              {popularDocuments.map((doc, index) => {
                const title = language === 'ar' ? doc.title : doc.titleEn;
                
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => onDocumentSelect(doc)}
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-saudi-gold text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                      <p className="text-xs text-gray-500">{doc.type.toUpperCase()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-saudi-green" />
              {language === 'ar' ? 'توزيع الإدارات' : 'Department Distribution'}
            </h2>
            
            <div className="space-y-3">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                    <span className="text-sm text-gray-700">{dept.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{dept.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'رفع وثيقة جديدة' : 'Upload New Document'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar' ? 'إضافة وثيقة إلى المنصة' : 'Add document to platform'}
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'طلب وثيقة' : 'Request Document'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar' ? 'طلب وثيقة غير متوفرة' : 'Request unavailable document'}
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'تقرير مشكلة' : 'Report Issue'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar' ? 'الإبلاغ عن مشكلة تقنية' : 'Report technical issue'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-saudi-green" />
          {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
        </h2>
        
        <div className="space-y-4">
          {[
            {
              time: '10:30 ص',
              action: language === 'ar' ? 'تم رفع وثيقة جديدة' : 'New document uploaded',
              details: language === 'ar' ? 'سياسة المصروفات الرأسمالية 2024' : 'Capital Expenditure Policy 2024',
              user: language === 'ar' ? 'أحمد العلي' : 'Ahmed Al-Ali'
            },
            {
              time: '09:15 ص',
              action: language === 'ar' ? 'تم تحديث وثيقة' : 'Document updated',
              details: language === 'ar' ? 'دليل إجراءات المحاسبة' : 'Accounting Procedures Manual',
              user: language === 'ar' ? 'فاطمة السالم' : 'Fatima Al-Salem'
            },
            {
              time: '08:45 ص',
              action: language === 'ar' ? 'استفسار جديد للمساعد الذكي' : 'New AI assistant query',
              details: language === 'ar' ? 'حول إجراءات اعتماد الميزانية' : 'About budget approval procedures',
              user: language === 'ar' ? 'محمد الأحمد' : 'Mohammed Al-Ahmad'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
              <div className="flex-shrink-0 w-2 h-2 bg-saudi-green rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}