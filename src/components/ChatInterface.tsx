import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Folder, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

interface ChatInterfaceProps {
  selectedFolderId?: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedFolderId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const folders = [
    { id: 'all', name: 'جميع المجلدات' },
    { id: 'folder-1', name: 'التقارير المالية' },
    { id: 'folder-2', name: 'الامتثال والحوكمة' },
    { id: 'folder-3', name: 'تقارير الأداء' }
  ];

  const auditResponses = [
    {
      keywords: ['مالي', 'ميزانية', 'إيرادات', 'مصروفات', 'ربح', 'خسارة'],
      responses: [
        'بناءً على تحليل التقارير المالية، يُلاحظ وجود تباين في الإيرادات المسجلة مقارنة بالفترة السابقة. يُنصح بمراجعة إجراءات الاعتراف بالإيرادات.',
        'تشير البيانات المالية إلى ضرورة تعزيز الرقابة الداخلية على المصروفات التشغيلية لضمان الامتثال للمعايير المحاسبية.',
        'من خلال فحص الميزانية العمومية، نوصي بإعادة تقييم السياسات المحاسبية المتعلقة بالأصول الثابتة.'
      ]
    },
    {
      keywords: ['امتثال', 'حوكمة', 'سياسات', 'لوائح', 'قانوني'],
      responses: [
        'تحليل إطار الحوكمة يُظهر الحاجة إلى تحديث السياسات الداخلية لتتماشى مع أحدث اللوائح التنظيمية.',
        'يُلاحظ وجود فجوات في تطبيق معايير الامتثال. نوصي بوضع خطة عمل لمعالجة هذه النقاط.',
        'مراجعة إجراءات الحوكمة تُشير إلى ضرورة تعزيز آليات الرقابة والمتابعة.'
      ]
    },
    {
      keywords: ['أداء', 'كفاءة', 'فعالية', 'مؤشرات', 'تقييم'],
      responses: [
        'تقييم مؤشرات الأداء يُظهر تحسناً في الكفاءة التشغيلية، مع وجود فرص للتطوير في بعض المجالات.',
        'تحليل البيانات يُشير إلى إمكانية تحسين الفعالية من خلال تطوير العمليات الداخلية.',
        'نتائج تقييم الأداء تتطلب وضع خطة تحسين شاملة لتحقيق الأهداف الاستراتيجية.'
      ]
    },
    {
      keywords: ['مخاطر', 'تقييم', 'إدارة', 'تحليل'],
      responses: [
        'تحليل المخاطر يُظهر ضرورة تطوير استراتيجية شاملة لإدارة المخاطر التشغيلية والمالية.',
        'تقييم المخاطر الحالي يتطلب تحديث المصفوفة وتحديد آليات التخفيف المناسبة.',
        'نوصي بإجراء مراجعة دورية لإطار إدارة المخاطر لضمان فعاليته.'
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const category of auditResponses) {
      if (category.keywords.some(keyword => lowerMessage.includes(keyword))) {
        const randomIndex = Math.floor(Math.random() * category.responses.length);
        return category.responses[randomIndex];
      }
    }
    
    // Default responses
    const defaultResponses = [
      'شكراً لاستفسارك. بناءً على المستندات المتاحة، يمكنني مساعدتك في تحليل البيانات وتقديم التوصيات المناسبة.',
      'لتقديم تحليل دقيق، يُرجى تحديد نوع التقرير أو المجال المطلوب مراجعته (مالي، امتثال، أداء، مخاطر).',
      'يمكنني مساعدتك في مراجعة المستندات وتحليلها وفقاً لمعايير المراجعة المعتمدة. ما هو التحليل المطلوب؟'
    ];
    
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return defaultResponses[randomIndex];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        citations: ['تقرير مالي 2024', 'سياسة الامتثال المحدثة']
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 ml-2 text-saudi-primary" />
            مساعد المراجعة الذكي
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-gray-500" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">مرحباً بك في مساعد المراجعة الذكي</p>
            <p className="text-sm">اسأل عن أي شيء متعلق بالمراجعة والامتثال والتحليل المالي</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-saudi-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {message.type === 'user' ? (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-saudi-primary" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  {message.citations && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">المراجع:</p>
                      {message.citations.map((citation, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {citation}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs opacity-70 text-left">
                {message.timestamp.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-saudi-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-saudi-primary focus:border-saudi-primary"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-saudi-primary text-white rounded-lg hover:bg-saudi-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;