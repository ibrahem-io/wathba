import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Upload,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  FileText,
  Paperclip,
  Mic,
  MicOff
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatMessage, Document } from '../types';
import { mockChatHistory } from '../data/mockData';

interface ChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
  currentDocument?: Document | null;
}

export default function ChatPanel({ 
  isOpen, 
  onToggle, 
  isMinimized, 
  onMinimize, 
  currentDocument 
}: ChatPanelProps) {
  const { t, language, dir } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, currentDocument);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, document?: Document | null): ChatMessage => {
    const responses = {
      ar: {
        policy: 'بناءً على سياسة المصروفات الرأسمالية، يتطلب اعتماد أي مصروف رأسمالي جديد الخطوات التالية:\n\n1. تعبئة نموذج طلب الاعتماد\n2. الحصول على موافقة المدير المباشر\n3. مراجعة لجنة الميزانية\n4. الاعتماد النهائي من وكيل الوزارة\n\nهل تحتاج إلى مساعدة في أي من هذه الخطوات؟',
        procedure: 'وفقاً لدليل الإجراءات المحاسبية، يجب اتباع الخطوات التالية:\n\n• التأكد من توفر الاعتماد المالي\n• توثيق جميع المستندات المطلوبة\n• الحصول على التوقيعات اللازمة\n• إدخال البيانات في النظام المالي\n\nيمكنني مساعدتك في تفاصيل أي خطوة.',
        general: 'أفهم استفسارك. دعني أبحث في قاعدة المعارف للعثور على المعلومات المناسبة...\n\nبناءً على الوثائق المتاحة، يمكنني تقديم الإرشادات التالية. هل تحتاج إلى معلومات أكثر تفصيلاً؟',
        document: document ? `أرى أنك تتصفح وثيقة "${language === 'ar' ? document.title : document.titleEn}". هذه الوثيقة تحتوي على معلومات مهمة حول ${language === 'ar' ? document.department : document.departmentEn}.\n\nكيف يمكنني مساعدتك في فهم محتوى هذه الوثيقة؟` : ''
      },
      en: {
        policy: 'Based on the Capital Expenditure Policy, approving any new capital expenditure requires the following steps:\n\n1. Complete the approval request form\n2. Obtain direct manager approval\n3. Budget committee review\n4. Final approval from Deputy Minister\n\nDo you need help with any of these steps?',
        procedure: 'According to the Government Accounting Procedures Manual, the following steps must be followed:\n\n• Ensure financial appropriation availability\n• Document all required paperwork\n• Obtain necessary signatures\n• Enter data into the financial system\n\nI can help you with details of any step.',
        general: 'I understand your inquiry. Let me search the knowledge base for appropriate information...\n\nBased on available documents, I can provide the following guidance. Do you need more detailed information?',
        document: document ? `I see you're viewing the document "${language === 'ar' ? document.title : document.titleEn}". This document contains important information about ${language === 'ar' ? document.department : document.departmentEn}.\n\nHow can I help you understand the content of this document?` : ''
      }
    };

    let responseContent = '';
    const userInputLower = userInput.toLowerCase();

    if (document) {
      responseContent = responses[language].document;
    } else if (userInputLower.includes('سياسة') || userInputLower.includes('policy') || userInputLower.includes('مصروف') || userInputLower.includes('expenditure')) {
      responseContent = responses[language].policy;
    } else if (userInputLower.includes('إجراء') || userInputLower.includes('procedure') || userInputLower.includes('محاسبة') || userInputLower.includes('accounting')) {
      responseContent = responses[language].procedure;
    } else {
      responseContent = responses[language].general;
    }

    return {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      language: language,
      references: [
        {
          documentId: '1',
          title: language === 'ar' ? 'سياسة المصروفات الرأسمالية' : 'Capital Expenditure Policy',
          type: 'pdf',
          relevance: 0.95
        },
        {
          documentId: '2',
          title: language === 'ar' ? 'دليل إجراءات المحاسبة' : 'Accounting Procedures Manual',
          type: 'pdf',
          relevance: 0.87
        }
      ]
    };
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `${language === 'ar' ? 'تم رفع الملف:' : 'File uploaded:'} ${file.name}`,
        timestamp: new Date(),
        language: language
      };
      
      setMessages(prev => [...prev, message]);
      
      // Simulate AI analysis
      setTimeout(() => {
        const analysisResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: language === 'ar' 
            ? `تم تحليل الملف "${file.name}" بنجاح. الملف يحتوي على معلومات مالية مهمة. هل تريد مني تلخيص المحتوى أم لديك أسئلة محددة حول الملف؟`
            : `Successfully analyzed file "${file.name}". The file contains important financial information. Would you like me to summarize the content or do you have specific questions about the file?`,
          timestamp: new Date(),
          language: language
        };
        setMessages(prev => [...prev, analysisResponse]);
      }, 2000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording functionality
  };

  const quickActions = [
    {
      ar: 'كيف أعتمد مصروف جديد؟',
      en: 'How do I approve a new expense?'
    },
    {
      ar: 'ما هي إجراءات الميزانية؟',
      en: 'What are the budget procedures?'
    },
    {
      ar: 'أين أجد النماذج المطلوبة؟',
      en: 'Where can I find required forms?'
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-saudi-green text-white p-4 rounded-full shadow-lg hover:bg-saudi-green-light transition-colors duration-200 z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed ${dir === 'rtl' ? 'left-6' : 'right-6'} bottom-6 bg-white rounded-lg shadow-xl border border-gray-200 z-40 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-saudi-green text-white rounded-t-lg">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">{t('chat.title')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="text-white hover:text-saudi-gold transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="text-white hover:text-saudi-gold transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-xs lg:max-w-sm ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-saudi-green' : 'bg-saudi-gold'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`chat-message ${
                    message.type === 'user'
                      ? 'bg-saudi-green text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    
                    {message.references && message.references.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium mb-2">{t('chat.references')}:</p>
                        <div className="space-y-1">
                          {message.references.map((ref, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {ref.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-saudi-gold flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="chat-message bg-gray-100 text-gray-900">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{t('chat.typing')}</span>
                      <div className="loading-dots">...</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">أسئلة شائعة:</p>
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(language === 'ar' ? action.ar : action.en)}
                    className="w-full text-left text-xs text-saudi-green hover:bg-saudi-green hover:text-white px-2 py-1 rounded transition-colors"
                  >
                    {language === 'ar' ? action.ar : action.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('chat.placeholder')}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-saudi-green focus:border-transparent"
                  rows={2}
                  dir={dir}
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    onClick={handleFileUpload}
                    className="text-gray-400 hover:text-saudi-green transition-colors"
                    title={t('chat.upload')}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    onClick={toggleRecording}
                    className={`transition-colors ${
                      isRecording ? 'text-red-500' : 'text-gray-400 hover:text-saudi-green'
                    }`}
                    title="تسجيل صوتي"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
          </div>
        </>
      )}
    </div>
  );
}