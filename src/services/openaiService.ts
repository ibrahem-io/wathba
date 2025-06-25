import { useAuth } from '../contexts/AuthContext';

interface OpenAIConfig {
  apiKey: string;
  assistantId?: string;
  vectorStoreId?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface FileUploadResult {
  fileId: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  vectorStoreFileId?: string;
}

interface ChatResponse {
  content: string;
  citations?: string[];
  threadId: string;
}

class OpenAIService {
  private config: OpenAIConfig;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.config = {
      apiKey: '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'
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async initializeAssistant(): Promise<{ assistantId: string; vectorStoreId: string }> {
    try {
      // Create vector store first
      const vectorStore = await this.makeRequest('/vector_stores', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Saudi MOF Knowledge Base',
          expires_after: {
            anchor: 'last_active_at',
            days: 30
          }
        })
      });

      // Create assistant with file search capability
      const assistant = await this.makeRequest('/assistants', {
        method: 'POST',
        body: JSON.stringify({
          name: 'مساعد وزارة المالية الذكي',
          instructions: `أنت مساعد ذكي متخصص في وزارة المالية السعودية. مهامك:

1. تحليل المستندات المالية والإدارية المرفوعة
2. الإجابة على الاستفسارات بناءً على محتوى الوثائق
3. تقديم معلومات دقيقة ومفيدة باللغة العربية
4. الاستشهاد بالمصادر عند الإمكان
5. التعامل مع السياسات والإجراءات والتقارير المالية

قواعد مهمة:
- أجب باللغة العربية دائماً
- استشهد بالوثائق المرجعية
- كن دقيقاً ومهنياً
- إذا لم تجد معلومات في الوثائق، أخبر المستخدم بذلك
- قدم إجابات شاملة ومفيدة

You are an AI assistant specialized in Saudi Ministry of Finance. Your tasks:
1. Analyze uploaded financial and administrative documents
2. Answer queries based on document content
3. Provide accurate information in Arabic
4. Cite sources when possible
5. Handle policies, procedures, and financial reports

Always respond in Arabic and be professional and accurate.`,
          model: 'gpt-4o-mini',
          tools: [{ type: 'file_search' }],
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStore.id]
            }
          },
          temperature: 0.7,
          top_p: 1.0
        })
      });

      this.config.assistantId = assistant.id;
      this.config.vectorStoreId = vectorStore.id;

      // Store in localStorage for persistence
      localStorage.setItem('openai_assistant_id', assistant.id);
      localStorage.setItem('openai_vector_store_id', vectorStore.id);

      return {
        assistantId: assistant.id,
        vectorStoreId: vectorStore.id
      };
    } catch (error) {
      console.error('Error initializing assistant:', error);
      throw error;
    }
  }

  async getOrCreateAssistant(): Promise<{ assistantId: string; vectorStoreId: string }> {
    // Try to get from localStorage first
    const storedAssistantId = localStorage.getItem('openai_assistant_id');
    const storedVectorStoreId = localStorage.getItem('openai_vector_store_id');

    if (storedAssistantId && storedVectorStoreId) {
      try {
        // Verify assistant still exists
        await this.makeRequest(`/assistants/${storedAssistantId}`);
        await this.makeRequest(`/vector_stores/${storedVectorStoreId}`);
        
        this.config.assistantId = storedAssistantId;
        this.config.vectorStoreId = storedVectorStoreId;
        
        return {
          assistantId: storedAssistantId,
          vectorStoreId: storedVectorStoreId
        };
      } catch (error) {
        console.log('Stored assistant not found, creating new one');
        localStorage.removeItem('openai_assistant_id');
        localStorage.removeItem('openai_vector_store_id');
      }
    }

    return this.initializeAssistant();
  }

  async uploadFile(file: File): Promise<FileUploadResult> {
    try {
      // First upload file to OpenAI
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'assistants');

      const fileResponse = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData
      });

      if (!fileResponse.ok) {
        const error = await fileResponse.json().catch(() => ({}));
        throw new Error(error.error?.message || 'File upload failed');
      }

      const fileData = await fileResponse.json();

      // Ensure we have vector store
      if (!this.config.vectorStoreId) {
        await this.getOrCreateAssistant();
      }

      // Add file to vector store
      const vectorStoreFile = await this.makeRequest(`/vector_stores/${this.config.vectorStoreId}/files`, {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileData.id
        })
      });

      return {
        fileId: fileData.id,
        filename: file.name,
        status: 'processing',
        vectorStoreFileId: vectorStoreFile.id
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async checkFileStatus(fileId: string): Promise<'processing' | 'ready' | 'error'> {
    try {
      if (!this.config.vectorStoreId) {
        return 'error';
      }

      const file = await this.makeRequest(`/vector_stores/${this.config.vectorStoreId}/files/${fileId}`);
      
      switch (file.status) {
        case 'completed':
          return 'ready';
        case 'in_progress':
          return 'processing';
        case 'failed':
        case 'cancelled':
          return 'error';
        default:
          return 'processing';
      }
    } catch (error) {
      console.error('Error checking file status:', error);
      return 'error';
    }
  }

  async sendMessage(message: string, threadId?: string): Promise<ChatResponse> {
    try {
      // Ensure assistant is initialized
      if (!this.config.assistantId) {
        await this.getOrCreateAssistant();
      }

      // Create or use existing thread
      let currentThreadId = threadId;
      if (!currentThreadId) {
        const thread = await this.makeRequest('/threads', {
          method: 'POST',
          body: JSON.stringify({})
        });
        currentThreadId = thread.id;
      }

      // Add message to thread
      await this.makeRequest(`/threads/${currentThreadId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      // Run the assistant
      const run = await this.makeRequest(`/threads/${currentThreadId}/runs`, {
        method: 'POST',
        body: JSON.stringify({
          assistant_id: this.config.assistantId,
          instructions: 'يرجى الإجابة باللغة العربية بناءً على الوثائق المتاحة. إذا لم تجد معلومات ذات صلة في الوثائق، أخبر المستخدم بذلك.'
        })
      });

      // Poll for completion
      let runStatus = run;
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.makeRequest(`/threads/${currentThreadId}/runs/${run.id}`);
      }

      if (runStatus.status !== 'completed') {
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }

      // Get messages
      const messages = await this.makeRequest(`/threads/${currentThreadId}/messages`);
      const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');

      if (!assistantMessage) {
        throw new Error('No assistant response found');
      }

      // Extract content and citations
      const content = assistantMessage.content[0]?.text?.value || 'عذراً، لم أتمكن من معالجة طلبك.';
      const citations = this.extractCitations(assistantMessage);

      return {
        content,
        citations,
        threadId: currentThreadId
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private extractCitations(message: any): string[] {
    const citations: string[] = [];
    
    if (message.content[0]?.text?.annotations) {
      message.content[0].text.annotations.forEach((annotation: any) => {
        if (annotation.type === 'file_citation') {
          citations.push(annotation.text || 'مرجع من الوثائق');
        }
      });
    }

    return citations;
  }

  async listUploadedFiles(): Promise<any[]> {
    try {
      if (!this.config.vectorStoreId) {
        return [];
      }

      const files = await this.makeRequest(`/vector_stores/${this.config.vectorStoreId}/files`);
      return files.data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      // Remove from vector store
      if (this.config.vectorStoreId) {
        await this.makeRequest(`/vector_stores/${this.config.vectorStoreId}/files/${fileId}`, {
          method: 'DELETE'
        });
      }

      // Delete the file
      await this.makeRequest(`/files/${fileId}`, {
        method: 'DELETE'
      });

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const openaiService = new OpenAIService();
export default openaiService;