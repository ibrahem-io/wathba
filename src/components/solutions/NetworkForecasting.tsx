import React, { useState } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Zap, 
  AlertTriangle,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  Eye
} from 'lucide-react';

const NetworkForecasting = () => {
  const [selectedRegion, setSelectedRegion] = useState('riyadh');
  const [timeframe, setTimeframe] = useState('3-months');
  const [serviceType, setServiceType] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forecastData, setForecastData] = useState<any>(null);

  const regions = [
    { id: 'riyadh', name: 'الرياض', population: '7.6M', coverage: '98%' },
    { id: 'jeddah', name: 'جدة', population: '4.7M', coverage: '97%' },
    { id: 'dammam', name: 'الدمام', population: '1.5M', coverage: '96%' },
    { id: 'mecca', name: 'مكة المكرمة', population: '2.0M', coverage: '99%' },
    { id: 'medina', name: 'المدينة المنورة', population: '1.3M', coverage: '98%' },
    { id: 'neom', name: 'نيوم', population: '0.1M', coverage: '85%' }
  ];

  const handleGenerateForecast = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const result = {
        region: selectedRegion,
        timeframe,
        serviceType,
        currentUtilization: {
          mobile: 78,
          fixed: 65,
          fiveG: 45,
          iot: 23
        },
        demandForecast: {
          mobile: { current: 78, predicted: 89, growth: '+14%' },
          fixed: { current: 65, predicted: 72, growth: '+11%' },
          fiveG: { current: 45, predicted: 68, growth: '+51%' },
          iot: { current: 23, predicted: 41, growth: '+78%' }
        },
        capacityRequirements: [
          {
            service: 'Mobile Data',
            currentCapacity: '2.5 Tbps',
            requiredCapacity: '3.2 Tbps',
            shortfall: '0.7 Tbps',
            priority: 'عالية',
            investment: '450 مليون ريال'
          },
          {
            service: '5G Network',
            currentCapacity: '1.2 Tbps',
            requiredCapacity: '2.1 Tbps',
            shortfall: '0.9 Tbps',
            priority: 'حرجة',
            investment: '680 مليون ريال'
          },
          {
            service: 'IoT Services',
            currentCapacity: '150 Gbps',
            requiredCapacity: '280 Gbps',
            shortfall: '130 Gbps',
            priority: 'متوسطة',
            investment: '120 مليون ريال'
          }
        ],
        riskScenarios: [
          {
            scenario: 'الأفضل',
            probability: 25,
            demandIncrease: '+8%',
            requiredInvestment: '800 مليون ريال'
          },
          {
            scenario: 'الأكثر احتمالاً',
            probability: 60,
            demandIncrease: '+15%',
            requiredInvestment: '1.25 مليار ريال'
          },
          {
            scenario: 'الأسوأ',
            probability: 15,
            demandIncrease: '+25%',
            requiredInvestment: '1.8 مليار ريال'
          }
        ],
        specialEvents: [
          {
            event: 'موسم الحج 2024',
            date: 'يونيو 2024',
            expectedIncrease: '+300%',
            region: 'مكة المكرمة',
            preparationStatus: 'جاري'
          },
          {
            event: 'اليوم الوطني',
            date: 'سبتمبر 2024',
            expectedIncrease: '+150%',
            region: 'جميع المناطق',
            preparationStatus: 'مخطط'
          },
          {
            event: 'تطوير نيوم',
            date: 'مستمر',
            expectedIncrease: '+500%',
            region: 'نيوم',
            preparationStatus: 'قيد التنفيذ'
          }
        ]
      };
      
      setForecastData(result);
      setIsAnalyzing(false);
    }, 3500);
  };

  const networkAlerts = [
    {
      id: 1,
      region: 'الرياض',
      type: 'capacity',
      severity: 'عالية',
      message: 'اقتراب الوصول للحد الأقصى للسعة في منطقة الملك فهد',
      time: 'منذ 15 دقيقة',
      utilization: 94
    },
    {
      id: 2,
      region: 'جدة',
      type: 'performance',
      severity: 'متوسطة',
      message: 'انخفاض في أداء الشبكة خلال ساعات الذروة',
      time: 'منذ 45 دقيقة',
      utilization: 87
    },
    {
      id: 3,
      region: 'الدمام',
      type: 'maintenance',
      severity: 'منخفضة',
      message: 'صيانة مجدولة للبنية التحتية',
      time: 'منذ ساعتين',
      utilization: 72
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'حرجة': return 'text-red-600 bg-red-100';
      case 'عالية': return 'text-orange-600 bg-orange-100';
      case 'متوسطة': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">توقعات الطلب على الشبكة</h1>
              <p className="text-gray-600">تحليل وتوقع احتياجات البنية التحتية</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-500">تنبيهات نشطة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">85%</p>
              <p className="text-sm text-gray-500">متوسط الاستخدام</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">99.2%</p>
              <p className="text-sm text-gray-500">توفر الخدمة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إعداد التوقعات</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name} ({region.population})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفترة الزمنية
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="30-days">30 يوم</option>
              <option value="3-months">3 أشهر</option>
              <option value="6-months">6 أشهر</option>
              <option value="1-year">سنة واحدة</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الخدمة
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">جميع الخدمات</option>
              <option value="mobile">البيانات المتنقلة</option>
              <option value="fixed">الإنترنت الثابت</option>
              <option value="5g">شبكة 5G</option>
              <option value="iot">خدمات إنترنت الأشياء</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleGenerateForecast}
              disabled={isAnalyzing}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحليل...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  إنشاء التوقعات
                </>
              )}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-medium text-orange-900">جاري تحليل البيانات...</h4>
                <p className="text-orange-700 text-sm">
                  يتم الآن تحليل أنماط الاستخدام التاريخية وتوقع الطلب المستقبلي
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Network Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Utilization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">الاستخدام الحالي</h4>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">البيانات المتنقلة</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">الإنترنت الثابت</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">شبكة 5G</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">إنترنت الأشياء</span>
                <span className="font-semibold">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">تنبيهات الشبكة</h4>
          
          <div className="space-y-3">
            {networkAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-900">{alert.region}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{alert.time}</span>
                  <span>الاستخدام: {alert.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Results */}
      {forecastData && (
        <div className="space-y-6">
          {/* Demand Forecast */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">توقعات الطلب</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(forecastData.demandForecast).map(([service, data]: [string, any]) => (
                <div key={service} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    {service === 'mobile' ? 'البيانات المتنقلة' :
                     service === 'fixed' ? 'الإنترنت الثابت' :
                     service === 'fiveG' ? 'شبكة 5G' : 'إنترنت الأشياء'}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الحالي</span>
                      <span className="font-medium">{data.current}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">المتوقع</span>
                      <span className="font-medium">{data.predicted}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">النمو</span>
                      <span className="font-medium text-green-600">{data.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">متطلبات السعة</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الخدمة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعة الحالية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعة المطلوبة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النقص</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأولوية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاستثمار المطلوب</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forecastData.capacityRequirements.map((req: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{req.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.currentCapacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.requiredCapacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">{req.shortfall}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{req.investment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Scenarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">سيناريوهات المخاطر</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastData.riskScenarios.map((scenario: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{scenario.scenario}</h5>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {scenario.probability}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">زيادة الطلب</span>
                      <span className="font-medium">{scenario.demandIncrease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الاستثمار المطلوب</span>
                      <span className="font-medium">{scenario.requiredInvestment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">الأحداث الخاصة</h4>
            
            <div className="space-y-4">
              {forecastData.specialEvents.map((event: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{event.event}</h5>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">المنطقة: </span>
                      <span className="font-medium">{event.region}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">الزيادة المتوقعة: </span>
                      <span className="font-medium text-orange-600">{event.expectedIncrease}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">حالة التحضير: </span>
                      <span className="font-medium">{event.preparationStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2">
              <Download className="h-5 w-5" />
              تصدير التقرير
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              إنشاء تنبيهات
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
              مشاركة النتائج
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkForecasting;