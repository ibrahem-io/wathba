export interface Document {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'pdf' | 'doc' | 'docx' | 'audio' | 'video' | 'image' | 'excel' | 'ppt';
  department: string;
  departmentEn: string;
  tags: string[];
  tagsEn: string[];
  uploadDate: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  aiSummary?: string;
  aiSummaryEn?: string;
  language: 'ar' | 'en' | 'both';
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: DocumentReference[];
  language: 'ar' | 'en';
}

export interface DocumentReference {
  documentId: string;
  title: string;
  type: string;
  relevance: number;
}

export interface SearchFilters {
  type: string[];
  department: string[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
  language: 'all' | 'ar' | 'en';
}

export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  department: string;
  departmentEn: string;
  role: string;
  avatar?: string;
}

export type Language = 'ar' | 'en';

export interface Translation {
  ar: string;
  en: string;
}