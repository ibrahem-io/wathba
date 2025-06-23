import React from 'react';
import { X, Download, Share2, FileText, Volume2, Video, Image } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Document } from '../types';

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  const { t, language } = useLanguage();
  
  const title = language === 'ar' ? document.title : document.titleEn;
  const description = language === 'ar' ? document.description : document.descriptionEn;
  const department = language === 'ar' ? document.department : document.departmentEn;
  const tags = language === 'ar' ? document.tags : document.tagsEn;
  const aiSummary = language === 'ar' ? document.aiSummary : document.aiSummaryEn;

  const renderPreviewContent = () => {
    switch (document.type) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === 'ar' 
                ? 'معاينة المستند - يمكنك تحميل الملف للعرض الكامل'
                : 'Document Preview - Download file for full view'
              }
            </p>
            <div className="bg-white p-6 rounded border text-right" dir="rtl">
              <h3 className="font-bold text-lg mb-4">نموذج من المحتوى:</h3>
              <p className="text-gray-700 leading-relaxed">
                هذا نص تجريبي يمثل محتوى الوثيقة. في الوثيقة الفعلية، ستجد تفاصيل شاملة حول السياسات والإجراءات المتعلقة بالموضوع. 
                يتضمن المحتوى شرحاً مفصلاً للخطوات المطلوبة، والمستندات اللازمة، وآليات المتابعة والتقييم.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">النقاط الرئيسية:</h4>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>تحديد المتطلبات الأساسية</li>
                  <li>إجراءات الموافقة والاعتماد</li>
                  <li>آليات المتابعة والمراجعة</li>
                  <li>المسؤوليات والصلاحيات</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-medium">فيديو تدريبي</p>
                <p className="text-sm opacity-75">مدة العرض: 45 دقيقة</p>
                <button className="mt-4 bg-saudi-green text-white px-6 py-2 rounded-lg hover:bg-saudi-green-light transition-colors">
                  تشغيل الفيديو
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold mb-2">محتوى الفيديو:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• مقدمة عن النظام المالي الحكومي</li>
                <li>• شرح واجهة المستخدم</li>
                <li>• إجراءات التسجيل والدخول</li>
                <li>• إدارة المصروفات والإيرادات</li>
                <li>• إعداد التقارير المالية</li>
              </ul>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="bg-white rounded-lg p-6 text-center mb-4">
              <Volume2 className="h-16 w-16 text-saudi-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">تسجيل صوتي</h3>
              <p className="text-gray-600 mb-4">اجتماع لجنة الميزانية</p>
              
              {/* Audio Player Mockup */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button className="bg-saudi-green text-white p-3 rounded-full hover:bg-saudi-green-light transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>00:00</span>
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div className="bg-saudi-green h-2 rounded-full w-1/4"></div>
                  </div>
                  <span>02:15:30</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold mb-2">نقاط المناقشة:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• مراجعة بنود الميزانية للعام القادم</li>
                <li>• مناقشة التعديلات المقترحة</li>
                <li>• تحديد الأولويات الاستراتيجية</li>
                <li>• آليات المتابعة والتقييم</li>
              </ul>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <img
              src={document.thumbnailUrl}
              alt={title}
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'معاينة غير متاحة لهذا النوع من الملفات'
                : 'Preview not available for this file type'
              }
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-600">{department} • {document.fileSize}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(document.downloadUrl, '_blank')}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('document.download')}
            </button>
            <button className="btn-primary flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              {t('document.share')}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-2">
              {renderPreviewContent()}
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              {/* AI Summary */}
              {aiSummary && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ملخص ذكي
                  </h3>
                  <p className="text-blue-800 text-sm">{aiSummary}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">الوصف</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">العلامات</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">معلومات الملف</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium">{document.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحجم:</span>
                    <span className="font-medium">{document.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الرفع:</span>
                    <span className="font-medium">
                      {new Date(document.uploadDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأولوية:</span>
                    <span className={`font-medium ${
                      document.priority === 'high' ? 'text-red-600' :
                      document.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {document.priority === 'high' ? 'عالية' : 
                       document.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">وثائق ذات صلة</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <div className="font-medium">دليل الإجراءات المحاسبية</div>
                    <div className="text-gray-600">PDF • 5.1 MB</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <div className="font-medium">نموذج طلب اعتماد مصروف</div>
                    <div className="text-gray-600">DOC • 156 KB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}