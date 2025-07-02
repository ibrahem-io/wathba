import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileText, CheckCircle, XCircle, AlertCircle, Plus, Trash2, Bot, Sparkles, Database } from 'lucide-react';
import { ragSearchService } from '../../services/ragSearchService';
import enhancedDocumentIndexingService from '../../services/enhancedDocumentIndexingService';

interface DocumentUploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
  enableRAGUpload?: boolean;
}

interface UploadFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  ragFileId?: string;
  documentId?: string;
  elasticsearchIndexed?: boolean;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    category: string;
  };
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  onClose,
  onUploadSuccess,
  enableRAGUpload = false
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'metadata' | 'upload'>('select');
  const [uploadToRAG, setUploadToRAG] = useState(enableRAGUpload);

  const categories = [
    'تقارير مالية',
    'سياسات وإجراءات',
    'مستندات قانونية',
    'عروض تقديمية',
    'بيانات ومعلومات',
    'مراسلات رسمية',
    'أخرى'
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        tags: [],
        category: categories[0]
      }
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setCurrentStep('metadata');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const updateFileMetadata = (fileId: string, metadata: Partial<UploadFile['metadata']>) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, metadata: { ...file.metadata, ...metadata } }
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
    if (uploadFiles.length === 1) {
      setCurrentStep('select');
    }
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    
    updateFileMetadata(fileId, {
      tags: [...uploadFiles.find(f => f.id === fileId)?.metadata.tags || [], tag.trim()]
    });
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const newTags = file.metadata.tags.filter((_, index) => index !== tagIndex);
    updateFileMetadata(fileId, { tags: newTags });
  };

  const uploadSingleFile = async (file: UploadFile) => {
    // Update progress to show uploading
    setUploadFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'uploading', progress: 10 } : f
    ));

    try {
      // Index the document using the enhanced service (uploads to both OpenAI and ElasticSearch)
      const indexResult = await enhancedDocumentIndexingService.indexDocument(file.file, file.metadata);
      
      if (!indexResult.success) {
        throw new Error(indexResult.error || 'فشل في فهرسة المستند');
      }

      // Update progress
      setUploadFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          progress: 100,
          status: 'success',
          documentId: indexResult.documentId,
          elasticsearchIndexed: true,
          ragFileId: uploadToRAG ? 'uploaded' : undefined
        } : f
      ));

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: 'error',
              error: error instanceof Error ? error.message : 'فشل في رفع الملف'
            }
          : f
      ));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setCurrentStep('upload');

    // Upload files sequentially
    for (const file of uploadFiles) {
      await uploadSingleFile(file);
    }

    setIsUploading(false);
    
    // Check if all uploads were successful
    const allSuccessful = uploadFiles.every(f => f.status === 'success');
    if (allSuccessful) {
      setTimeout(() => {
        onUploadSuccess();
      }, 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-saudi-green to-saudi-green-light text-white p-2 rounded-lg">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">رفع مستندات جديدة</h2>
              <p className="text-sm text-gray-600">
                سيتم فهرسة المستندات في ElasticSearch
                {enableRAGUpload && ' والنظام الذكي OpenAI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Destinations */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* ElasticSearch */}
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">ElasticSearch</h3>
                  <p className="text-sm text-gray-600">بحث متقدم وفهرسة ذكية</p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  مفعل
                </div>
              </div>
              
              {/* OpenAI RAG */}
              {enableRAGUpload && (
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">OpenAI RAG</h3>
                    <p className="text-sm text-gray-600">محادثة ذكية مع المستندات</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadToRAG}
                      onChange={(e) => setUploadToRAG(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      uploadToRAG ? 'bg-green-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        uploadToRAG ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep === 'select' ? 'text-saudi-green' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'select' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="mr-2">اختيار الملفات</span>
            </div>
            <div className={`flex items-center ${currentStep === 'metadata' ? 'text-saudi-green' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'metadata' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="mr-2">البيانات الوصفية</span>
            </div>
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-saudi-green' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="mr-2">الرفع والفهرسة</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentStep === 'select' && (
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-saudi-green bg-green-50' 
                    : 'border-gray-300 hover:border-saudi-green hover:bg-green-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <div className="flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">سيتم رفع الملفات إلى ElasticSearch</span>
                    {uploadToRAG && enableRAGUpload && (
                      <>
                        <span className="text-gray-400">+</span>
                        <Sparkles className="h-5 w-5 text-green-600" />
                        <span className="text-green-600 font-medium">OpenAI</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'أفلت الملفات هنا' : 'اسحب وأفلت الملفات أو انقر للاختيار'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    يدعم: PDF، Word، Excel، PowerPoint، TXT، CSV
                  </p>
                  <p className="text-sm text-gray-500">
                    الحد الأقصى: 50 ميجابايت لكل ملف
                  </p>
                </div>
              </div>

              {uploadFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">الملفات المحددة ({uploadFiles.length})</h4>
                  <div className="space-y-3">
                    {uploadFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.file.name)}
                          <div>
                            <p className="font-medium text-gray-900">{file.file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'metadata' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">إضافة البيانات الوصفية</h3>
                <div className="flex items-center gap-2 text-green-600">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">سيتم فهرسة هذه البيانات في ElasticSearch</span>
                  {uploadToRAG && enableRAGUpload && (
                    <>
                      <span className="text-gray-400">+</span>
                      <Bot className="h-4 w-4" />
                      <span className="text-sm">OpenAI</span>
                    </>
                  )}
                </div>
              </div>
              {uploadFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    {getFileIcon(file.file.name)}
                    <div>
                      <h4 className="font-medium text-gray-900">{file.file.name}</h4>
                      <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        العنوان
                      </label>
                      <input
                        type="text"
                        value={file.metadata.title}
                        onChange={(e) => updateFileMetadata(file.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التصنيف
                      </label>
                      <select
                        value={file.metadata.category}
                        onChange={(e) => updateFileMetadata(file.id, { category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوصف
                      </label>
                      <textarea
                        value={file.metadata.description}
                        onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
                        placeholder="وصف مختصر للمستند..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        العلامات
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {file.metadata.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(file.id, index)}
                              className="mr-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="إضافة علامة..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addTag(file.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addTag(file.id, input.value);
                            input.value = '';
                          }}
                          className="px-3 py-2 bg-saudi-green text-white rounded-md hover:bg-saudi-green-dark"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">حالة الرفع والفهرسة</h3>
                <div className="flex items-center gap-2 text-green-600">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">جاري الفهرسة في ElasticSearch</span>
                  {uploadToRAG && enableRAGUpload && (
                    <>
                      <span className="text-gray-400">+</span>
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm">OpenAI</span>
                    </>
                  )}
                </div>
              </div>
              {uploadFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.file.name)}
                      <div>
                        <p className="font-medium text-gray-900">{file.metadata.title}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {file.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      {file.status === 'uploading' && <div className="w-5 h-5 border-2 border-saudi-green border-t-transparent rounded-full animate-spin" />}
                      {file.elasticsearchIndexed && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Database className="h-4 w-4" />
                          <span className="text-xs">مفهرس</span>
                        </div>
                      )}
                      {uploadToRAG && file.ragFileId && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Bot className="h-4 w-4" />
                          <span className="text-xs">OpenAI</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {file.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-saudi-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {file.status === 'error' && file.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {file.error}
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      ✅ تم رفع وفهرسة الملف بنجاح في ElasticSearch
                      {uploadToRAG && file.ragFileId && ' وOpenAI'}
                      {file.documentId && (
                        <div className="text-xs text-gray-600 mt-1">
                          معرف المستند: {file.documentId}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {uploadFiles.length > 0 && `${uploadFiles.length} ملف محدد`}
            {uploadFiles.length > 0 && (
              <span className="text-blue-600"> • سيتم رفعها إلى ElasticSearch</span>
            )}
            {uploadToRAG && enableRAGUpload && uploadFiles.length > 0 && (
              <span className="text-green-600"> + OpenAI</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {currentStep === 'metadata' && (
              <button
                onClick={() => setCurrentStep('select')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                السابق
              </button>
            )}
            
            {currentStep === 'select' && uploadFiles.length > 0 && (
              <button
                onClick={() => setCurrentStep('metadata')}
                className="px-6 py-2 bg-gradient-to-r from-saudi-green to-saudi-green-light text-white rounded-md hover:from-saudi-green-dark hover:to-saudi-green"
              >
                التالي
              </button>
            )}
            
            {currentStep === 'metadata' && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-gradient-to-r from-saudi-green to-saudi-green-light text-white rounded-md hover:from-saudi-green-dark hover:to-saudi-green disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الرفع والفهرسة...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    {uploadToRAG && enableRAGUpload && <Bot className="h-4 w-4" />}
                    رفع وفهرسة الملفات
                  </>
                )}
              </button>
            )}
            
            {currentStep === 'upload' && uploadFiles.every(f => f.status === 'success') && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-saudi-green to-saudi-green-light text-white rounded-md hover:from-saudi-green-dark hover:to-saudi-green"
              >
                إنهاء
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;