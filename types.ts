export type UserRole = 'admin' | 'intern';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  progress: number; // 0-100
  totalModules: number;
  completedModules: number;
}

export interface N8NModule {
  day: number;
  title: string;
  description: string;
  outcomes: string[];
  keyConcepts: string[];
  homework: string;
  resources: Resource[];
  isCompleted: boolean;
  timeEstimate: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'workflow' | 'pdf';
  url: string;
  duration?: string;
  tags?: string[];
  channel?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Note {
  id: string;
  day: number;
  content: string;
  lastUpdated: string;
}

export interface StudentProgress {
  studentName: string;
  studentId: string;
  n8n: number;
  vibeCoding: number;
  promptEng: number;
  aiTools: number;
  lastActive: string;
}