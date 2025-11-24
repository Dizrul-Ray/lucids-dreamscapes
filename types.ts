
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface SharedPost {
  id: string;
  user_id: string;
  authorName?: string;
  title: string;
  content: string;
  image_url: string;
  type: 'story' | 'image';
  likes: number;
  created_at: string;
  story_series?: string; // New: Group posts into a story
  status?: 'active' | 'complete'; // New: Active on home, or Complete on bookshelf
}

export interface Comment {
    id: string;
    user_id: string;
    authorName?: string;
    content: string;
    created_at: string;
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD', // The Active Chronicles
  BOOKSHELF = 'BOOKSHELF', // Completed Stories
  IMG_TO_STORY = 'IMG_TO_STORY',
  STORY_TO_IMG = 'STORY_TO_IMG',
  COMMUNITY = 'COMMUNITY', // Can remain as "The Archive" or be removed
  ADMIN = 'ADMIN',
  WRITER_DESK = 'WRITER_DESK',
  MOTHER = 'MOTHER'
}

export type WordCountOption = 500 | 1000 | 2500;
