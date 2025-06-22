import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Eye,
  FileText,
  Calendar,
  TrendingDown,
  TrendingUp,
  Users,
  Building,
  Clock,
  MoreVertical
} from 'lucide-react';

const ComplianceHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedRegulation, setSelectedRegulation] = useState('all');

  const complianceScores = [
    {
      operator: 'شركة الاتصالات السعودية',
      overallScore: 92,
      categories: {
        financial: 95,
        technical: 89,
        customer: 94,
        regulatory: 90
      },
      trend: 'up',
      lastAudit: '2024-01-15',
      violations: 2
    },
    {
      operator: 'شركة موبايلي',
      overallScore: 87,
      categories: {
        financial: 91,
        technical: 85,
        customer: 88,
        regulatory: 84
      },
      trend: 'down',
      lastAudit: '2024-01-10',
      violations: 4
    },
    {
      operator: 'شركة زين السعودية',
      overallScore: 89,
      categories: {
        financial: 88,
        technical: 92,
        customer: 87,
        regulatory: 89
      },
      trend: 'up',
      lastAudit: '2024-01-12',
      violations: 3
    },
    {
      operator: 'شركة الاتصالات المتقدمة',
      overallScore: 78,
      categories: {
        financial: 82,
        technical: 76,
        customer: 79,
        regulatory: 75
      },
      trend: 'down',
      lastAudit: '2024-01-08',
      violations: 7
    }
  ];

  const activeInvestigations = [
    {
      id: 'INV-2024-001',
      operator: 'شركة الاتصالات المتقدمة',
      violation: 'تأخير في تقديم التقارير المالية',
      severity: 'عالية',
      status: 'جمع أدلة',
      assignee: 'فريق التحقيق المالي',
      daysOpen: 15,
      evidence: 8,
      deadline: '2024-02-15'
    },
    {
      id: 'INV-2024-002',
      operator: 'شركة موبايلي',
      violation: 'عدم الالتزام بمعايير جودة الخدمة',
      severity: 'متوسطة',
      status: 'مراجعة أولية',
      assignee: 'فريق الجودة التقنية',
      daysOpen: 8,
      evidence: 12,
      deadline: '2024-02-20'
    },
    {
      id: 'INV-2024-003',
      operator: 'شركة زين السعودية',
      violation: 'مخالفة في أسعار الخدمات',
      severity: 'منخفضة',
      status: 'انتظار رد الشركة',
      assignee: 'فريق التسعير',
      daysOpen: 22,
      evidence: 5,
      deadline: '2024-02-10'
    }
  ];

  const upcomingAudits = [
    {
      operator: 'شركة الاتصالات السعودية',
      type: 'مراجعة دورية',
      date: '2024-02-05',
      focus: 'الامتثال المالي',
      auditor: 'أحمد المحمد',
      status: 'مجدولة'
    },
    {
      operator: 'شركة الاتصالات المتقدمة',
      type: 'مراجعة استثنائية',
      date: '2024-02-08',
      focus: 'جودة الخدمة',
      auditor: 'فاطمة العلي',
      status: 'قيد التحضير'
    },
    {
      operator: 'شركة موبايلي',
      type: 'متابعة مخالفات',
      date: '2024-02-12',
      focus: 'خدمة العملاء',
      auditor: 'محمد الزهراني',
      status: 'مجدولة'
    }
  ];

  const recentViolations = [
    {
      id: 'VIO-2024-015',
      operator: 'شركة الاتصالات المتقدمة',
      type: 'تأخير في التقارير',
      date: '2024-01-20',
      penalty: '500,000 ريال',
      status: 'مفروضة',
      compliance: 'قيد المتابعة'
    },
    {
      id: 'VIO-2024-014',
      operator: 'شركة موبايلي',
      type: 'انقطاع الخدمة',
      date: '2024-01-18',
      penalty: '1,200,000 ريال',
      status: 'مفروضة',
      compliance: 'مكتملة'
    },
    {
      id: 'VIO-2024-013',
      operator: 'شركة زين السعودية',
      type: 'مخالفة تسعير',
      date: '2024-01-15',
      penalty: '300,000 ريال',
      status: 'قيد المراجعة',
      compliance: 'انتظار'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'عالية': return 'text-red-600 bg-red-100';
      case 'متوسطة': return 'text-yellow-600 bg-yellow-100';
      case 'منخفضة': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جمع أدلة': return 'text-blue-600 bg-blue-100';
      case 'مراجعة أولية': return 'text-purple-600 bg-purple-100';
      case 'انتظار رد الشركة': return 'text-yellow-600 bg-yellow-100';
      case 'مكتملة': return 'text-green-600 bg-green-100';
      case 'قيد المتابعة': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مركز الامتثال</h1>
              <p className="text-gray-600">مراقبة وإنفاذ اللوائح التنظيمية</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-500">قضايا امتثال</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">3</p>
              <p className="text-sm text-gray-500">أولوية عالية</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">87%</p>
              <p className="text-sm text-gray-500">متوسط الامتثال</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              لوحة الامتثال
            </button>
            <button
              onClick={() => setActiveTab('investigations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'investigations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              التحقيقات النشطة
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              جدول المراجعات
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'violations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              المخالفات والعقوبات
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Compliance Scores */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">درجات الامتثال حسب المشغل</h4>
                
                <div className="space-y-4">
                  {complianceScores.map((operator, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <h5 className="font-medium text-gray-900">{operator.operator}</h5>
                          <div className="flex items-center gap-2">
                            {operator.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-2xl font-bold ${getScoreColor(operator.overallScore)}`}>
                              {operator.overallScore}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>آخر مراجعة: {operator.lastAudit}</span>
                          <span>المخالفات: {operator.violations}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">الامتثال المالي</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${operator.categories.financial}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{operator.categories.financial}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">الامتثال التقني</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${operator.categories.technical}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{operator.categories.technical}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">خدمة العملاء</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${operator.categories.customer}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{operator.categories.customer}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">الامتثال التنظيمي</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${operator.categories.regulatory}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{operator.categories.regulatory}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">156</p>
                      <p className="text-blue-700 text-sm">تقارير مراجعة</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-900">23</p>
                      <p className="text-yellow-700 text-sm">تحقيقات نشطة</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-900">8</p>
                      <p className="text-red-700 text-sm">مخالفات جديدة</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">92%</p>
                      <p className="text-green-700 text-sm">معدل الامتثال</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'investigations' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في التحقيقات..."
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">جميع المشغلين</option>
                  <option value="stc">الاتصالات السعودية</option>
                  <option value="mobily">موبايلي</option>
                  <option value="zain">زين</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  تصفية
                </button>
              </div>

              {/* Investigations List */}
              <div className="space-y-4">
                {activeInvestigations.map((investigation) => (
                  <div key={investigation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h4 className="font-semibold text-gray-900">{investigation.violation}</h4>
                        <span className="text-sm text-gray-500">#{investigation.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">المشغل</p>
                        <p className="font-medium">{investigation.operator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المسؤول</p>
                        <p className="font-medium">{investigation.assignee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الأدلة</p>
                        <p className="font-medium">{investigation.evidence} عنصر</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المدة</p>
                        <p className="font-medium">{investigation.daysOpen} يوم</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الموعد النهائي</p>
                        <p className="font-medium">{investigation.deadline}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(investigation.severity)}`}>
                        {investigation.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investigation.status)}`}>
                        {investigation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">المراجعات المجدولة</h4>
                
                <div className="space-y-4">
                  {upcomingAudits.map((audit, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">{audit.operator}</h5>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {audit.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">النوع</p>
                          <p className="font-medium">{audit.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">التاريخ</p>
                          <p className="font-medium">{audit.date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">التركيز</p>
                          <p className="font-medium">{audit.focus}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">المراجع</p>
                          <p className="font-medium">{audit.auditor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'violations' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">المخالفات والعقوبات الأخيرة</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم المخالفة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشغل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نوع المخالفة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الغرامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الامتثال</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentViolations.map((violation) => (
                        <tr key={violation.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {violation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {violation.operator}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {violation.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {violation.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">
                            {violation.penalty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                              {violation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.compliance)}`}>
                              {violation.compliance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceHub;