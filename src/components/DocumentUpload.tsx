import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DocumentUploadProps {
  onFileUpload: (files: File[]) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { isPublicMode, publicUser, user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      setUploadError(null);
      
      try {
        // In public mode, just simulate upload and use local storage
        if (isPublicMode) {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Call the onFileUpload callback for UI updates
          onFileUpload(acceptedFiles);
          setUploadSuccess(true);
          
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
        } else {
          // Original Supabase upload logic for authenticated users
          const { uploadDocument } = await import('../services/documentService');
          
          if (user) {
            const uploadPromises = acceptedFiles.map(file => {
              // Generate random labels for demo purposes
              const possibleLabels = ['مالي', 'قانوني', 'تشغيلي', 'ضريبي', 'أداء', 'امتثال', 'مخاطر', 'حوكمة'];
              const numLabels = Math.floor(Math.random() * 3) + 1;
              const labels = [];
              
              for (let i = 0; i < numLabels; i++) {
                const randomIndex = Math.floor(Math.random() * possibleLabels.length);
                const label = possibleLabels[randomIndex];
                if (!labels.includes(label)) {
                  labels.push(label);
                }
              }
              
              return uploadDocument(file, user.id, null, labels);
            });
            
            await Promise.all(uploadPromises);
          }
          
          // Call the onFileUpload callback for UI updates
          onFileUpload(acceptedFiles);
          setUploadSuccess(true);
          
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        setUploadError('حدث خطأ أثناء رفع الملفات. يرجى المحاولة مرة أخرى.');
      } finally {
        setUploading(false);
      }
    }
  }, [onFileUpload, user, isPublicMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4', '.avi', '.mov']
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">رفع المستندات</h2>
      
      {isPublicMode && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-sm">
            📁 في الوضع العام، سيتم حفظ الملفات محلياً في المتصفح
          </p>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">اسحب وأفلت الملفات هنا أو انقر للاختيار</p>
        <p className="text-gray-500 text-sm">
          PDF، Word، Excel، PowerPoint، صور، صوت، فيديو
        </p>
      </div>

      {uploading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span className="text-blue-700">جاري رفع الملفات...</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
          <span className="text-green-700">تم رفع الملفات بنجاح!</span>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
          <XCircle className="w-6 h-6 text-red-500 mr-3" />
          <span className="text-red-700">{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;