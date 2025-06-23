import React from 'react';
import { Building, Users, Briefcase, User } from 'lucide-react';

export default function MainSections() {
  const sections = [
    {
      id: 'individuals',
      title: 'الأفراد',
      icon: User,
      color: 'bg-saudi-green',
      description: 'خدمات الأفراد والمواطنين'
    },
    {
      id: 'business',
      title: 'الأعمال',
      icon: Briefcase,
      color: 'bg-saudi-green',
      description: 'خدمات القطاع الخاص والأعمال'
    },
    {
      id: 'government',
      title: 'الجهات الحكومية',
      icon: Building,
      color: 'bg-saudi-green',
      description: 'خدمات الجهات والمؤسسات الحكومية'
    },
    {
      id: 'most-used',
      title: 'الأكثر استخداماً',
      icon: Users,
      color: 'bg-saudi-green',
      description: 'الخدمات الأكثر طلباً'
    }
  ];

  return (
    <section className="bg-saudi-green py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-opacity-20 transition-all duration-200 cursor-pointer group"
              >
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {section.title}
                </h3>
                <p className="text-white text-opacity-90 text-sm">
                  {section.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}