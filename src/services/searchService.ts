export interface DocumentSearchResult {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  lastModified?: string;
  author?: string;
  tags: string[];
  category: string;
  relevanceScore?: number;
  viewCount?: number;
  downloadCount?: number;
  url?: string;
}

export interface SearchFilters {
  dateRange: {
    start: string;
    end: string;
  };
  fileTypes: string[];
  fileSizeRange: {
    min: number;
    max: number;
  };
  tags: string[];
  authors: string[];
}

// Mock data for demonstration
const mockDocuments: DocumentSearchResult[] = [
  {
    id: '1',
    title: 'سياسة المصروفات الرأسمالية للعام المالي 2024',
    description: 'دليل شامل للسياسات والإجراءات المتعلقة بالمصروفات الرأسمالية وآليات الاعتماد والمتابعة',
    excerpt: 'تحدد هذه السياسة الإجراءات المطلوبة لاعتماد المصروفات الرأسمالية، بما في ذلك حدود الصلاحيات ومتطلبات التوثيق والمراجعة. تشمل السياسة تعريفات واضحة للمصروفات الرأسمالية، وإجراءات التخطيط والموافقة، ومعايير التقييم والمتابعة.',
    fileType: 'pdf',
    fileSize: 2500000,
    uploadDate: '2024-01-15',
    lastModified: '2024-01-20',
    author: 'إدارة الميزانية',
    tags: ['سياسة', 'مصروفات رأسمالية', 'ميزانية', '2024', 'إجراءات'],
    category: 'السياسات المالية',
    relevanceScore: 95,
    viewCount: 234,
    downloadCount: 45
  },
  {
    id: '2',
    title: 'دليل إجراءات المحاسبة الحكومية',
    description: 'دليل تفصيلي لجميع الإجراءات المحاسبية المطبقة في الوزارة وفقاً للمعايير الدولية',
    excerpt: 'يغطي الدليل جميع العمليات المحاسبية من القيد إلى إعداد التقارير المالية، مع التركيز على الامتثال للمعايير الدولية. يتضمن أمثلة عملية وحالات دراسية لتطبيق الإجراءات المحاسبية في البيئة الحكومية.',
    fileType: 'pdf',
    fileSize: 5100000,
    uploadDate: '2024-01-10',
    lastModified: '2024-01-18',
    author: 'إدارة المحاسبة',
    tags: ['محاسبة', 'إجراءات', 'معايير دولية', 'دليل', 'تقارير مالية'],
    category: 'الأدلة والإجراءات',
    relevanceScore: 88,
    viewCount: 189,
    downloadCount: 67
  },
  {
    id: '3',
    title: 'تقرير الأداء المالي الربعي Q4 2023',
    description: 'تقرير شامل عن الأداء المالي للربع الأخير من عام 2023',
    excerpt: 'يعرض التقرير المؤشرات المالية الرئيسية والمقارنات مع الفترات السابقة والأهداف المحددة. يتضمن تحليلاً مفصلاً للإيرادات والمصروفات، ومؤشرات الأداء المالي، والتوصيات للتحسين.',
    fileType: 'xlsx',
    fileSize: 3200000,
    uploadDate: '2024-01-01',
    lastModified: '2024-01-05',
    author: 'إدارة المحاسبة',
    tags: ['تقرير', 'أداء مالي', 'ربعي', '2023', 'مؤشرات'],
    category: 'التقارير المالية',
    relevanceScore: 92,
    viewCount: 156,
    downloadCount: 89
  },
  {
    id: '4',
    title: 'نموذج طلب اعتماد مصروف',
    description: 'النموذج الرسمي لطلب اعتماد المصروفات بجميع أنواعها',
    excerpt: 'نموذج موحد لطلب اعتماد المصروفات يتضمن جميع البيانات المطلوبة والتوقيعات اللازمة. يشمل النموذج تصنيفات المصروفات المختلفة ومستويات الاعتماد المطلوبة.',
    fileType: 'docx',
    fileSize: 156000,
    uploadDate: '2024-01-08',
    author: 'إدارة المالية',
    tags: ['نموذج', 'اعتماد', 'مصروف', 'طلب', 'إجراءات'],
    category: 'النماذج والاستمارات',
    relevanceScore: 75,
    viewCount: 298,
    downloadCount: 156
  },
  {
    id: '5',
    title: 'عرض تقديمي - استراتيجية التحول الرقمي',
    description: 'عرض تقديمي شامل عن استراتيجية التحول الرقمي في وزارة المالية',
    excerpt: 'يستعرض العرض خطة التحول الرقمي على مدى 5 سنوات مع التركيز على الأتمتة والذكاء الاصطناعي. يتضمن الأهداف الاستراتيجية، والمبادرات الرئيسية، والجدول الزمني للتنفيذ.',
    fileType: 'pptx',
    fileSize: 12800000,
    uploadDate: '2023-12-28',
    lastModified: '2024-01-03',
    author: 'إدارة التخطيط والتطوير',
    tags: ['عرض تقديمي', 'تحول رقمي', 'استراتيجية', 'تطوير', 'تقنية'],
    category: 'العروض التقديمية',
    relevanceScore: 82,
    viewCount: 145,
    downloadCount: 34
  },
  {
    id: '6',
    title: 'لائحة الحوكمة المؤسسية المحدثة',
    description: 'اللائحة المحدثة للحوكمة المؤسسية وآليات الرقابة الداخلية',
    excerpt: 'تحدد هذه اللائحة إطار الحوكمة المؤسسية في وزارة المالية، بما في ذلك هياكل الإدارة، وآليات الرقابة الداخلية، ومعايير الشفافية والمساءلة. تتضمن اللائحة التحديثات الأخيرة وفقاً لأفضل الممارسات الدولية.',
    fileType: 'pdf',
    fileSize: 1800000,
    uploadDate: '2023-12-20',
    lastModified: '2024-01-12',
    author: 'إدارة المراجعة الداخلية',
    tags: ['حوكمة', 'لائحة', 'رقابة داخلية', 'شفافية', 'مساءلة'],
    category: 'اللوائح والقوانين',
    relevanceScore: 87,
    viewCount: 178,
    downloadCount: 56
  },
  {
    id: '7',
    title: 'دليل المستخدم لنظام إدارة المالية الحكومية',
    description: 'دليل شامل لاستخدام نظام إدارة المالية الحكومية الجديد',
    excerpt: 'يوضح الدليل كيفية استخدام جميع وظائف نظام إدارة المالية الحكومية، من إدخال البيانات إلى إنتاج التقارير. يتضمن لقطات شاشة وأمثلة عملية لتسهيل عملية التعلم.',
    fileType: 'pdf',
    fileSize: 8900000,
    uploadDate: '2023-12-15',
    author: 'إدارة تقنية المعلومات',
    tags: ['دليل مستخدم', 'نظام مالي', 'تدريب', 'تقنية', 'إرشادات'],
    category: 'الأدلة التقنية',
    relevanceScore: 79,
    viewCount: 267,
    downloadCount: 123
  },
  {
    id: '8',
    title: 'تقرير مراجعة الامتثال السنوي 2023',
    description: 'تقرير شامل عن حالة الامتثال للوائح والسياسات المالية',
    excerpt: 'يستعرض التقرير نتائج مراجعة الامتثال للعام 2023، ويتضمن تقييماً شاملاً لمدى التزام الإدارات المختلفة بالسياسات واللوائح المالية. يقدم التقرير توصيات للتحسين ومعالجة أوجه القصور.',
    fileType: 'pdf',
    fileSize: 4200000,
    uploadDate: '2023-12-10',
    author: 'إدارة المراجعة الداخلية',
    tags: ['مراجعة', 'امتثال', 'تقرير سنوي', '2023', 'توصيات'],
    category: 'تقارير المراجعة',
    relevanceScore: 91,
    viewCount: 134,
    downloadCount: 78
  },
  {
    id: '9',
    title: 'خطة الطوارئ المالية',
    description: 'خطة شاملة للتعامل مع الأزمات المالية والطوارئ',
    excerpt: 'تحدد الخطة الإجراءات الواجب اتباعها في حالات الطوارئ المالية، بما في ذلك آليات اتخاذ القرار السريع، وإعادة تخصيص الموارد، والتواصل مع الجهات ذات العلاقة.',
    fileType: 'docx',
    fileSize: 890000,
    uploadDate: '2023-11-25',
    lastModified: '2023-12-05',
    author: 'إدارة التخطيط المالي',
    tags: ['طوارئ', 'خطة', 'أزمات مالية', 'إجراءات', 'استجابة'],
    category: 'خطط الطوارئ',
    relevanceScore: 73,
    viewCount: 89,
    downloadCount: 23
  },
  {
    id: '10',
    title: 'معايير المحاسبة الحكومية السعودية',
    description: 'دليل شامل لمعايير المحاسبة الحكومية المطبقة في المملكة',
    excerpt: 'يتضمن الدليل جميع معايير المحاسبة الحكومية السعودية مع شرح تفصيلي لكل معيار وأمثلة تطبيقية. يغطي الدليل المعايير المحدثة والتغييرات الأخيرة في النظام المحاسبي الحكومي.',
    fileType: 'pdf',
    fileSize: 15600000,
    uploadDate: '2023-11-20',
    author: 'إدارة المحاسبة',
    tags: ['معايير محاسبية', 'حكومية', 'سعودية', 'دليل', 'تطبيق'],
    category: 'المعايير والمواصفات',
    relevanceScore: 94,
    viewCount: 312,
    downloadCount: 189
  }
];

export async function searchDocuments(
  query: string,
  filters: SearchFilters,
  sortBy: string = 'relevance',
  sortOrder: string = 'desc',
  tab: string = 'all'
): Promise<DocumentSearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let results = [...mockDocuments];

  // Apply text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ');
    results = results.map(doc => {
      let score = 0;
      const searchableText = `${doc.title} ${doc.description} ${doc.excerpt} ${doc.tags.join(' ')}`.toLowerCase();
      
      // Calculate relevance score
      searchTerms.forEach(term => {
        const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const descMatches = (doc.description?.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const excerptMatches = (doc.excerpt?.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const tagMatches = doc.tags.filter(tag => tag.toLowerCase().includes(term)).length;
        
        score += titleMatches * 10 + descMatches * 5 + excerptMatches * 3 + tagMatches * 7;
      });
      
      return { ...doc, relevanceScore: Math.min(100, score * 2) };
    }).filter(doc => doc.relevanceScore && doc.relevanceScore > 0);
  }

  // Apply filters
  if (filters.dateRange.start) {
    results = results.filter(doc => new Date(doc.uploadDate) >= new Date(filters.dateRange.start));
  }
  
  if (filters.dateRange.end) {
    results = results.filter(doc => new Date(doc.uploadDate) <= new Date(filters.dateRange.end));
  }
  
  if (filters.fileTypes.length > 0) {
    results = results.filter(doc => filters.fileTypes.includes(doc.fileType));
  }
  
  if (filters.fileSizeRange.min > 0) {
    results = results.filter(doc => doc.fileSize >= filters.fileSizeRange.min * 1024 * 1024);
  }
  
  if (filters.fileSizeRange.max < 100) {
    results = results.filter(doc => doc.fileSize <= filters.fileSizeRange.max * 1024 * 1024);
  }
  
  if (filters.tags.length > 0) {
    results = results.filter(doc => 
      filters.tags.some(tag => doc.tags.some(docTag => docTag.includes(tag)))
    );
  }
  
  if (filters.authors.length > 0) {
    results = results.filter(doc => 
      filters.authors.some(author => doc.author?.includes(author))
    );
  }

  // Apply tab filtering
  if (tab !== 'all') {
    switch (tab) {
      case 'documents':
        results = results.filter(doc => ['pdf', 'doc', 'docx', 'txt'].includes(doc.fileType));
        break;
      case 'reports':
        results = results.filter(doc => 
          doc.tags.some(tag => tag.toLowerCase().includes('تقرير') || tag.toLowerCase().includes('report'))
        );
        break;
      case 'presentations':
        results = results.filter(doc => ['ppt', 'pptx'].includes(doc.fileType));
        break;
    }
  }

  // Apply sorting
  results.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'relevance':
        comparison = (b.relevanceScore || 0) - (a.relevanceScore || 0);
        break;
      case 'date':
        comparison = new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title, 'ar');
        break;
      case 'size':
        comparison = b.fileSize - a.fileSize;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  return results;
}

export async function getDocuments(): Promise<DocumentSearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockDocuments;
}

export async function getDocumentById(id: string): Promise<DocumentSearchResult | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDocuments.find(doc => doc.id === id) || null;
}