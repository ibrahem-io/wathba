import openaiService from './openaiService';

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

// Enhanced chat service that integrates with RAG
export async function sendChatMessage(
  messages: ChatMessage[],
  selectedFolder?: string | null
): Promise<{ content: string; citations?: string[] }> {
  try {
    // Check if RAG assistant is available
    const assistantReady = localStorage.getItem('openai_assistant_id');
    
    if (assistantReady) {
      // Use RAG-enabled chat
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        const response = await openaiService.sendMessage(lastMessage.content);
        return {
          content: response.content,
          citations: response.citations
        };
      }
    }
    
    // Fallback to mock response
    return generateMockResponse(messages[messages.length - 1]?.content || '');
  } catch (error) {
    console.error('Error in chat service:', error);
    throw error;
  }
}

function generateMockResponse(query: string): { content: string; citations?: string[] } {
  const responses = [
    'بناءً على بحثي في قاعدة البيانات، وجدت عدة مستندات ذات صلة بسؤالك. يمكنك الاطلاع على سياسة المصروفات الرأسمالية ودليل الإجراءات المحاسبية.',
    'يمكنني مساعدتك في العثور على المعلومات المطلوبة. هناك عدة وثائق في النظام تتعلق بموضوعك.',
    'وفقاً للوثائق المتاحة في المنصة، يمكنني توجيهك إلى المراجع المناسبة لاستفسارك.',
    'تم العثور على معلومات مفيدة في عدة مستندات. دعني أوضح لك أهم النقاط المتعلقة بسؤالك.'
  ];
  
  const citations = [
    'سياسة المصروفات الرأسمالية 2024',
    'دليل الإجراءات المحاسبية',
    'تقرير الأداء المالي Q4 2023',
    'لائحة الحوكمة المؤسسية'
  ];
  
  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    citations: citations.slice(0, Math.floor(Math.random() * 3) + 1)
  };
}

export async function getChatHistory(sessionId: string) {
  return [];
}

export async function saveChatMessage(
  sessionId: string,
  message: string,
  response: string,
  citations: string[] = []
) {
  console.log('Saving chat message:', { sessionId, message, response, citations });
}