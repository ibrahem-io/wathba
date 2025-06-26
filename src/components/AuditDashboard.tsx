import { BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle, XCircle, FileText, Calendar, Award, Shield } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-l from-green-700 to-green-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Decorative circles pattern */}
            <div className="absolute top-4 left-4 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-12 left-12 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-12 right-12 w-28 h-28 border border-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">تميز</h1>
              <h2 className="text-5xl font-bold mb-4">مؤسسي ورقمي</h2>
              <p className="text-xl text-green-100 max-w-2xl">
                منصة المراجعة الرقمية المتطورة للديوان العام للمحاسبة - نحو مستقبل رقمي متميز في الرقابة والمراجعة
              </p>
              <div className="flex space-x-2 space-x-reverse mt-6">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/src/assets/images/gca-logo copy.svg"
                alt="شعار الديوان"
                className="h-32 w-auto opacity-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">75</p>
              <p className="text-gray-600 font-medium">إجمالي المستندات</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">7</p>
              <p className="text-gray-600 font-medium">مخاطر عالية</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">85%</p>
              <p className="text-gray-600 font-medium">معدل الامتثال</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-gray-600 font-medium">تحديثات هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">توزيع المخاطر</h3>
          </div>
          <div className="space-y-4">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color} ml-3`}></div>
                  <span className="text-gray-700 font-medium">{item.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">توزيع التصنيفات</h3>
          </div>
          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} ml-3`}></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Uploads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">آخر التحديثات</h3>
          </div>
          <div className="space-y-3">
            {recentUploads.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
                {getRiskBadge(item.risk)}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">حالة الامتثال</h3>
          </div>
          <div className="space-y-3">
            {complianceStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

      {/* Services Section */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">الخدمات الإلكترونية</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            استفد من مجموعة شاملة من الخدمات الرقمية المتطورة لتعزيز كفاءة عمليات المراجعة والرقابة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">المكتبة الرقمية للأرشيف (وثيقة)</h3>
                <p className="text-gray-600 text-sm">Digital Library for Archives (Wathiqa)</p>
              </div>
              <img
                src="/src/assets/images/gca-logo copy.svg"
                alt="شعار الخدمة"
                className="h-12 w-auto opacity-60"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              ابدأ الخدمة
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">منصة المراجعة الرقمية (شامل)</h3>
                <p className="text-gray-600 text-sm">Digital Audit Platform (Shamel)</p>
              </div>
              <img
                src="/src/assets/images/gca-logo copy.svg"
                alt="شعار الخدمة"
                className="h-12 w-auto opacity-60"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              ابدأ الخدمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;