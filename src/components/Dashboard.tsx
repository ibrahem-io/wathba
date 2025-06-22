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
  ArrowLeft,
  BarChart3,
  Shield,
  MessageSquare,
  FileText,
  Globe
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
      icon: MessageSquare,
      color: 'cst-blue-primary',
      bgColor: 'cst-blue-light'
    },
    {
      title: 'قضايا التراخيص النشطة',
      value: '43',
      change: '15 تحتاج انتباه',
      trend: 'neutral',
      icon: FileText,
      color: 'cst-accent',
      bgColor: 'yellow-50'
    },
    {
      title: 'تنبيهات الشبكة',
      value: '8',
      change: '2 حرجة',
      trend: 'down',
      icon: AlertTriangle,
      color: 'status-error',
      bgColor: 'red-50'
    },
    {
      title: 'قضايا الامتثال',
      value: '12',
      change: '3 أولوية عالية',
      trend: 'neutral',
      icon: Shield,
      color: 'cst-primary',
      bgColor: 'cst-light'
    },
    {
      title: 'التحليلات الاجتماعية',
      value: '2,847',
      change: '+5.2% إيجابية',
      trend: 'up',
      icon: BarChart3,
      color: 'purple-600',
      bgColor: 'purple-50'
    }
  ];

  const solutions = [
    {
      id: 'resolve-ai',
      title: 'محرك ResolveAI',
      description: 'معالجة ذكية للشكاوى والاستفسارات مع تحليل متقدم للمحتوى',
      status: 'نشط',
      activity: 'آخر معالجة: منذ دقيقتين',
      progress: 94,
      color: 'blue',
      icon: MessageSquare,
      stats: { processed: '127', avgTime: '18 دقيقة', satisfaction: '94%' }
    },
    {
      id: 'case-manager',
      title: 'مساعد إدارة القضايا',
      description: 'إدارة تراخيص الاتصالات والتقنية مع تحليل السوابق',
      status: 'نشط',
      activity: 'قضية جديدة: منذ 15 دقيقة',
      progress: 87,
      color: 'green',
      icon: FileText,
      stats: { active: '43', pending: '15', avgDays: '28 يوم' }
    },
    {
      id: 'network-forecasting',
      title: 'توقعات الطلب على الشبكة',
      description: 'تحليل وتوقع احتياجات البنية التحتية للاتصالات',
      status: 'معالجة',
      activity: 'تحليل منطقة الرياض جاري',
      progress: 76,
      color: 'orange',
      icon: TrendingUp,
      stats: { regions: '5', alerts: '8', accuracy: '91%' }
    },
    {
      id: 'compliance-hub',
      title: 'مركز الامتثال',
      description: 'مراقبة وإنفاذ اللوائح التنظيمية للقطاع',
      status: 'تنبيه',
      activity: 'مخالفة جديدة تحتاج مراجعة',
      progress: 91,
      color: 'red',
      icon: Shield,
      stats: { compliance: '87%', violations: '12', investigations: '3' }
    },
    {
      id: 'sentiment-analyzer',
      title: 'محلل المشاعر العامة',
      description: 'تحليل الرأي العام ووسائل التواصل الاجتماعي',
      status: 'نشط',
      activity: 'تحليل 2,847 منشور اليوم',
      progress: 98,
      color: 'purple',
      icon: BarChart3,
      stats: { mentions: '2.8K', sentiment: '+5.2%', platforms: '5' }
    }
  ];

  const recentActivity = [
    {
      type: 'complaint',
      title: 'شكوى جديدة - ضعف الشبكة في الرياض',
      time: 'منذ 3 دقائق',
      priority: 'عالية',
      status: 'قيد المعالجة',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      type: 'license',
      title: 'طلب ترخيص مشغل اتصالات جديد',
      time: 'منذ 15 دقيقة',
      priority: 'متوسطة',
      status: 'مراجعة أولية',
      icon: FileText,
      color: 'green'
    },
    {
      type: 'compliance',
      title: 'مخالفة امتثال - تأخير في التقارير',
      time: 'منذ 25 دقيقة',
      priority: 'عالية',
      status: 'تحقيق',
      icon: Shield,
      color: 'red'
    },
    {
      type: 'network',
      title: 'تنبيه شبكة - زيادة الحمولة في جدة',
      time: 'منذ 45 دقيقة',
      priority: 'متوسطة',
      status: 'مراقبة',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      type:  'sentiment',
      title: 'اتجاه إيجابي في المشاعر العامة',
      time: 'منذ ساعة',
      priority: 'منخفضة',
      status: 'مكتمل',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'status-success';
      case 'معالجة': return 'status-warning';
      case 'تنبيه': return 'status-error';
      default: return 'status-info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'status-error';
      case 'متوسطة': return 'status-warning';
      case 'منخفضة': return 'status-success';
      default: return 'status-info';
    }
  };

  return (
    <div className="space-government animate-fade-in">
      {/* Welcome Section */}
      <div className="card-government-elevated bg-gradient-to-l from-cst-primary to-cst-secondary text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-hierarchy-h1 text-white mb-3">
              مرحباً بك في منصة الحلول الذكية
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              لوحة تحكم شاملة لإدارة ومراقبة جميع حلول الذكاء الاصطناعي للجنة الاتصالات والفضاء والتقنية
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-white/80" />
                <span className="text-white/90">جميع الأنظمة تعمل بكفاءة</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cst-accent" />
                <span className="text-white/90">معدل الاستجابة: 99.7%</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-white/80" />
                <span className="text-white/90">متصل بـ 5 منصات</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="/src/assets/cst-logo.svg" 
              alt="CST Logo" 
              className="h-24 w-auto opacity-20"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-government-lg">
        {metrics.map((metric, index) => (
          <div key={index} className="card-government p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-government-lg bg-${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}`} />
              </div>
              {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-status-success" />}
              {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-status-error" />}
              {metric.trend === 'neutral' && <Clock className="h-4 w-4 text-cst-gray-400" />}
            </div>
            <h3 className="text-3xl font-bold text-cst-dark mb-2">{metric.value}</h3>
            <p className="text-sm text-cst-gray-600 mb-2 font-medium">{metric.title}</p>
            <p className={`text-xs font-medium ${
              metric.trend === 'up' ? 'text-status-success' : 
              metric.trend === 'down' ? 'text-status-error' : 'text-cst-gray-600'
            }`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* AI Solutions Grid */}
      <div className="grid-government-md">
        {solutions.map((solution, index) => (
          <div 
            key={solution.id}
            className="card-government p-6 hover:shadow-government-lg transition-all duration-300 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${(index + 5) * 100}ms` }}
            onClick={() => onNavigate(solution.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-government bg-${solution.color}-50`}>
                  <solution.icon className={`h-5 w-5 text-${solution.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-cst-dark group-hover:text-cst-primary transition-colors">
                  {solution.title}
                </h3>
              </div>
              <span className={`badge-government px-3 py-1 text-xs font-medium ${getStatusColor(solution.status)}`}>
                {solution.status}
              </span>
            </div>
            
            <p className="text-cst-gray-600 text-sm mb-4 leading-relaxed">{solution.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-cst-gray-600">الأداء</span>
                <span className="font-semibold text-cst-dark">{solution.progress}%</span>
              </div>
              <div className="progress-bar h-2">
                <div 
                  className={`progress-fill bg-${solution.color}-500`}
                  style={{ width: `${solution.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(solution.stats).map(([key, value], idx) => (
                <div key={idx} className="text-center">
                  <p className="text-sm font-semibold text-cst-dark">{value}</p>
                  <p className="text-xs text-cst-gray-500">
                    {key === 'processed' ? 'معالج' :
                     key === 'avgTime' ? 'متوسط الوقت' :
                     key === 'satisfaction' ? 'الرضا' :
                     key === 'active' ? 'نشط' :
                     key === 'pending' ? 'معلق' :
                     key === 'avgDays' ? 'متوسط الأيام' :
                     key === 'regions' ? 'المناطق' :
                     key === 'alerts' ? 'التنبيهات' :
                     key === 'accuracy' ? 'الدقة' :
                     key === 'compliance' ? 'الامتثال' :
                     key === 'violations' ? 'المخالفات' :
                     key === 'investigations' ? 'التحقيقات' :
                     key === 'mentions' ? 'الإشارات' :
                     key === 'sentiment' ? 'المشاعر' :
                     key === 'platforms' ? 'المنصات' : key}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-cst-gray-500">{solution.activity}</p>
              <ArrowLeft className="h-4 w-4 text-cst-gray-400 group-hover:text-cst-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card-government animate-slide-up" style={{ animationDelay: '800ms' }}>
        <div className="p-6 border-b border-cst-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-hierarchy-h3">النشاط الأخير</h2>
              <p className="text-hierarchy-caption mt-1">آخر التحديثات عبر جميع الأنظمة</p>
            </div>
            <button className="btn-government-secondary text-sm px-4 py-2">
              عرض الكل
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-cst-gray-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-cst-gray-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-government bg-${activity.color}-50 group-hover:bg-${activity.color}-100 transition-colors`}>
                    <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-cst-dark group-hover:text-cst-primary transition-colors">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-cst-gray-500">{activity.time}</span>
                      <span className={`badge-government text-xs ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                      <span className="text-sm text-cst-gray-600">{activity.status}</span>
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 text-cst-gray-400 group-hover:text-cst-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;