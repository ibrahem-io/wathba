import { useState, useEffect } from 'react';
import { Folder, FolderOpen, ChevronDown, ChevronRight, Plus, File, Trash, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FolderTreeProps {
  onSelectFolder: (folderId: string | null) => void;
  selectedFolderId: string | null;
  onFolderCreate?: (folder: any) => void;
}

interface FolderNode {
  id: string;
  name: string;
  parent_id: string | null;
  children: FolderNode[];
  documentCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
}

const FolderTree: React.FC<FolderTreeProps> = ({ onSelectFolder, selectedFolderId, onFolderCreate }) => {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [addingToFolderId, setAddingToFolderId] = useState<string | null>(null);
  const { isPublicMode } = useAuth();

  useEffect(() => {
    if (isPublicMode) {
      // Load mock folders for public mode
      loadMockFolders();
    }
  }, [isPublicMode]);

  const loadMockFolders = () => {
    const mockFolders: FolderNode[] = [
      {
        id: 'folder-1',
        name: 'التقارير المالية',
        parent_id: null,
        children: [
          {
            id: 'folder-1-1',
            name: 'الميزانيات العمومية',
            parent_id: 'folder-1',
            children: [],
            documentCount: 5,
            riskLevel: 'low',
            complianceStatus: 'compliant'
          },
          {
            id: 'folder-1-2',
            name: 'قوائم الدخل',
            parent_id: 'folder-1',
            children: [],
            documentCount: 8,
            riskLevel: 'medium',
            complianceStatus: 'warning'
          }
        ],
        documentCount: 13,
        riskLevel: 'medium',
        complianceStatus: 'warning'
      },
      {
        id: 'folder-2',
        name: 'الامتثال والحوكمة',
        parent_id: null,
        children: [
          {
            id: 'folder-2-1',
            name: 'سياسات الامتثال',
            parent_id: 'folder-2',
            children: [],
            documentCount: 3,
            riskLevel: 'high',
            complianceStatus: 'non-compliant'
          }
        ],
        documentCount: 3,
        riskLevel: 'high',
        complianceStatus: 'non-compliant'
      },
      {
        id: 'folder-3',
        name: 'تقارير الأداء',
        parent_id: null,
        children: [],
        documentCount: 7,
        riskLevel: 'low',
        complianceStatus: 'compliant'
      }
    ];
    setFolders(mockFolders);
  };

  const toggleExpand = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleAddFolder = (parentId: string | null) => {
    setAddingToFolderId(parentId);
    setNewFolderName('');
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FolderNode = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      parent_id: addingToFolderId,
      children: [],
      documentCount: 0,
      riskLevel: 'low',
      complianceStatus: 'compliant'
    };

    if (addingToFolderId) {
      // Add as child folder
      const updateFolders = (folders: FolderNode[]): FolderNode[] => {
        return folders.map(folder => {
          if (folder.id === addingToFolderId) {
            return { ...folder, children: [...folder.children, newFolder] };
          }
          return { ...folder, children: updateFolders(folder.children) };
        });
      };
      setFolders(updateFolders(folders));
      setExpandedFolders(prev => new Set([...prev, addingToFolderId]));
    } else {
      // Add as root folder
      setFolders([...folders, newFolder]);
    }

    setNewFolderName('');
    setAddingToFolderId(null);
    onFolderCreate?.(newFolder);
  };

  const handleDeleteFolder = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('هل أنت متأكد من حذف هذا المجلد؟')) {
      const removeFolderRecursive = (folders: FolderNode[]): FolderNode[] => {
        return folders
          .filter(folder => folder.id !== folderId)
          .map(folder => ({
            ...folder,
            children: removeFolderRecursive(folder.children)
          }));
      };
      
      setFolders(removeFolderRecursive(folders));
      
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle size={12} className="text-red-500" />;
      case 'medium':
        return <AlertTriangle size={12} className="text-yellow-500" />;
      default:
        return <CheckCircle size={12} className="text-green-500" />;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'non-compliant':
        return <XCircle size={12} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={12} className="text-yellow-500" />;
      default:
        return <CheckCircle size={12} className="text-green-500" />;
    }
  };

  const renderFolder = (folder: FolderNode) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    
    return (
      <div key={folder.id} className="select-none">
        <div 
          className={`flex items-center py-2 px-2 rounded-md cursor-pointer ${
            isSelected ? 'bg-saudi-light text-saudi-primary font-medium' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectFolder(folder.id)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(folder.id);
            }}
            className="p-1 mr-1"
          >
            {folder.children.length > 0 ? (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : (
              <span className="w-4" />
            )}
          </button>
          
          {isExpanded ? (
            <FolderOpen size={18} className="text-saudi-primary mr-1" />
          ) : (
            <Folder size={18} className="text-saudi-primary mr-1" />
          )}
          
          <span className="mr-2 flex-1 truncate text-sm">{folder.name}</span>
          
          <div className="flex items-center gap-1 ml-2">
            {getRiskIcon(folder.riskLevel)}
            {getComplianceIcon(folder.complianceStatus)}
            <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
              {folder.documentCount}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddFolder(folder.id);
            }}
            className="p-1 text-gray-500 hover:text-saudi-primary ml-1"
            title="إضافة مجلد فرعي"
          >
            <Plus size={14} />
          </button>
          
          <button
            onClick={(e) => handleDeleteFolder(folder.id, e)}
            className="p-1 text-gray-500 hover:text-red-500"
            title="حذف المجلد"
          >
            <Trash size={14} />
          </button>
        </div>
        
        {isExpanded && folder.children.length > 0 && (
          <div className="mr-6 border-r border-gray-200 pr-2 mt-1">
            {folder.children.map(childFolder => renderFolder(childFolder))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500">جاري تحميل المجلدات...</div>;
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">المجلدات</h3>
        <button
          onClick={() => handleAddFolder(null)}
          className="p-1 text-gray-500 hover:text-saudi-primary"
          title="إضافة مجلد جديد"
        >
          <Plus size={18} />
        </button>
      </div>
      
      {addingToFolderId !== null && (
        <div className="mb-3 p-2 bg-gray-50 rounded-md">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="اسم المجلد الجديد"
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setAddingToFolderId(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              إلغاء
            </button>
            <button
              onClick={handleCreateFolder}
              className="px-3 py-1 text-sm bg-saudi-primary text-white rounded-md hover:bg-saudi-secondary"
            >
              إنشاء
            </button>
          </div>
        </div>
      )}
      
      <div 
        className={`flex items-center py-2 px-2 rounded-md cursor-pointer mb-2 ${
          selectedFolderId === null ? 'bg-saudi-light text-saudi-primary font-medium' : 'hover:bg-gray-100'
        }`}
        onClick={() => onSelectFolder(null)}
      >
        <File size={18} className="text-saudi-primary mr-1" />
        <span className="mr-2 text-sm">جميع المستندات</span>
      </div>
      
      {folders.map(folder => renderFolder(folder))}
      
      {folders.length === 0 && !addingToFolderId && (
        <div className="text-gray-500 text-sm p-2">
          لا توجد مجلدات. انقر على + لإنشاء مجلد جديد.
        </div>
      )}
    </div>
  );
};

export default FolderTree;