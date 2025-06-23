import React from 'react';
import { Calculator, Shield, TrendingUp, Users } from 'lucide-react';

export default function PlatformSections() {
  const platforms = [
    {
      id: 'financial-planning',
      title: 'التخطيط المالي',
      subtitle: 'Financial Planning',
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'financial-control',
      title: 'الرقابة المالية',
      subtitle: 'Financial Control',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'knowledge-center',
      title: 'مركز التواصل والمعرفة المالية',
      subtitle: 'Comm. & Financial Knowledge Center',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'accrual-accounting',
      title: 'الاستحقاق المحاسبي',
      subtitle: 'Accrual Accounting',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="platform-section group"
              >
                <div className={`${platform.bgColor} ${platform.color} p-4 rounded-lg inline-flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-12 w-12" />
                </div>
                <h3 className="platform-title group-hover:text-saudi-green transition-colors">
                  {platform.title}
                </h3>
                <p className="platform-subtitle">
                  {platform.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}