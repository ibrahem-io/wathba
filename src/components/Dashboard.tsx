import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const metrics = [
    {
      title: 'الشكاوى المعالجة اليوم',
      value: '127',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'قضايا التراخيص النشطة',
      value: '43',
      change: '15 تحتاج انتباه',
      trend: 'neutral',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'تنبيهات الشبكة',
      value: '8',
      change: '2 حرجة',
      trend: 'down',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'قضايا الامتثال',
      value: '12',
      change: '3 أولوية عالية',
      trend: 'neutral',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: 'التحليلات الاجتماعية',
      value: '2,847',
      change: '+5.2% إيجابية',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const solutions = [
    {
      id: 'resolve-ai',
      title: 'محرك ResolveAI',
      description: 'معالجة ذكية للشكاوى والاستفسارات',
      status: 'نشط',
      activity: 'آخر معالجة: منذ دقيقتين',
      progress: 94,
      color: 'green'
    },
    {
      id: 'case-manager',
      title: 'مساعد إدارة القضايا',
      description: 'إدارة تراخيص الاتصالات والتقنية',
      status: 'نشط',
      activity: 'قضية جديدة: منذ 15 دقيقة',
      progress: 87,
      color: 'blue'
    },
    {
      id: 'network-forecasting',
      title: 'توقعات الطلب على الشبكة',
      description: 'تحليل وتوقع احتياجات البنية التحتية',
      status: 'معالجة',
      activity: 'تحليل منطقة الرياض جاري',
      progress: 76,
      color: 'orange'
    },
    {
      id: 'compliance-hub',
      title: 'مركز الامتثال',
      description: 'مراقبة وإنفاذ اللوائح التنظيمية',
      status: 'تنبيه',
      activity: 'مخالفة جديدة تحتاج مراجعة',
      progress: 91,
      color: 'red'
    },
    {
      id: 'sentiment-analyzer',
      title: 'محلل المشاعر العامة',
      description: 'تحليل الرأي العام ووسائل التواصل',
      status: 'نشط',
      activity: 'تحليل 2,847 منشور اليوم',
      progress: 98,
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      type: 'complaint',
      title: 'شكوى جديدة - ضعف الشبكة في الرياض',
      time: 'منذ 3 دقائق',
      priority: 'عالية',
      status: 'قيد المعالجة'
    },
    {
      type: 'license',
      title: 'طلب ترخيص مشغل اتصالات جديد',
      time: 'منذ 15 دقيقة',
      priority: 'متوسطة',
      status: 'مراجعة أولية'
    },
    {
      type: 'compliance',
      title: 'مخالفة امتثال - تأخير في التقارير',
      time: 'منذ 25 دقيقة',
      priority: 'عالية',
      status: 'تحقيق'
    },
    {
      type: 'network',
      title: 'تنبيه شبكة - زيادة الحمولة في جدة',
      time: 'منذ 45 دقيقة',
      priority: 'متوسطة',
      status: 'مراقبة'
    },
    {
      type: 'sentiment',
      title: 'اتجاه إيجابي في المشاعر العامة',
      time: 'منذ ساعة',
      priority: 'منخفضة',
      status: 'مكتمل'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'text-green-600 bg-green-100';
      case 'معالجة': return 'text-orange-600 bg-orange-100';
      case 'تنبيه': return 'text-red-600 bg-red-100';
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في منصة الحلول الذكية</h1>
        <p className="text-green-100 mb-4">
          لوحة تحكم شاملة لإدارة ومراقبة جميع حلول الذكاء الاصطناعي للجنة الفضاء والاتصالات والتقنية
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm">جميع الأنظمة تعمل بكفاءة</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span className="text-sm">معدل الاستجابة: 99.7%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
            <p className={`text-xs font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* AI Solutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <div 
            key={solution.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onNavigate(solution.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{solution.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(solution.status)}`}>
                {solution.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{solution.description}</p>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">الأداء</span>
                <span className="font-medium">{solution.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-${solution.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${solution.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{solution.activity}</p>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">النشاط الأخير</h2>
          <p className="text-gray-600 text-sm">آخر التحديثات عبر جميع الأنظمة</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{activity.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                    <span className="text-gray-600">{activity.status}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;