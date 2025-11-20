export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface GeneratedContent {
  id: string;
  type: 'story' | 'image';
  createdAt: number;
  prompt?: string;
  result: string; // Text content or Image URL
  metadata?: {
    wordCount?: number;
    sourceImage?: string; // Base64 of source image for story generation
  };
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  IMG_TO_STORY = 'IMG_TO_STORY',
  STORY_TO_IMG = 'STORY_TO_IMG',
  RANDOM = 'RANDOM',
  ADMIN = 'ADMIN',
}

export type WordCountOption = 500 | 1000 | 2500;