import React from 'react';
import { FileText, BarChart3, FileSpreadsheet, Image, Video } from 'lucide-react';

export default function DigitalLibrary() {
  const libraryCategories = [
    {
      id: 'contracts',
      title: 'العقود والمشاريع',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'agreements',
      title: 'نماذج الاتفاقيات الإطارية للجهات الحكومية',
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'regulations',
      title: 'الأنظمة والتعليمات',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'budget-data',
      title: 'بيانات الميزانية',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'statistics',
      title: 'بيانات إحصائية',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'ministry-forms',
      title: 'نماذج الوزارة',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'ministry-contracts',
      title: 'عقود وزارة المالية',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'procedures',
      title: 'القواعد والإجراءات',
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'open-data',
      title: 'البيانات المفتوحة',
      icon: BarChart3,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const mediaCategories = [
    {
      id: 'image-library',
      title: 'مكتبة الصور',
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'video-library',
      title: 'مكتبة الفيديو',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Digital Library */}
        <div className="mb-16">
          <h2 className="section-title">المكتبة الرقمية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="category-grid-item group"
                >
                  <div className={`${category.bgColor} ${category.color} p-4 rounded-lg inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="category-title group-hover:text-saudi-green transition-colors">
                    {category.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Media Library */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="category-grid-item group"
                >
                  <div className={`${category.bgColor} ${category.color} p-6 rounded-lg inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-saudi-green transition-colors">
                    {category.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}