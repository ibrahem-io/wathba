import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  MessageCircle,
  Heart,
  Frown,
  Meh,
  Smile,
  MapPin,
  Calendar,
  Users,
  Hash,
  ExternalLink,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

const SentimentAnalyzer = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [platform, setPlatform] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sentimentData = {
    overall: {
      positive: 34,
      neutral: 41,
      negative: 25,
      totalMentions: 2847,
      trend: '+5.2%'
    },
    byPlatform: [
      { platform: 'Twitter', mentions: 1245, positive: 32, neutral: 43, negative: 25 },
      { platform: 'Instagram', mentions: 687, positive: 38, neutral: 39, negative: 23 },
      { platform: 'LinkedIn', mentions: 423, positive: 41, neutral: 37, negative: 22 },
      { platform: 'News', mentions: 312, positive: 28, neutral: 45, negative: 27 },
      { platform: 'Forums', mentions: 180, positive: 35, neutral: 40, negative: 25 }
    ],
    byTopic: [
      { topic: 'جودة الشبكة', mentions: 856, sentiment: 'negative', score: -0.3 },
      { topic: 'خدمة العملاء', mentions: 634, sentiment: 'neutral', score: 0.1 },
      { topic: 'الأسعار', mentions: 512, sentiment: 'negative', score: -0.2 },
      { topic: 'تقنية 5G', mentions: 445, sentiment: 'positive', score: 0.4 },
      { topic: 'التغطية', mentions: 400, sentiment: 'neutral', score: 0.0 }
    ],
    byRegion: [
      { region: 'الرياض', mentions: 892, sentiment: 0.1, trend: 'up' },
      { region: 'جدة', mentions: 634, sentiment: -0.1, trend: 'down' },
      { region: 'الدمام', mentions: 423, sentiment: 0.2, trend: 'up' },
      { region: 'مكة المكرمة', mentions: 356, sentiment: 0.0, trend: 'stable' },
      { region: 'المدينة المنورة', mentions: 287, sentiment: 0.1, trend: 'up' }
    ]
  };

  const recentMentions = [
    {
      id: 1,
      platform: 'Twitter',
      author: '@user123',
      content: 'شبكة 5G في الرياض ممتازة! سرعة عالية واستقرار في الاتصال',
      sentiment: 'positive',
      score: 0.8,
      time: 'منذ 5 دقائق',
      engagement: 23,
      location: 'الرياض'
    },
    {
      id: 2,
      platform: 'Instagram',
      author: '@techuser',
      content: 'انقطاع متكرر في الإنترنت هذا الأسبوع، نحتاج حلول سريعة',
      sentiment: 'negative',
      score: -0.6,
      time: 'منذ 12 دقيقة',
      engagement: 45,
      location: 'جدة'
    },
    {
      id: 3,
      platform: 'LinkedIn',
      author: 'أحمد المحمد',
      content: 'تطور ملحوظ في خدمات الاتصالات السعودية خلال العام الماضي',
      sentiment: 'positive',
      score: 0.5,
      time: 'منذ 25 دقيقة',
      engagement: 67,
      location: 'الدمام'
    },
    {
      id: 4,
      platform: 'News',
      author: 'صحيفة الاقتصادية',
      content: 'CSTC تعلن عن مبادرات جديدة لتحسين جودة خدمات الاتصالات',
      sentiment: 'positive',
      score: 0.7,
      time: 'منذ 45 دقيقة',
      engagement: 156,
      location: 'عام'
    },
    {
      id: 5,
      platform: 'Forums',
      author: 'مستخدم تقني',
      content: 'أسعار الباقات مرتفعة مقارنة بالخدمات المقدمة',
      sentiment: 'negative',
      score: -0.4,
      time: 'منذ ساعة',
      engagement: 34,
      location: 'الرياض'
    }
  ];

  const influencers = [
    {
      name: 'د. محمد التقني',
      platform: 'Twitter',
      followers: '245K',
      influence: 'عالية',
      recentMention: 'تقييم إيجابي لخدمات 5G',
      sentiment: 'positive'
    },
    {
      name: 'قناة التقنية السعودية',
      platform: 'YouTube',
      followers: '180K',
      influence: 'عالية',
      recentMention: 'مراجعة شاملة لمشغلي الاتصالات',
      sentiment: 'neutral'
    },
    {
      name: 'مدونة الاتصالات',
      platform: 'Blog',
      followers: '95K',
      influence: 'متوسطة',
      recentMention: 'انتقاد لأسعار الخدمات',
      sentiment: 'negative'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <Frown className="h-5 w-5 text-red-500" />;
      default:
        return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return <Hash className="h-4 w-4" />;
      case 'Instagram':
        return <Heart className="h-4 w-4" />;
      case 'LinkedIn':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">محلل المشاعر العامة</h1>
              <p className="text-gray-600">تحليل الرأي العام ووسائل التواصل الاجتماعي</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">2,847</p>
              <p className="text-sm text-gray-500">إشارات اليوم</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+5.2%</p>
              <p className="text-sm text-gray-500">اتجاه إيجابي</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">34%</p>
              <p className="text-sm text-gray-500">مشاعر إيجابية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
            </select>
            
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">جميع المنصات</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="news">الأخبار</option>
              <option value="forums">المنتديات</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              تصفية متقدمة
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-5 w-5" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">توزيع المشاعر العامة</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Smile className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">إيجابية</span>
                </div>
                <span className="font-semibold text-green-600">{sentimentData.overall.positive}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${sentimentData.overall.positive}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Meh className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">محايدة</span>
                </div>
                <span className="font-semibold text-yellow-600">{sentimentData.overall.neutral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${sentimentData.overall.neutral}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Frown className="h-5 w-5 text-red-500" />
                  <span className="text-gray-700">سلبية</span>
                </div>
                <span className="font-semibold text-red-600">{sentimentData.overall.negative}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${sentimentData.overall.negative}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-900 font-medium">إجمالي الإشارات</p>
                <p className="text-2xl font-bold text-purple-900">{sentimentData.overall.totalMentions.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">{sentimentData.overall.trend}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">توزيع المنصات</h4>
          
          <div className="space-y-4">
            {sentimentData.byPlatform.map((platform, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(platform.platform)}
                    <span className="font-medium text-gray-900">{platform.platform}</span>
                  </div>
                  <span className="text-sm text-gray-500">{platform.mentions}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-green-600 font-medium">{platform.positive}%</p>
                    <p className="text-gray-500">إيجابية</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-600 font-medium">{platform.neutral}%</p>
                    <p className="text-gray-500">محايدة</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600 font-medium">{platform.negative}%</p>
                    <p className="text-gray-500">سلبية</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics and Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">المواضيع الأكثر تداولاً</h4>
          
          <div className="space-y-3">
            {sentimentData.byTopic.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {getSentimentIcon(topic.sentiment)}
                  <div>
                    <p className="font-medium text-gray-900">{topic.topic}</p>
                    <p className="text-sm text-gray-500">{topic.mentions} إشارة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    topic.score > 0 ? 'text-green-600' : 
                    topic.score < 0 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {topic.score > 0 ? '+' : ''}{topic.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">التحليل الجغرافي</h4>
          
          <div className="space-y-3">
            {sentimentData.byRegion.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{region.region}</p>
                    <p className="text-sm text-gray-500">{region.mentions} إشارة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {region.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {region.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  <span className={`text-sm font-medium ${
                    region.sentiment > 0 ? 'text-green-600' : 
                    region.sentiment < 0 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {region.sentiment > 0 ? '+' : ''}{region.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Mentions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">الإشارات الأخيرة</h4>
        
        <div className="space-y-4">
          {recentMentions.map((mention) => (
            <div key={mention.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPlatformIcon(mention.platform)}
                  <div>
                    <p className="font-medium text-gray-900">{mention.author}</p>
                    <p className="text-sm text-gray-500">{mention.platform} • {mention.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(mention.sentiment)}`}>
                    {mention.sentiment === 'positive' ? 'إيجابية' : 
                     mention.sentiment === 'negative' ? 'سلبية' : 'محايدة'}
                  </span>
                  <span className="text-sm text-gray-500">{mention.score}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{mention.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>📍 {mention.location}</span>
                  <span>💬 {mention.engagement} تفاعل</span>
                </div>
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" />
                  عرض
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Influencers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">المؤثرون الرئيسيون</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {influencers.map((influencer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900">{influencer.name}</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {influencer.influence}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المنصة</span>
                  <span className="font-medium">{influencer.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">المتابعون</span>
                  <span className="font-medium">{influencer.followers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">آخر إشارة</span>
                  {getSentimentIcon(influencer.sentiment)}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-3">{influencer.recentMention}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;