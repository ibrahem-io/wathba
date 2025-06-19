import { useAuth } from '../contexts/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Default OpenAI configuration
const DEFAULT_OPENAI_CONFIG = {
  id: 'default-openai',
  service_name: 'OpenAI GPT-4',
  service_type: 'ai_chat' as const,
  endpoint_url: 'https://api.openai.com/v1/chat/completions',
  api_key: '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',
  auth_type: 'bearer_token' as const,
  headers: {
    'Content-Type': 'application/json'
  },
  parameters: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 2000
  },
  is_active: true,
  created_at: new Date().toISOString()
};

export async function getActiveAIChatConfig() {
  try {
    // Try to get from API configurations first
    const { getActiveApiConfiguration } = await import('./apiService');
    const config = await getActiveApiConfiguration('ai_chat');
    return config;
  } catch (error) {
    console.log('Using default OpenAI configuration');
    return DEFAULT_OPENAI_CONFIG;
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  selectedFolder?: string | null
): Promise<{ content: string; citations?: string[] }> {
  try {
    const config = await getActiveAIChatConfig();
    
    if (!config.api_key) {
      throw new Error('لم يتم تكوين مفتاح API للمحادثة الذكية');
    }

    // Prepare system message with context about the audit platform
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `أنت مساعد ذكي متخصص في المراجعة والامتثال للديوان العام للمحاسبة السعودي. 
      
مهامك الأساسية:
- تحليل المستندات المالية والإدارية
- تقديم توصيات للمراجعة والامتثال
- مساعدة المراجعين في تحليل البيانات
- الإجابة على الاستفسارات المتعلقة بالمعايير المحاسبية والرقابية

يرجى الإجابة باللغة العربية وتقديم إجابات مفيدة ومهنية تتعلق بمجال المراجعة والامتثال.

${selectedFolder ? `السياق الحالي: المجلد المحدد هو "${selectedFolder}"` : 'السياق الحالي: جميع المستندات'}

تذكر أن تقدم مراجع وتوصيات عملية عند الإمكان.`
    };

    const allMessages = [systemMessage, ...messages];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers as Record<string, string>
    };

    // Add authentication
    if (config.auth_type === 'bearer_token') {
      headers['Authorization'] = `Bearer ${config.api_key}`;
    } else if (config.auth_type === 'api_key') {
      headers['X-API-Key'] = config.api_key;
    }

    const requestBody = {
      model: config.parameters?.model || 'gpt-4o-mini',
      messages: allMessages,
      temperature: config.parameters?.temperature || 0.7,
      max_tokens: config.parameters?.max_tokens || 2000,
      ...config.parameters
    };

    const startTime = Date.now();
    
    const response = await fetch(config.endpoint_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      // Log the error
      try {
        const { logApiUsage } = await import('./apiService');
        await logApiUsage(
          config.id,
          'current-user', // You might want to get actual user ID
          'chat_completion',
          response.status,
          responseTime,
          JSON.stringify(requestBody).length,
          0,
          errorData.error?.message || `HTTP ${response.status}`
        );
      } catch (logError) {
        console.error('Error logging API usage:', logError);
      }

      throw new Error(
        errorData.error?.message || 
        `خطأ في API: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenAIResponse = await response.json();
    
    // Log successful usage
    try {
      const { logApiUsage } = await import('./apiService');
      await logApiUsage(
        config.id,
        'current-user', // You might want to get actual user ID
        'chat_completion',
        response.status,
        responseTime,
        JSON.stringify(requestBody).length,
        JSON.stringify(data).length
      );
    } catch (logError) {
      console.error('Error logging API usage:', logError);
    }

    const assistantMessage = data.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('لم يتم الحصول على رد من المساعد الذكي');
    }

    // Generate mock citations based on the context
    const citations = generateMockCitations(selectedFolder);

    return {
      content: assistantMessage,
      citations
    };

  } catch (error) {
    console.error('Error in chat service:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('حدث خطأ أثناء التواصل مع المساعد الذكي');
  }
}

function generateMockCitations(selectedFolder?: string | null): string[] {
  const allCitations = [
    'تقرير الميزانية العمومية 2024',
    'سياسة الامتثال المحدثة',
    'دليل المراجعة الداخلية',
    'معايير المحاسبة السعودية',
    'لائحة الحوكمة المؤسسية',
    'تقرير تقييم المخاطر',
    'إجراءات الرقابة المالية',
    'دليل السياسات المحاسبية'
  ];

  const folderSpecificCitations: Record<string, string[]> = {
    'folder-1': ['تقرير الميزانية العمومية 2024', 'قائمة الدخل الشهرية', 'تحليل النسب المالية'],
    'folder-2': ['سياسة الامتثال المحدثة', 'لائحة الحوكمة المؤسسية', 'تقرير الامتثال السنوي'],
    'folder-3': ['تقرير تقييم الأداء', 'مؤشرات الأداء الرئيسية', 'تحليل الكفاءة التشغيلية']
  };

  if (selectedFolder && folderSpecificCitations[selectedFolder]) {
    return folderSpecificCitations[selectedFolder];
  }

  // Return 2-3 random citations
  const shuffled = [...allCitations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
}

export async function getChatHistory(sessionId: string) {
  // This would typically fetch from your database
  // For now, return empty array as chat history is managed in component state
  return [];
}

export async function saveChatMessage(
  sessionId: string,
  message: string,
  response: string,
  citations: string[] = []
) {
  // This would typically save to your database
  // Implementation depends on your chat storage strategy
  console.log('Saving chat message:', { sessionId, message, response, citations });
}