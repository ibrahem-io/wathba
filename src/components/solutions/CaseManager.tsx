import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  Calendar,
  TrendingUp,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download
} from 'lucide-react';
import { useCSLC } from '../../contexts/CSLCContext';

const CaseManager = () => {
  const [activeTab, setActiveTab] = useState('new-case');
  const [caseType, setCaseType] = useState('new-license');
  const [industryCategory, setIndustryCategory] = useState('telecom-operator');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addCase } = useCSLC();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleAnalyzeCase = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const result = {
        id: `CASE-${Date.now()}`,
        type: caseType,
        industry: industryCategory,
        extractedInfo: {
          applicantName: 'شركة الاتصالات المتقدمة المحدودة',
          licenseType: 'مشغل اتصالات متنقلة',
          requestedServices: ['5G Network', 'IoT Services', 'Enterprise Solutions'],
          coverage: 'المنطقة الشرقية - الدمام والخبر',
          investmentAmount: '2.5 مليار ريال',
          timeline: '18 شهر'
        },
        precedentAnalysis: [
          {
            caseId: 'CASE-2023-089',
            similarity: 94,
            outcome: 'موافقة مشروطة',
            processingTime: '45 يوم',
            conditions: ['تقديم ضمانات مالية', 'التزام بمعايير التغطية']
          },
          {
            caseId: 'CASE-2023-156',
            similarity: 87,
            outcome: 'موافقة',
            processingTime: '32 يوم',
            conditions: ['مراجعة دورية كل 6 أشهر']
          },
          {
            caseId: 'CASE-2022-234',
            similarity: 82,
            outcome: 'رفض',
            processingTime: '28 يوم',
            reason: 'عدم استيفاء المتطلبات المالية'
          }
        ],
        complianceCheck: {
          missingDocuments: [
            'شهادة السجل التجاري المحدثة',
            'تقرير الجدوى الاقتصادية المفصل'
          ],
          riskAssessment: 'متوسط',
          regulatoryChanges: [
            'تحديث لائحة الطيف الترددي (2024)',
            'معايير جديدة لأمن المعلومات'
          ]
        },
        recommendation: {
          decision: 'موافقة مشروطة',
          confidence: 89,
          reasoning: 'الشركة تستوفي المتطلبات الأساسية مع وجود بعض النواقص القابلة للمعالجة',
          conditions: [
            'تقديم المستندات الناقصة خلال 30 يوم',
            'إيداع ضمان بنكي بقيمة 50 مليون ريال',
            'التزام بتغطية 80% من المنطقة خلال السنة الأولى'
          ],
          timeline: '42 يوم',
          nextReview: '6 أشهر'
        }
      };
      
      setAnalysisResult(result);
      addCase(result);
      setIsAnalyzing(false);
    }, 4000);
  };

  const activeCases = [
    {
      id: 'CASE-2024-001',
      title: 'ترخيص مشغل اتصالات - شركة التقنية المتطورة',
      type: 'ترخيص جديد',
      industry: 'مشغل اتصالات',
      status: 'مراجعة أولية',
      priority: 'عالية',
      daysRemaining: 38,
      progress: 25,
      assignee: 'أحمد المحمد',
      lastUpdate: 'منذ ساعتين'
    },
    {
      id: 'CASE-2024-002',
      title: 'تجديد ترخيص - شركة الإنترنت السريع',
      type: 'تجديد',
      industry: 'مزود خدمة إنترنت',
      status: 'انتظار مستندات',
      priority: 'متوسطة',
      daysRemaining: 15,
      progress: 60,
      assignee: 'فاطمة العلي',
      lastUpdate: 'منذ يوم'
    },
    {
      id: 'CASE-2024-003',
      title: 'تحقيق مخالفة - شركة الاتصالات الذهبية',
      type: 'تحقيق مخالفة',
      industry: 'مشغل اتصالات',
      status: 'جمع أدلة',
      priority: 'عالية',
      daysRemaining: 22,
      progress: 45,
      assignee: 'محمد الزهراني',
      lastUpdate: 'منذ 3 ساعات'
    },
    {
      id: 'CASE-2024-004',
      title: 'تعديل ترخيص - شركة المحتوى الرقمي',
      type: 'تعديل',
      industry: 'مزود محتوى',
      status: 'مراجعة تقنية',
      priority: 'منخفضة',
      daysRemaining: 45,
      progress: 30,
      assignee: 'سارة القحطاني',
      lastUpdate: 'منذ 4 ساعات'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مراجعة أولية': return 'text-blue-600 bg-blue-100';
      case 'انتظار مستندات': return 'text-yellow-600 bg-yellow-100';
      case 'جمع أدلة': return 'text-orange-600 bg-orange-100';
      case 'مراجعة تقنية': return 'text-purple-600 bg-purple-100';
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
            <FileText className="h-8 w-8 text-green-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مساعد إدارة القضايا</h1>
              <p className="text-gray-600">إدارة تراخيص الاتصالات والتقنية</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">43</p>
              <p className="text-sm text-gray-500">قضية نشطة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">15</p>
              <p className="text-sm text-gray-500">تحتاج انتباه</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">28 يوم</p>
              <p className="text-sm text-gray-500">متوسط المعالجة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('new-case')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'new-case'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              قضية جديدة
            </button>
            <button
              onClick={() => setActiveTab('active-cases')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active-cases'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              القضايا النشطة
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              التحليلات
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'new-case' && (
            <div className="space-y-6">
              {!analysisResult ? (
                <>
                  {/* Case Type Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع القضية
                      </label>
                      <select
                        value={caseType}
                        onChange={(e) => setCaseType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="new-license">ترخيص جديد</option>
                        <option value="renewal">تجديد ترخيص</option>
                        <option value="violation">تحقيق مخالفة</option>
                        <option value="amendment">تعديل ترخيص</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        فئة الصناعة
                      </label>
                      <select
                        value={industryCategory}
                        onChange={(e) => setIndustryCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="telecom-operator">مشغل اتصالات</option>
                        <option value="isp">مزود خدمة إنترنت</option>
                        <option value="equipment-vendor">مورد معدات</option>
                        <option value="content-provider">مزود محتوى</option>
                        <option value="satellite-operator">مشغل أقمار صناعية</option>
                      </select>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رفع المستندات
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">اسحب وأفلت الملفات هنا أو انقر للاختيار</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-block"
                      >
                        اختيار الملفات
                      </label>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">الملفات المرفوعة:</p>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleAnalyzeCase}
                      disabled={uploadedFiles.length === 0 || isAnalyzing}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري التحليل...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          تحليل القضية
                        </>
                      )}
                    </button>
                  </div>

                  {isAnalyzing && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <h4 className="font-medium text-green-900">جاري تحليل القضية...</h4>
                          <p className="text-green-700 text-sm">
                            يتم الآن استخراج المعلومات وتحليل السوابق والتحقق من الامتثال
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Analysis Results */
                <div className="space-y-6">
                  {/* Extracted Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">المعلومات المستخرجة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-700 font-medium">اسم المتقدم</p>
                        <p className="text-green-900">{analysisResult.extractedInfo.applicantName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">نوع الترخيص</p>
                        <p className="text-green-900">{analysisResult.extractedInfo.licenseType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">منطقة التغطية</p>
                        <p className="text-green-900">{analysisResult.extractedInfo.coverage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">قيمة الاستثمار</p>
                        <p className="text-green-900">{analysisResult.extractedInfo.investmentAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Precedent Analysis */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">تحليل السوابق</h4>
                    <div className="space-y-4">
                      {analysisResult.precedentAnalysis.map((precedent: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900">#{precedent.caseId}</span>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              تشابه {precedent.similarity}%
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">النتيجة</p>
                              <p className="font-medium">{precedent.outcome}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">مدة المعالجة</p>
                              <p className="font-medium">{precedent.processingTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">الشروط</p>
                              <p className="font-medium">{precedent.conditions?.join(', ') || precedent.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Check */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">فحص الامتثال</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">المستندات الناقصة</h5>
                        <div className="space-y-2">
                          {analysisResult.complianceCheck.missingDocuments.map((doc: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-red-700 text-sm">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">التغييرات التنظيمية</h5>
                        <div className="space-y-2">
                          {analysisResult.complianceCheck.regulatoryChanges.map((change: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-700 text-sm">{change}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-4">التوصية</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-blue-900">{analysisResult.recommendation.decision}</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          ثقة {analysisResult.recommendation.confidence}%
                        </span>
                      </div>
                      <p className="text-blue-800">{analysisResult.recommendation.reasoning}</p>
                      
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">الشروط المطلوبة</h5>
                        <ul className="space-y-1">
                          {analysisResult.recommendation.conditions.map((condition: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span className="text-blue-800 text-sm">{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700 font-medium">الجدول الزمني المتوقع</p>
                          <p className="text-blue-900">{analysisResult.recommendation.timeline}</p>
                        </div>
                        <div>
                          <p className="text-blue-700 font-medium">المراجعة التالية</p>
                          <p className="text-blue-900">{analysisResult.recommendation.nextReview}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      قبول التوصية
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                      تعديل التوصية
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
                      طلب مراجعة إضافية
                    </button>
                    <button 
                      onClick={() => setAnalysisResult(null)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
                    >
                      قضية جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'active-cases' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في القضايا..."
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  تصفية
                </button>
              </div>

              {/* Cases List */}
              <div className="space-y-4">
                {activeCases.map((case_) => (
                  <div key={case_.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h4 className="font-semibold text-gray-900">{case_.title}</h4>
                        <span className="text-sm text-gray-500">#{case_.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">النوع</p>
                        <p className="font-medium">{case_.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الصناعة</p>
                        <p className="font-medium">{case_.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المسؤول</p>
                        <p className="font-medium">{case_.assignee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">آخر تحديث</p>
                        <p className="font-medium">{case_.lastUpdate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                          {case_.priority}
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{case_.daysRemaining} يوم متبقي</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">التقدم</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${case_.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{case_.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Processing Metrics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">مؤشرات المعالجة</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">متوسط وقت المعالجة</span>
                    <span className="font-semibold">28 يوم</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">معدل الموافقة</span>
                    <span className="font-semibold text-green-600">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">القضايا المعلقة</span>
                    <span className="font-semibold text-orange-600">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">دقة التوصيات</span>
                    <span className="font-semibold text-blue-600">91%</span>
                  </div>
                </div>
              </div>

              {/* Case Type Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">توزيع أنواع القضايا</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تراخيص جديدة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تجديدات</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تحقيقات</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تعديلات</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm font-medium">10%</span>
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

export default CaseManager;