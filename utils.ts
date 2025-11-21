import { SharedPost } from "./types";
import { supabase } from "./services/supabase";

// Represents Lucid the Storyteller. 
// This points to public/logo.png (Make sure you upload this file to GitHub!)
export const LUCID_AVATAR_URL = "/logo.png";

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

export const base64ToBlob = async (base64Data: string, contentType: string = 'image/jpeg'): Promise<Blob> => {
    const response = await fetch(base64Data);
    const blob = await response.blob();
    return blob;
}

export const getMimeType = (file: File): string => {
    return file.type;
}

// --- Supabase Database Functions ---

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .ilike('username', username) // Case insensitive check
            .maybeSingle();
            
        if (error) throw error;
        // If data exists, the username is taken
        return !data;
    } catch (error) {
        console.error("Error checking username:", error);
        return true; // Fail open to allow try, db constraint will catch it ultimately
    }
};

export const getUserProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
        if (error) return null;
        return data;
    } catch (error) {
        return null;
    }
};

export const uploadFile = async (file: File | Blob, path: string): Promise<string | null> => {
    try {
        const { data, error } = await supabase.storage
            .from('images')
            .upload(path, file, { upsert: true });
            
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(path);
            
        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}

export const savePost = async (
    userId: string, 
    title: string, 
    content: string, 
    imageUrl: string, 
    type: 'story' | 'image'
): Promise<SharedPost | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: userId,
                    title: title,
                    content: content,
                    image_url: imageUrl,
                    type: type,
                    likes: 0
                }
            ])
            .select()
            .single();
            
        if (error) throw error;
        return data as SharedPost;
    } catch (error) {
        console.error("Error saving post:", error);
        return null;
    }
}

export const getCommunityPosts = async (): Promise<SharedPost[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles (username)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
            
        if (error) throw error;
        
        // Map the joined profile data to authorName
        return data.map((post: any) => ({
            ...post,
            authorName: post.profiles?.username || 'Unknown Dreamer'
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

export const getUserPosts = async (userId: string): Promise<SharedPost[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data as SharedPost[];
    } catch (error) {
         console.error("Error fetching user posts:", error);
         return [];
    }
}

export const getAdminStats = async () => {
    // Simple estimation using count
    const { count: total } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: stories } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'story');
    const { count: images } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', 'image');
    
    return { total: total || 0, stories: stories || 0, images: images || 0 };
};