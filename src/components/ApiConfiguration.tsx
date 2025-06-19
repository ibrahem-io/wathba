import { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash, Save, X, Eye, EyeOff, TestTube } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ApiConfig {
  id: string;
  service_name: string;
  service_type: 'file_upload' | 'ai_chat' | 'document_analysis' | 'ocr' | 'custom';
  endpoint_url: string;
  api_key: string | null;
  auth_type: 'api_key' | 'bearer_token' | 'oauth';
  headers: Record<string, string>;
  parameters: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

const ApiConfiguration = () => {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Set<string>>(new Set());
  const [testingConfig, setTestingConfig] = useState<string | null>(null);
  const { isPublicMode, user } = useAuth();

  // Mock data for public mode
  const mockConfigs: ApiConfig[] = [
    {
      id: '1',
      service_name: 'OpenAI GPT-4',
      service_type: 'ai_chat',
      endpoint_url: 'https://api.openai.com/v1/chat/completions',
      api_key: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      auth_type: 'bearer_token',
      headers: { 'Content-Type': 'application/json' },
      parameters: { model: 'gpt-4', temperature: 0.7, max_tokens: 2000 },
      is_active: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      service_name: 'Azure Document Intelligence',
      service_type: 'document_analysis',
      endpoint_url: 'https://your-resource.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-document:analyze',
      api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      auth_type: 'api_key',
      headers: { 'Ocp-Apim-Subscription-Key': '' },
      parameters: { api_version: '2023-07-31' },
      is_active: false,
      created_at: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      service_name: 'Custom OCR Service',
      service_type: 'ocr',
      endpoint_url: 'https://api.example.com/ocr/extract',
      api_key: 'custom-api-key-xxxxxxxx',
      auth_type: 'api_key',
      headers: { 'Authorization': 'Bearer ' },
      parameters: { language: 'ar', format: 'json' },
      is_active: true,
      created_at: '2024-01-13T09:15:00Z'
    }
  ];

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      if (isPublicMode) {
        // Use mock data in public mode
        setConfigs(mockConfigs);
      } else {
        // In real mode, load from Supabase
        const { getApiConfigurations } = await import('../services/apiService');
        const data = await getApiConfigurations();
        setConfigs(data);
      }
    } catch (error) {
      console.error('Error loading API configurations:', error);
      setConfigs(mockConfigs); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (config: Partial<ApiConfig>) => {
    try {
      if (isPublicMode) {
        // Mock save in public mode
        if (editingConfig) {
          setConfigs(prev => prev.map(c => c.id === editingConfig.id ? { ...c, ...config } : c));
        } else {
          const newConfig: ApiConfig = {
            id: Date.now().toString(),
            service_name: config.service_name || '',
            service_type: config.service_type || 'custom',
            endpoint_url: config.endpoint_url || '',
            api_key: config.api_key || null,
            auth_type: config.auth_type || 'api_key',
            headers: config.headers || {},
            parameters: config.parameters || {},
            is_active: config.is_active ?? true,
            created_at: new Date().toISOString()
          };
          setConfigs(prev => [...prev, newConfig]);
        }
      } else {
        // Real save to Supabase
        const { createApiConfiguration, updateApiConfiguration } = await import('../services/apiService');
        if (editingConfig) {
          await updateApiConfiguration(editingConfig.id, config);
        } else {
          await createApiConfiguration(config, user!.id);
        }
        await loadConfigs();
      }
      
      setEditingConfig(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving API configuration:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعداد؟')) return;
    
    try {
      if (isPublicMode) {
        setConfigs(prev => prev.filter(c => c.id !== id));
      } else {
        const { deleteApiConfiguration } = await import('../services/apiService');
        await deleteApiConfiguration(id);
        await loadConfigs();
      }
    } catch (error) {
      console.error('Error deleting API configuration:', error);
      alert('حدث خطأ أثناء حذف الإعداد');
    }
  };

  const handleTestConfig = async (config: ApiConfig) => {
    setTestingConfig(config.id);
    try {
      // Mock test for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('تم اختبار الاتصال بنجاح!');
    } catch (error) {
      alert('فشل في اختبار الاتصال');
    } finally {
      setTestingConfig(null);
    }
  };

  const toggleApiKeyVisibility = (configId: string) => {
    setShowApiKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(configId)) {
        newSet.delete(configId);
      } else {
        newSet.add(configId);
      }
      return newSet;
    });
  };

  const getServiceTypeLabel = (type: string) => {
    const labels = {
      'ai_chat': 'محادثة ذكية',
      'document_analysis': 'تحليل المستندات',
      'ocr': 'استخراج النصوص',
      'file_upload': 'رفع الملفات',
      'custom': 'مخصص'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAuthTypeLabel = (type: string) => {
    const labels = {
      'api_key': 'مفتاح API',
      'bearer_token': 'رمز Bearer',
      'oauth': 'OAuth'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-saudi-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="mr-3 text-gray-600">جاري تحميل الإعدادات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-saudi-primary ml-2" />
            <h2 className="text-2xl font-bold text-gray-900">إعدادات API</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-saudi-primary text-white px-4 py-2 rounded-lg hover:bg-saudi-secondary transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 ml-2" />
            إضافة API جديد
          </button>
        </div>

        {isPublicMode && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm">
              🔧 في الوضع العام، التغييرات محفوظة محلياً فقط
            </p>
          </div>
        )}

        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{config.service_name}</h3>
                  <span className={`mr-3 px-2 py-1 rounded-full text-xs font-medium ${
                    config.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {config.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                  <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {getServiceTypeLabel(config.service_type)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConfig(config)}
                    disabled={testingConfig === config.id}
                    className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                    title="اختبار الاتصال"
                  >
                    {testingConfig === config.id ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingConfig(config)}
                    className="p-2 text-gray-500 hover:text-saudi-primary"
                    title="تعديل"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">نوع المصادقة:</span>
                  <span className="mr-2 text-gray-600">{getAuthTypeLabel(config.auth_type)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">نقطة النهاية:</span>
                  <span className="mr-2 text-gray-600 break-all">{config.endpoint_url}</span>
                </div>
                {config.api_key && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">مفتاح API:</span>
                    <div className="flex items-center mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1">
                        {showApiKeys.has(config.id) ? config.api_key : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleApiKeyVisibility(config.id)}
                        className="mr-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {showApiKeys.has(config.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {configs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لم يتم إعداد أي APIs بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingConfig) && (
        <ApiConfigForm
          config={editingConfig}
          onSave={handleSaveConfig}
          onCancel={() => {
            setShowAddForm(false);
            setEditingConfig(null);
          }}
        />
      )}
    </div>
  );
};

interface ApiConfigFormProps {
  config: ApiConfig | null;
  onSave: (config: Partial<ApiConfig>) => void;
  onCancel: () => void;
}

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    service_name: config?.service_name || '',
    service_type: config?.service_type || 'ai_chat',
    endpoint_url: config?.endpoint_url || '',
    api_key: config?.api_key || '',
    auth_type: config?.auth_type || 'api_key',
    headers: JSON.stringify(config?.headers || {}, null, 2),
    parameters: JSON.stringify(config?.parameters || {}, null, 2),
    is_active: config?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const headers = JSON.parse(formData.headers);
      const parameters = JSON.parse(formData.parameters);
      
      onSave({
        ...formData,
        headers,
        parameters
      });
    } catch (error) {
      alert('خطأ في تنسيق JSON للرؤوس أو المعاملات');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {config ? 'تعديل إعدادات API' : 'إضافة API جديد'}
            </h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الخدمة
                </label>
                <input
                  type="text"
                  value={formData.service_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الخدمة
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
                >
                  <option value="ai_chat">محادثة ذكية</option>
                  <option value="document_analysis">تحليل المستندات</option>
                  <option value="ocr">استخراج النصوص</option>
                  <option value="file_upload">رفع الملفات</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نقطة النهاية (URL)
              </label>
              <input
                type="url"
                value={formData.endpoint_url}
                onChange={(e) => setFormData(prev => ({ ...prev, endpoint_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
                required
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع المصادقة
                </label>
                <select
                  value={formData.auth_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, auth_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
                >
                  <option value="api_key">مفتاح API</option>
                  <option value="bearer_token">رمز Bearer</option>
                  <option value="oauth">OAuth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  مفتاح API
                </label>
                <input
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رؤوس HTTP (JSON)
              </label>
              <textarea
                value={formData.headers}
                onChange={(e) => setFormData(prev => ({ ...prev, headers: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary font-mono text-sm"
                rows={4}
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                معاملات إضافية (JSON)
              </label>
              <textarea
                value={formData.parameters}
                onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary font-mono text-sm"
                rows={4}
                dir="ltr"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-saudi-primary focus:ring-saudi-primary border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="mr-2 text-sm text-gray-700">
                تفعيل هذا الإعداد
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-saudi-primary text-white rounded-md hover:bg-saudi-secondary transition-colors flex items-center"
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiConfiguration;