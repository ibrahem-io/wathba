import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, XCircle, Clock, Trash2, FileText, AlertCircle } from 'lucide-react';
import openaiService from '../services/openaiService';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  fileId?: string;
  error?: string;
}

interface RAGDocumentUploadProps {
  onFileUpload?: (files: UploadedFile[]) => void;
  onAssistantReady?: (assistantId: string, vectorStoreId: string) => void;
}

const RAGDocumentUpload: React.FC<RAGDocumentUploadProps> = ({ onFileUpload, onAssistantReady }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [assistantReady, setAssistantReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAssistant();
  }, []);

  const initializeAssistant = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      const { assistantId, vectorStoreId } = await openaiService.getOrCreateAssistant();
      setAssistantReady(true);
      onAssistantReady?.(assistantId, vectorStoreId);
      
      // Load existing files
      const existingFiles = await openaiService.listUploadedFiles();
      const fileList: UploadedFile[] = existingFiles.map(file => ({
        id: file.id,
        name: file.id, // OpenAI doesn't store original filename
        size: 0,
        status: 'ready',
        progress: 100,
        fileId: file.id
      }));
      setUploadedFiles(fileList);
      onFileUpload?.(fileList);
    } catch (error) {
      console.error('Failed to initialize assistant:', error);
      setError('فشل في تهيئة المساعد الذكي. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsInitializing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!assistantReady) {
      setError('يرجى انتظار تهيئة المساعد الذكي أولاً');
      return;
    }

    setError(null);
    
    for (const file of acceptedFiles) {
      // Validate file
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        setError(`الملف ${file.name} كبير جداً. الحد الأقصى 25 ميجابايت.`);
        continue;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, newFile]);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId && f.progress < 90 
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);

        const result = await openaiService.uploadFile(file);
        
        clearInterval(progressInterval);
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'processing', 
                progress: 100, 
                fileId: result.fileId 
              }
            : f
        ));

        // Check processing status
        const checkStatus = async () => {
          const status = await openaiService.checkFileStatus(result.fileId);
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: status === 'ready' ? 'ready' : status }
              : f
          ));

          if (status === 'processing') {
            setTimeout(checkStatus, 2000);
          }
        };

        setTimeout(checkStatus, 2000);

      } catch (error) {
        console.error('Upload failed:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'فشل في رفع الملف'
              }
            : f
        ));
      }
    }

    // Update parent component
    const currentFiles = uploadedFiles.filter(f => f.status !== 'error');
    onFileUpload?.(currentFiles);
  }, [assistantReady, uploadedFiles, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    disabled: !assistantReady
  });

  const handleDeleteFile = async (fileId: string, openaiFileId?: string) => {
    if (openaiFileId) {
      try {
        await openaiService.deleteFile(openaiFileId);
      } catch (error) {
        console.error('Failed to delete file from OpenAI:', error);
      }
    }
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onFileUpload?.(uploadedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'جاري الرفع...';
      case 'processing':
        return 'جاري المعالجة...';
      case 'ready':
        return 'جاهز';
      case 'error':
        return 'خطأ';
      default:
        return 'غير معروف';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-saudi-green" />
        رفع المستندات للمساعد الذكي
      </h2>
      
      {isInitializing && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center">
          <Clock className="h-5 w-5 text-blue-500 animate-spin mr-3" />
          <span className="text-blue-700">جاري تهيئة المساعد الذكي...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="mr-auto text-red-500 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {assistantReady && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-green-700 text-sm">
            ✅ المساعد الذكي جاهز! يمكنك الآن رفع المستندات والبدء في المحادثة
          </span>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-saudi-green bg-green-50' 
            : assistantReady 
              ? 'border-gray-300 hover:border-saudi-green hover:bg-green-50' 
              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`h-12 w-12 mx-auto mb-4 ${assistantReady ? 'text-gray-400' : 'text-gray-300'}`} />
        
        {assistantReady ? (
          <>
            <p className="text-gray-700 font-medium mb-2">
              {isDragActive ? 'أفلت الملفات هنا...' : 'اسحب وأفلت الملفات هنا أو انقر للاختيار'}
            </p>
            <p className="text-gray-500 text-sm">
              PDF، Word، Excel، TXT، Markdown (حد أقصى 25 ميجابايت لكل ملف)
            </p>
          </>
        ) : (
          <p className="text-gray-500">يرجى انتظار تهيئة المساعد الذكي...</p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الملفات المرفوعة</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{getStatusText(file.status)}</span>
                      {file.status === 'uploading' && (
                        <span>{file.progress}%</span>
                      )}
                    </div>
                    {file.error && (
                      <p className="text-xs text-red-600 mt-1">{file.error}</p>
                    )}
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-saudi-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                )}
                
                <button
                  onClick={() => handleDeleteFile(file.id, file.fileId)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="حذف الملف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-700 text-sm">
          💡 <strong>نصيحة:</strong> بعد رفع المستندات، يمكنك استخدام المساعد الذكي للبحث والاستفسار عن محتوى الوثائق المرفوعة.
        </p>
      </div>
    </div>
  );
};

export default RAGDocumentUpload;