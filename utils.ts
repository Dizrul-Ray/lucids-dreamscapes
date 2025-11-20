import { GeneratedContent, User } from "./types";

// Represents Lucid the Storyteller. 
// Replace this URL with the specific image of the man with the half-skull face and raven.
export const LUCID_AVATAR_URL = "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=400&auto=format&fit=crop";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const getMimeType = (file: File): string => {
    return file.type;
}

// Simulated LocalStorage DB
const STORAGE_KEY_USERS = 'lucid_users';
const STORAGE_KEY_CONTENT = 'lucid_content';

export const saveContent = (content: GeneratedContent) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTENT) || '[]');
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify([content, ...existing]));
};

export const getUserContent = (): GeneratedContent[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_CONTENT) || '[]');
};

export const getAdminStats = () => {
    const content = getUserContent();
    const stories = content.filter(c => c.type === 'story').length;
    const images = content.filter(c => c.type === 'image').length;
    return { total: content.length, stories, images };
};
