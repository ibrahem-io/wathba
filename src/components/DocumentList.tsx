import React, { useState, useEffect } from 'react';
import { FileText, FileImage, FileAudio, FileVideo, File, Search, Tag, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  uploadDate: string;
  labels: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  folderId?: string | null;
}

interface DocumentListProps {
  documents: Document[];
  selectedFolderId?: string | null;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents: propDocuments, selectedFolderId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { isPublicMode } = useAuth();

  useEffect(() => {
    // Add risk levels to documents for demo
    const documentsWithRisk = propDocuments.map(doc => ({
      ...doc,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      folderId: Math.random() > 0.5 ? ['folder-1', 'folder-2', 'folder-3'][Math.floor(Math.random() * 3)] : null
    }));

    if (isPublicMode) {
      setDocuments(documentsWithRisk);
    } else {
      const fetchDocuments = async () => {
        try {
          const { getDocuments } = await import('../services/documentService');
          const supabaseDocuments = await getDocuments();
          
          const transformedDocuments = supabaseDocuments.map((doc: any) => ({
            id: doc.id,
            name: doc.filename,
            type: doc.file_type || '',
            size: doc.file_size || 0,
            lastModified: new Date(doc.created_at).getTime(),
            uploadDate: doc.created_at,
            labels: doc.auto_labels || [],
            riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
            folderId: doc.folder_id
          }));
          
          setDocuments([...transformedDocuments, ...documentsWithRisk]);
        } catch (error) {
          console.error('Error fetching documents:', error);
          setDocuments(documentsWithRisk);
        }
      };
      
      fetchDocuments();
    }
  }, [propDocuments, isPublicMode]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-6 w-6 text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-6 w-6 text-yellow-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-6 w-6 text-red-500" />;
    } else if (
      fileType.includes('pdf') || 
      fileType.includes('word') || 
      fileType.includes('document')
    ) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel as keyof typeof colors]}`}>
        {getRiskIcon(riskLevel)}
        <span className="mr-1">{labels[riskLevel as keyof typeof labels]}</span>
      </span>
    );
  };

  // Filter documents
  let filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLabel = selectedLabel ? document.labels.includes(selectedLabel) : true;
    const matchesRisk = selectedRisk ? document.riskLevel === selectedRisk : true;
    const matchesFolder = selectedFolderId ? document.folderId === selectedFolderId : true;
    
    return matchesSearch && matchesLabel && matchesRisk && matchesFolder;
  });

  // Get all unique labels and risk levels
  const allLabels = Array.from(new Set(documents.flatMap(doc => doc.labels)));
  const riskLevels = [
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ];

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">المستندات</h2>
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لم يتم رفع أي مستندات بعد</p>
          {isPublicMode && (
            <p className="text-gray-400 text-sm mt-2">
              استخدم منطقة الرفع أعلاه لإضافة مستندات
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">المستندات</h2>
      
      <div className="flex flex-col md:flex-row mb-6 gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في المستندات..."
            className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedLabel || ''}
            onChange={(e) => setSelectedLabel(e.target.value || null)}
          >
            <option value="">جميع التصنيفات</option>
            {allLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          
          <select
            className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedRisk || ''}
            onChange={(e) => setSelectedRisk(e.target.value || null)}
          >
            <option value="">جميع المخاطر</option>
            {riskLevels.map(risk => (
              <option key={risk.value} value={risk.value}>{risk.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الملف
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيفات
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مستوى المخاطر
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحجم
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الرفع
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(document.type)}
                      <div className="mr-4 truncate max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {document.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {document.labels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                        >
                          <Tag className="h-3 w-3 ml-1" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {document.riskLevel && getRiskBadge(document.riskLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatBytes(document.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                      {formatDate(document.uploadDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">لم يتم العثور على مستندات مطابقة</p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;