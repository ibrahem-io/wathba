import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Upload, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { useCSLC } from '../../contexts/CSLCContext';

const ResolveAI = () => {
  const [activeTab, setActiveTab] = useState('new-complaint');
  const [complaintText, setComplaintText] = useState('');
  const [customerAccount, setCustomerAccount] = useState('');
  const [complaintSource, setComplaintSource] = useState('website');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addComplaint, triggerCrossAnalysis } = useCSLC();

  const handleProcessComplaint = async () => {
    if (!complaintText.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const result = {
        id: Date.now(),
        text: complaintText,
        source: complaintSource,
        customerAccount,
        category: 'Network Quality Issue',
        region: 'Riyadh Region',
        confidence: 94,
        language: complaintText.match(/[\u0600-\u06FF]/) ? 'Arabic' : 'English',
        complexity: 'Medium',
        estimatedResolution: '24 hours',
        priority: 'High',
        aiResponse: {
          arabic: 'نشكركم على تواصلكم معنا. تم تسجيل شكواكم بخصوص ضعف الشبكة في منطقة الرياض. سيتم التواصل مع الفريق التقني لحل المشكلة خلال 24 ساعة. رقم المتابعة: #RES2024001',
          english: 'Thank you for contacting us. Your complaint regarding network weakness in Riyadh region has been registered. Our technical team will address this issue within 24 hours. Reference number: #RES2024001'
        },
        customerData: {
          accountStatus: 'Active',
          servicePlan: 'Premium 5G',
          recentIssues: 2,
          satisfactionScore: 7.2
        },
        nextActions: [
          'Assign to Network Operations Team',
          'Schedule field inspection',
          'Send customer update notification',
          'Monitor resolution progress'
        ]
      };
      
      setAnalysisResult(result);
      addComplaint(result);
      
      // Trigger cross-system analysis
      triggerCrossAnalysis('resolve-ai', {
        category: 'network',
        region: 'riyadh',
        issue: 'weak_signal'
      });
      
      setIsProcessing(false);
    }, 3000);
  };

  const recentComplaints = [
    {
      id: 'RES2024001',
      title: 'ضعف إشارة الشبكة في حي النرجس',
      source: 'Mobile App',
      time: 'منذ 5 دقائق',
      status: 'قيد المعالجة',
      priority: 'عالية',
      category: 'Network Quality'
    },
    {
      id: 'RES2024002',
      title: 'انقطاع الإنترنت المتكرر',
      source: 'Call Center',
      time: 'منذ 12 دقيقة',
      status: 'تم الحل',
      priority: 'متوسطة',
      category: 'Service Interruption'
    },
    {
      id: 'RES2024003',
      title: 'بطء في سرعة التحميل',
      source: 'Website',
      time: 'منذ 18 دقيقة',
      status: 'مراجعة',
      priority: 'منخفضة',
      category: 'Performance'
    },
    {
      id: 'RES2024004',
      title: 'مشكلة في الفوترة',
      source: 'Email',
      time: 'منذ 25 دقيقة',
      status: 'محول للمالية',
      priority: 'متوسطة',
      category: 'Billing'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد المعالجة': return 'text-blue-600 bg-blue-100';
      case 'تم الحل': return 'text-green-600 bg-green-100';
      case 'مراجعة': return 'text-yellow-600 bg-yellow-100';
      case 'محول للمالية': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'text-red-600 bg-red-100';
      case 'متوسطة': return 'text-yellow-600 bg-yellow-100';
      case 'منخفضة': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">محرك ResolveAI</h1>
              <p className="text-gray-600">معالجة ذكية للشكاوى والاستفسارات</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-gray-500">اليوم</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-sm text-gray-500">معدل الحل</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">18 دقيقة</p>
              <p className="text-sm text-gray-500">متوسط الاستجابة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('new-complaint')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'new-complaint'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              معالجة شكوى جديدة
            </button>
            <button
              onClick={() => setActiveTab('recent-complaints')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recent-complaints'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الشكاوى الأخيرة
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              التحليلات
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'new-complaint' && (
            <div className="space-y-6">
              {!analysisResult ? (
                <>
                  {/* Complaint Input Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مصدر الشكوى
                      </label>
                      <select
                        value={complaintSource}
                        onChange={(e) => setComplaintSource(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="website">الموقع الإلكتروني</option>
                        <option value="call-center">مركز الاتصال</option>
                        <option value="email">البريد الإلكتروني</option>
                        <option value="mobile-app">التطبيق المحمول</option>
                        <option value="social-media">وسائل التواصل</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الحساب (اختياري)
                      </label>
                      <input
                        type="text"
                        value={customerAccount}
                        onChange={(e) => setCustomerAccount(e.target.value)}
                        placeholder="أدخل رقم حساب العميل"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نص الشكوى
                    </label>
                    <textarea
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="أدخل تفاصيل الشكوى هنا... (يدعم العربية والإنجليزية)"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleProcessComplaint}
                      disabled={!complaintText.trim() || isProcessing}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري التحليل...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          معالجة الشكوى
                        </>
                      )}
                    </button>
                  </div>

                  {isProcessing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <h4 className="font-medium text-blue-900">جاري تحليل الشكوى...</h4>
                          <p className="text-blue-700 text-sm">
                            يتم الآن تصنيف الشكوى وتحليل المحتوى وإعداد الرد المناسب
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Analysis Results */
                <div className="space-y-6">
                  {/* Classification Results */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">تم تحليل الشكوى بنجاح</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-green-700 font-medium">التصنيف</p>
                        <p className="text-green-900">{analysisResult.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">المنطقة</p>
                        <p className="text-green-900">{analysisResult.region}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">مستوى الثقة</p>
                        <p className="text-green-900">{analysisResult.confidence}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Data */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">بيانات العميل</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">حالة الحساب</p>
                        <p className="font-medium text-green-600">{analysisResult.customerData.accountStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الباقة</p>
                        <p className="font-medium">{analysisResult.customerData.servicePlan}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المشاكل الأخيرة</p>
                        <p className="font-medium">{analysisResult.customerData.recentIssues}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">درجة الرضا</p>
                        <p className="font-medium">{analysisResult.customerData.satisfactionScore}/10</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Generated Response */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">الرد المقترح</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">النسخة العربية</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900">{analysisResult.aiResponse.arabic}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">النسخة الإنجليزية</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-900">{analysisResult.aiResponse.english}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">الإجراءات المطلوبة</h4>
                    <div className="space-y-3">
                      {analysisResult.nextActions.map((action: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      إرسال الرد
                    </button>
                    <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
                      حفظ كمسودة
                    </button>
                    <button 
                      onClick={() => setAnalysisResult(null)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
                    >
                      شكوى جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recent-complaints' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في الشكاوى..."
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  تصفية
                </button>
              </div>

              {/* Complaints List */}
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h4 className="font-semibold text-gray-900">{complaint.title}</h4>
                        <span className="text-sm text-gray-500">#{complaint.id}</span>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{complaint.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{complaint.time}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                      <span className="text-gray-500">{complaint.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">مؤشرات الأداء</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">معدل الحل التلقائي</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">متوسط وقت الاستجابة</span>
                    <span className="font-semibold">18 دقيقة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">دقة التصنيف</span>
                    <span className="font-semibold text-blue-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">رضا العملاء</span>
                    <span className="font-semibold text-green-600">4.6/5</span>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">توزيع الشكاوى</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">جودة الشبكة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الفوترة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">خدمة العملاء</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">أخرى</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '9%' }}></div>
                      </div>
                      <span className="text-sm font-medium">9%</span>
                    </div>
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

export default ResolveAI;