
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface SharedPost {
  id: string;
  user_id: string; // Supabase UUID
  authorName?: string; // Joined from profiles
  title: string;
  content: string; // The story text
  image_url: string; // The associated image URL in Storage
  type: 'story' | 'image';
  likes: number;
  created_at: string; // ISO timestamp from DB
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  IMG_TO_STORY = 'IMG_TO_STORY',
  STORY_TO_IMG = 'STORY_TO_IMG',
  RANDOM = 'RANDOM',
  COMMUNITY = 'COMMUNITY',
  ADMIN = 'ADMIN',
}

export type WordCountOption = 500 | 1000 | 2500;