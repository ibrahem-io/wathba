import { useState } from 'react';
import { ArrowLeft, Sparkles, FileText, MessageCircle, Settings } from 'lucide-react';
import RAGDocumentUpload from '../components/RAGDocumentUpload';
import RAGChatInterface from '../components/RAGChatInterface';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  fileId?: string;
  error?: string;
}

const RAGDemo = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [assistantReady, setAssistantReady] = useState(false);
  const [assistantId, setAssistantId] = useState<string>('');
  const [vectorStoreId, setVectorStoreId] = useState<string>('');

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleAssistantReady = (assistantId: string, vectorStoreId: string) => {
    setAssistantReady(true);
    setAssistantId(assistantId);
    setVectorStoreId(vectorStoreId);
  };

  const readyFilesCount = uploadedFiles.filter(f => f.status === 'ready').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-saudi-green mr-4"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة
              </button>
              <div className="flex items-center">
                <div className="bg-saudi-green text-white p-2 rounded-lg ml-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">نظام RAG التجريبي</h1>
                  <p className="text-sm text-gray-600">مدعوم بـ OpenAI Assistant API</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{readyFilesCount} ملف جاهز</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${assistantReady ? 'text-green-600' : 'text-yellow-600'}`}>
                <div className={`w-2 h-2 rounded-full ${assistantReady ? 'bg-green-500' : 'bg-yellow-500'} ${assistantReady ? 'animate-pulse' : 'animate-spin'}`}></div>
                <span>{assistantReady ? 'المساعد جاهز' : 'جاري التهيئة'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-saudi-green to-saudi-green-light rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">مرحباً بك في نظام RAG التجريبي</h2>
              <p className="text-green-100">Retrieval-Augmented Generation powered by OpenAI</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">1. ارفع المستندات</span>
              </div>
              <p className="text-green-100">ارفع ملفات PDF، Word، Excel أو TXT</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5" />
                <span className="font-semibold">2. معالجة تلقائية</span>
              </div>
              <p className="text-green-100">يتم تحليل المحتوى وفهرسته تلقائياً</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">3. اسأل واحصل على إجابات</span>
              </div>
              <p className="text-green-100">اطرح أسئلة واحصل على إجابات مع المراجع</p>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <RAGDocumentUpload 
              onFileUpload={handleFileUpload}
              onAssistantReady={handleAssistantReady}
            />
            
            {/* File Status Summary */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">ملخص الملفات</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">
                      {uploadedFiles.filter(f => f.status === 'uploading').length}
                    </div>
                    <div className="text-xs text-blue-600">جاري الرفع</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">
                      {uploadedFiles.filter(f => f.status === 'processing').length}
                    </div>
                    <div className="text-xs text-yellow-600">جاري المعالجة</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">
                      {readyFilesCount}
                    </div>
                    <div className="text-xs text-green-600">جاهز</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">
                      {uploadedFiles.filter(f => f.status === 'error').length}
                    </div>
                    <div className="text-xs text-red-600">خطأ</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="h-[600px]">
            <RAGChatInterface 
              assistantReady={assistantReady}
              uploadedFilesCount={readyFilesCount}
            />
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">التفاصيل التقنية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">المواصفات</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• نموذج: GPT-4o-mini</li>
                <li>• حد أقصى: 25 ميجابايت لكل ملف</li>
                <li>• أنواع الملفات: PDF, DOCX, TXT, MD, XLS, XLSX</li>
                <li>• البحث الهجين: Vector + Keyword</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">الحالة الحالية</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• المساعد: {assistantReady ? '✅ جاهز' : '⏳ جاري التهيئة'}</li>
                <li>• معرف المساعد: {assistantId ? `${assistantId.substring(0, 20)}...` : 'غير متوفر'}</li>
                <li>• مخزن البيانات: {vectorStoreId ? `${vectorStoreId.substring(0, 20)}...` : 'غير متوفر'}</li>
                <li>• الملفات الجاهزة: {readyFilesCount}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGDemo;