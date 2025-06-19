import { BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, XCircle, FileText, Calendar } from 'lucide-react';

const AuditDashboard = () => {
  const riskData = [
    { level: 'منخفض', count: 45, color: 'bg-green-500', percentage: 60 },
    { level: 'متوسط', count: 23, color: 'bg-yellow-500', percentage: 31 },
    { level: 'عالي', count: 7, color: 'bg-red-500', percentage: 9 }
  ];

  const categoryData = [
    { name: 'مالي', count: 28, color: 'bg-blue-500' },
    { name: 'قانوني', count: 15, color: 'bg-green-500' },
    { name: 'تشغيلي', count: 12, color: 'bg-purple-500' },
    { name: 'امتثال', count: 10, color: 'bg-orange-500' },
    { name: 'مخاطر', count: 8, color: 'bg-red-500' },
    { name: 'أداء', count: 7, color: 'bg-indigo-500' }
  ];

  const recentUploads = [
    { name: 'تقرير الميزانية Q4', date: '2024-01-15', risk: 'low' },
    { name: 'سياسة الامتثال المحدثة', date: '2024-01-14', risk: 'medium' },
    { name: 'تحليل المخاطر التشغيلية', date: '2024-01-13', risk: 'high' },
    { name: 'قائمة الدخل الشهرية', date: '2024-01-12', risk: 'low' },
    { name: 'تقرير الحوكمة', date: '2024-01-11', risk: 'medium' }
  ];

  const complianceStatus = [
    { folder: 'التقارير المالية', status: 'compliant', documents: 13 },
    { folder: 'الامتثال والحوكمة', status: 'warning', documents: 8 },
    { folder: 'تقارير الأداء', status: 'compliant', documents: 7 },
    { folder: 'إدارة المخاطر', status: 'non-compliant', documents: 5 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: string) => {
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`}>
        {labels[risk as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">لوحة المراجعة والامتثال</h2>
        <p className="text-gray-600">نظرة شاملة على حالة المراجعة والمخاطر والامتثال</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-900">75</p>
              <p className="text-gray-600">إجمالي المستندات</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-gray-600">مخاطر عالية</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-gray-600">معدل الامتثال</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-saudi-primary" />
            <div className="mr-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600">تحديثات هذا الشهر</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-saudi-primary ml-2" />
            <h3 className="text-lg font-semibold text-gray-900">توزيع المخاطر</h3>
          </div>
          <div className="space-y-4">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color} ml-3`}></div>
                  <span className="text-gray-700">{item.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-medium w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-6 w-6 text-saudi-primary ml-2" />
            <h3 className="text-lg font-semibold text-gray-900">توزيع التصنيفات</h3>
          </div>
          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} ml-3`}></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-saudi-primary ml-2" />
            <h3 className="text-lg font-semibold text-gray-900">آخر التحديثات</h3>
          </div>
          <div className="space-y-3">
            {recentUploads.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                {getRiskBadge(item.risk)}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-saudi-primary ml-2" />
            <h3 className="text-lg font-semibold text-gray-900">حالة الامتثال</h3>
          </div>
          <div className="space-y-3">
            {complianceStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-900">{item.folder}</p>
                    <p className="text-xs text-gray-500">{item.documents} مستندات</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">تقرير المراجعة الشامل</h3>
            <p className="text-gray-600">إنشاء تقرير PDF شامل لحالة المراجعة والامتثال</p>
          </div>
          <button className="bg-saudi-primary text-white px-6 py-3 rounded-lg hover:bg-saudi-secondary transition-colors flex items-center">
            <FileText className="h-5 w-5 ml-2" />
            إنشاء التقرير
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;