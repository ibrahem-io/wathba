import React, { useState } from 'react';
import { X, Download, Share2, Copy, ZoomIn, ZoomOut, Search, ChevronLeft, ChevronRight, FileText, Quote } from 'lucide-react';
import { DocumentSearchResult } from '../../services/searchService';

interface DocumentViewerProps {
  document: DocumentSearchResult;
  searchQuery: string;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  searchQuery,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showCitations, setShowCitations] = useState(false);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');

  const totalPages = 15; // Mock total pages

  const citationFormats = {
    apa: `${document.author || 'وزارة المالية'}. (${new Date(document.uploadDate).getFullYear()}). ${document.title}. وزارة المالية، المملكة العربية السعودية.`,
    mla: `${document.author || 'وزارة المالية'}. "${document.title}." وزارة المالية، ${new Date(document.uploadDate).getFullYear()}.`,
    chicago: `${document.author || 'وزارة المالية'}. "${document.title}." وزارة المالية، المملكة العربية السعودية، ${new Date(document.uploadDate).getFullYear()}.`
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationFormats[selectedCitationFormat]);
    // Show toast notification
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/documents/${document.id}`;
    navigator.clipboard.writeText(shareUrl);
    // Show toast notification
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-saudi-green" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {highlightText(document.title, searchQuery)}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="uppercase">{document.fileType}</span>
                <span>{formatFileSize(document.fileSize)}</span>
                <span>{formatDate(document.uploadDate)}</span>
                {document.author && <span>{document.author}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCitations(!showCitations)}
              className="p-2 text-gray-600 hover:text-saudi-green rounded-lg hover:bg-gray-100"
              title="الاستشهاد"
            >
              <Quote className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-saudi-green rounded-lg hover:bg-gray-100"
              title="مشاركة"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-saudi-green rounded-lg hover:bg-gray-100"
              title="تحميل"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700">
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border-r border-gray-300 pr-4 mr-4">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-2 text-gray-600 hover:text-saudi-green"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 text-gray-600 hover:text-saudi-green"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search in Document */}
          {searchQuery && (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                البحث عن: "{searchQuery}"
              </span>
              <span className="text-sm text-saudi-green font-medium">
                5 نتائج
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
            <div 
              className="bg-white shadow-lg max-w-full max-h-full overflow-auto"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {/* Mock Document Content */}
              <div className="w-[210mm] min-h-[297mm] p-8 bg-white">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {highlightText(document.title, searchQuery)}
                  </h1>
                  <div className="text-gray-600">
                    <p>وزارة المالية</p>
                    <p>المملكة العربية السعودية</p>
                    <p className="mt-2">{formatDate(document.uploadDate)}</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-800 leading-relaxed">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">المقدمة</h2>
                    <p>
                      {document.excerpt && highlightText(document.excerpt, searchQuery)}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">الأهداف</h2>
                    <p>
                      تهدف هذه الوثيقة إلى توضيح السياسات والإجراءات المتعلقة بـ{' '}
                      {highlightText('الإدارة المالية', searchQuery)} في وزارة المالية.
                      يتضمن هذا المستند التوجيهات اللازمة لضمان الامتثال للمعايير المحاسبية
                      والمالية المعتمدة في المملكة العربية السعودية.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">النطاق</h2>
                    <p>
                      تطبق هذه السياسات على جميع الإدارات والأقسام في وزارة المالية،
                      وتشمل جميع العمليات المالية والمحاسبية التي تتم في إطار عمل الوزارة.
                      كما تغطي هذه الوثيقة الإجراءات المتعلقة بـ{' '}
                      {highlightText('التخطيط المالي', searchQuery)} والرقابة المالية.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">المسؤوليات</h2>
                    <ul className="list-disc list-inside space-y-2">
                      <li>إدارة المالية: مسؤولة عن تطبيق السياسات المالية</li>
                      <li>إدارة المحاسبة: مسؤولة عن إعداد التقارير المالية</li>
                      <li>إدارة المراجعة: مسؤولة عن مراجعة العمليات المالية</li>
                      <li>إدارة الميزانية: مسؤولة عن إعداد ومتابعة الميزانية</li>
                    </ul>
                  </div>

                  {/* Mock highlighted search results */}
                  {searchQuery && (
                    <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2">نتائج البحث في هذه الصفحة:</h3>
                      <p className="text-yellow-700">
                        تم العثور على {highlightText('5 نتائج', searchQuery)} تطابق مصطلح البحث "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Citations Panel */}
          {showCitations && (
            <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الاستشهاد</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تنسيق الاستشهاد
                  </label>
                  <select
                    value={selectedCitationFormat}
                    onChange={(e) => setSelectedCitationFormat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
                  >
                    <option value="apa">APA</option>
                    <option value="mla">MLA</option>
                    <option value="chicago">Chicago</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نص الاستشهاد
                  </label>
                  <div className="bg-gray-50 border border-gray-300 rounded-md p-3 text-sm">
                    {citationFormats[selectedCitationFormat]}
                  </div>
                  <button
                    onClick={handleCopyCitation}
                    className="mt-2 flex items-center gap-2 text-saudi-green hover:text-saudi-green-dark text-sm font-medium"
                  >
                    <Copy className="h-4 w-4" />
                    نسخ الاستشهاد
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المستند</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>العنوان:</strong> {document.title}</div>
                    <div><strong>المؤلف:</strong> {document.author || 'وزارة المالية'}</div>
                    <div><strong>تاريخ النشر:</strong> {formatDate(document.uploadDate)}</div>
                    <div><strong>نوع الملف:</strong> {document.fileType.toUpperCase()}</div>
                    <div><strong>الحجم:</strong> {formatFileSize(document.fileSize)}</div>
                    {document.tags.length > 0 && (
                      <div>
                        <strong>العلامات:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">رابط المشاركة</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/documents/${document.id}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={handleShare}
                      className="p-2 text-saudi-green hover:text-saudi-green-dark"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;