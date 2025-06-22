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
  Globe,
  Target,
  Cpu
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'قضايا التراخيص النشطة',
      value: '43',
      change: '15 تحتاج انتباه',
      trend: 'neutral',
      icon: FileText,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    {
      title: 'تنبيهات الشبكة',
      value: '8',
      change: '2 حرجة',
      trend: 'down',
      icon: AlertTriangle,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600'
    },
    {
      title: 'قضايا الامتثال',
      value: '12',
      change: '3 أولوية عالية',
      trend: 'neutral',
      icon: Shield,
      color: 'from-saudi-primary to-saudi-secondary',
      bgColor: 'bg-saudi-light',
      textColor: 'text-saudi-primary'
    },
    {
      title: 'التحليلات الاجتماعية',
      value: '2,847',
      change: '+5.2% إيجابية',
      trend: 'up',
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  const solutions = [
    {
      id: 'resolve-ai',
      title: 'محرك ResolveAI',
      description: 'معالجة ذكية للشكاوى والاستفسارات مع تحليل متقدم للمحتوى والاستجابة التلقائية',
      status: 'نشط',
      activity: 'آخر معالجة: منذ دقيقتين',
      progress: 94,
      gradient: 'from-blue-500 to-blue-600',
      icon: MessageSquare,
      stats: { processed: '127', avgTime: '18 دقيقة', satisfaction: '94%' }
    },
    {
      id: 'case-manager',
      title: 'مساعد إدارة القضايا',
      description: 'إدارة تراخيص الاتصالات والتقنية مع تحليل السوابق والتوصيات الذكية',
      status: 'نشط',
      activity: 'قضية جديدة: منذ 15 دقيقة',
      progress: 87,
      gradient: 'from-violet-500 to-violet-600',
      icon: FileText,
      stats: { active: '43', pending: '15', avgDays: '28 يوم' }
    },
    {
      id: 'network-forecasting',
      title: 'توقعات الطلب على الشبكة',
      description: 'تحليل وتوقع احتياجات البنية التحتية للاتصالات باستخدام الذكاء الاصطناعي',
      status: 'معالجة',
      activity: 'تحليل منطقة الرياض جاري',
      progress: 76,
      gradient: 'from-amber-500 to-orange-600',
      icon: TrendingUp,
      stats: { regions: '5', alerts: '8', accuracy: '91%' }
    },
    {
      id: 'compliance-hub',
      title: 'مركز الامتثال',
      description: 'مراقبة وإنفاذ اللوائح التنظيمية للقطاع مع التحليل التلقائي للمخالفات',
      status: 'تنبيه',
      activity: 'مخالفة جديدة تحتاج مراجعة',
      progress: 91,
      gradient: 'from-rose-500 to-rose-600',
      icon: Shield,
      stats: { compliance: '87%', violations: '12', investigations: '3' }
    },
    {
      id: 'sentiment-analyzer',
      title: 'محلل المشاعر العامة',
      description: 'تحليل الرأي العام ووسائل التواصل الاجتماعي لقياس رضا المواطنين',
      status: 'نشط',
      activity: 'تحليل 2,847 منشور اليوم',
      progress: 98,
      gradient: 'from-emerald-500 to-emerald-600',
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
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      type: 'license',
      title: 'طلب ترخيص مشغل اتصالات جديد',
      time: 'منذ 15 دقيقة',
      priority: 'متوسطة',
      status: 'مراجعة أولية',
      icon: FileText,
      gradient: 'from-violet-500 to-violet-600'
    },
    {
      type: 'compliance',
      title: 'مخالفة امتثال - تأخير في التقارير',
      time: 'منذ 25 دقيقة',
      priority: 'عالية',
      status: 'تحقيق',
      icon: Shield,
      gradient: 'from-rose-500 to-rose-600'
    },
    {
      type: 'network',
      title: 'تنبيه شبكة - زيادة الحمولة في جدة',
      time: 'منذ 45 دقيقة',
      priority: 'متوسطة',
      status: 'مراقبة',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      type: 'sentiment',
      title: 'اتجاه إيجابي في المشاعر العامة',
      time: 'منذ ساعة',
      priority: 'منخفضة',
      status: 'مكتمل',
      icon: BarChart3,
      gradient: 'from-emerald-500 to-emerald-600'
    }
  ];

  const systemStats = [
    {
      label: 'حالة النظام',
      value: 'ممتاز',
      icon: Activity,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'معدل الاستجابة',
      value: '99.7%',
      icon: Zap,
      color: 'text-saudi-primary',
      bgColor: 'bg-saudi-light'
    },
    {
      label: 'المنصات المتصلة',
      value: '5',
      icon: Globe,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      label: 'المعالجات النشطة',
      value: '12',
      icon: Cpu,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
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
    <div className="space-section animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display mb-2">لوحة التحكم الرئيسية</h1>
          <p className="text-body">نظرة شاملة على جميع حلول الذكاء الاصطناعي والأنظمة المتصلة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700">جميع الأنظمة تعمل</span>
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {systemStats.map((stat, index) => (
          <div key={index} className="card p-4 text-center">
            <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid-modern grid-metrics mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="card-interactive p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.textColor}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-rose-500" />}
                {metric.trend === 'neutral' && <Clock className="h-4 w-4 text-slate-400" />}
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-800 mb-2">{metric.value}</h3>
            <p className="text-sm text-slate-600 mb-3 font-medium leading-relaxed">{metric.title}</p>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                metric.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 
                metric.trend === 'down' ? 'text-rose-700 bg-rose-100' : 'text-slate-600 bg-slate-100'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Solutions Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-heading mb-1">حلول الذكاء الاصطناعي</h2>
            <p className="text-caption">الأنظمة والخدمات المتاحة</p>
          </div>
          <button className="btn-secondary text-sm px-4 py-2">
            إدارة الحلول
          </button>
        </div>

        <div className="grid-modern grid-responsive">
          {solutions.map((solution, index) => (
            <div 
              key={solution.id}
              className="card-interactive p-6 group animate-slide-up"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
              onClick={() => onNavigate(solution.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${solution.gradient} shadow-soft`}>
                    <solution.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-saudi-primary transition-colors">
                      {solution.title}
                    </h3>
                  </div>
                </div>
                <span className={`badge text-xs font-medium ${getStatusColor(solution.status)}`}>
                  {solution.status}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">{solution.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-600 font-medium">الأداء</span>
                  <span className="font-bold text-slate-800">{solution.progress}%</span>
                </div>
                <div className="progress-container h-2">
                  <div 
                    className={`progress-bar bg-gradient-to-r ${solution.gradient}`}
                    style={{ width: `${solution.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Object.entries(solution.stats).map(([key, value], idx) => (
                  <div key={idx} className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-sm font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-500 mt-1">
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
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">{solution.activity}</p>
                <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-saudi-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-elevated animate-slide-up" style={{ animationDelay: '800ms' }}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-saudi-primary to-saudi-secondary rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-heading">النشاط الأخير</h2>
                <p className="text-caption mt-1">آخر التحديثات عبر جميع الأنظمة</p>
              </div>
            </div>
            <button className="btn-secondary text-sm px-4 py-2">
              عرض الكل
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${activity.gradient} shadow-soft`}>
                    <activity.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 group-hover:text-saudi-primary transition-colors mb-1">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">{activity.time}</span>
                      <span className={`badge text-xs ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                      <span className="text-sm text-slate-600 font-medium">{activity.status}</span>
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-saudi-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;