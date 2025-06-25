import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, AlertCircle, FileText, Sparkles, Clock } from 'lucide-react';
import openaiService from '../services/openaiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
  isStreaming?: boolean;
}

interface RAGChatInterfaceProps {
  assistantReady?: boolean;
  uploadedFilesCount?: number;
}

const RAGChatInterface: React.FC<RAGChatInterfaceProps> = ({ 
  assistantReady = false, 
  uploadedFilesCount = 0 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا المساعد الذكي لوزارة المالية. يمكنني مساعدتك في البحث والاستفسار عن المستندات المرفوعة. ارفع بعض الوثائق أولاً ثم اسألني عن أي شيء تريد معرفته.',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (assistantReady && uploadedFilesCount > 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `تم رفع ${uploadedFilesCount} ملف${uploadedFilesCount > 1 ? 'ات' : ''} بنجاح! 🎉\n\nيمكنك الآن طرح أسئلة حول محتوى هذه الوثائق. على سبيل المثال:\n• ما هي السياسات المالية المذكورة؟\n• اشرح لي الإجراءات المحاسبية\n• ما هي المتطلبات الواردة في الوثائق؟`,
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        // Don't add if we already have a similar message
        const hasWelcome = prev.some(msg => msg.content.includes('تم رفع'));
        return hasWelcome ? prev : [...prev, welcomeMessage];
      });
    }
  }, [assistantReady, uploadedFilesCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!assistantReady) {
      setError('يرجى انتظار تهيئة المساعد الذكي أولاً');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Add streaming placeholder
    const streamingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, streamingMessage]);

    try {
      const response = await openaiService.sendMessage(inputMessage, threadId || undefined);
      
      // Update the streaming message with actual response
      setMessages(prev => prev.map(msg => 
        msg.isStreaming 
          ? {
              ...msg,
              content: response.content,
              citations: response.citations,
              isStreaming: false
            }
          : msg
      ));

      // Store thread ID for conversation continuity
      if (response.threadId) {
        setThreadId(response.threadId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
      
      // Remove streaming message and add error message
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const suggestedQuestions = [
    'ما هي السياسات المالية الواردة في الوثائق؟',
    'اشرح لي الإجراءات المحاسبية المذكورة',
    'ما هي متطلبات الامتثال في الوثائق؟',
    'لخص أهم النقاط في التقارير المالية'
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Bot className="h-6 w-6 ml-2 text-saudi-green" />
            المساعد الذكي - RAG
          </h2>
          <div className="flex items-center text-sm">
            {assistantReady ? (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                متصل
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <Clock className="w-4 h-4 ml-2 animate-spin" />
                جاري التهيئة...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="h-4 w-4 text-saudi-green" />
          <span>مدعوم بـ OpenAI GPT-4</span>
          {uploadedFilesCount > 0 && (
            <>
              <span>•</span>
              <FileText className="h-4 w-4" />
              <span>{uploadedFilesCount} ملف مرفوع</span>
            </>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 ml-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && uploadedFilesCount === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">مرحباً بك في المساعد الذكي</p>
            <p className="text-sm mb-4">ارفع بعض المستندات أولاً لتتمكن من الاستفسار عن محتواها</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• يدعم ملفات PDF، Word، Excel، TXT</p>
              <p>• يحلل المحتوى ويجيب على الأسئلة</p>
              <p>• يقدم مراجع من الوثائق المرفوعة</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-saudi-green text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {message.type === 'user' ? (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-saudi-green" />
                )}
                <div className="flex-1">
                  <div className="text-sm whitespace-pre-wrap">
                    {message.isStreaming ? (
                      <div className="flex items-center gap-2">
                        <span>جاري الكتابة</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2 font-medium">المراجع:</p>
                      <div className="space-y-1">
                        {message.citations.map((citation, index) => (
                          <div
                            key={index}
                            className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200"
                          >
                            📄 {citation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs opacity-70 text-left mt-2">
                {message.timestamp.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && uploadedFilesCount > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs text-gray-600 mb-2">أسئلة مقترحة:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              assistantReady 
                ? uploadedFilesCount > 0 
                  ? "اسأل عن محتوى الوثائق المرفوعة..."
                  : "ارفع بعض المستندات أولاً..."
                : "يرجى انتظار تهيئة المساعد..."
            }
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-saudi-green focus:border-saudi-green"
            rows={2}
            disabled={isLoading || !assistantReady}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !assistantReady}
            className="px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-saudi-green-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          مدعوم بـ OpenAI Assistant API • اضغط Enter للإرسال
        </p>
      </div>
    </div>
  );
};

export default RAGChatInterface;