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
  Sparkles,
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
      {/* Welcome Section */}
      <div className="card-elevated bg-gradient-to-l from-saudi-primary via-saudi-secondary to-saudi-accent text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-display text-white mb-2">
                    مرحباً بك في منصة الحلول الذكية
                  </h1>
                  <p className="text-lg text-white/90 max-w-3xl leading-relaxed">
                    لوحة تحكم شاملة لإدارة ومراقبة جميع حلول الذكاء الاصطناعي للجنة الاتصالات والفضاء والتقنية
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-white/80" />
                    <div>
                      <p className="text-white font-semibold">جميع الأنظمة تعمل بكفاءة</p>
                      <p className="text-white/70 text-sm">حالة النظام: ممتازة</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-saudi-gold" />
                    <div>
                      <p className="text-white font-semibold">معدل الاستجابة: 99.7%</p>
                      <p className="text-white/70 text-sm">أداء متميز</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-white/80" />
                    <div>
                      <p className="text-white font-semibold">متصل بـ 5 منصات</p>
                      <p className="text-white/70 text-sm">تكامل شامل</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="/src/assets/cst-logo.svg" 
                alt="CST Logo" 
                className="h-32 w-auto opacity-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-modern grid-metrics">
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