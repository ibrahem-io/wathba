import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function NewsSection() {
  const newsItems = [
    {
      id: 1,
      title: 'معالي وزير المالية يرأس وفد المملكة المشارك في الاجتماع (123) للجنة التعاون المالي والاقتصادي لدول مجلس التعاون الخليجي في الكويت',
      date: '15 ربيع الأول 1446',
      image: '/images/news-placeholder.jpg'
    },
    {
      id: 2,
      title: 'لقاء وكيل وزارة المالية للشؤون الدولية بمعالي وزير المالية والميزانية لجمهورية القمر المتحدة',
      date: '12 جمادى الأول 1446',
      image: '/images/news-placeholder.jpg'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'تعلن وزارة المالية لكافة الجهات الحكومية رغبتها التصرف بموجب أجهزة حاسب آلي',
      date: '12 جمادى الأول 1446'
    },
    {
      id: 2,
      title: 'تعلن وزارة المالية لكافة الجهات الحكومية رغبتها التصرف بموجب أثاث متنوع',
      date: '15 ربيع الأول 1446'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* News Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-right">الأخبار</h2>
              <button className="text-saudi-green hover:text-saudi-green-dark flex items-center text-sm font-medium">
                عرض المزيد
                <ArrowLeft className="h-4 w-4 mr-2" />
              </button>
            </div>
            
            <div className="space-y-6">
              {newsItems.map((item) => (
                <div key={item.id} className="news-card cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-image"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='14'%3ENews Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="news-title mb-3 hover:text-saudi-green transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="news-date">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-right">إعلانات الوزارة</h2>
              <button className="text-saudi-green hover:text-saudi-green-dark flex items-center text-sm font-medium">
                عرض المزيد
                <ArrowLeft className="h-4 w-4 mr-2" />
              </button>
            </div>
            
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-saudi-green transition-all duration-200 cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-3 leading-relaxed hover:text-saudi-green transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}