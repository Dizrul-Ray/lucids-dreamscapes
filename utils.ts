
import { SharedPost, Comment } from "./types";
import { supabase } from "./services/supabase";

export const LUCID_AVATAR_URL = "/logo.png";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
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

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .ilike('username', username)
            .maybeSingle();
        if (error) throw error;
        return !data;
    } catch (error) {
        return true;
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
    type: 'story' | 'image',
    series: string = 'Untitled Story',
    status: 'active' | 'complete' = 'active'
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
                    story_series: series,
                    status: status,
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

// Fetch Active Stories (For Home Page)
export const getActiveSeries = async (): Promise<SharedPost[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*, profiles!inner(role)`)
            .eq('profiles.role', 'admin')
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as SharedPost[];
    } catch (error) {
        console.error("Error fetching active series:", error);
        return [];
    }
};

// Fetch Completed Books (For Bookshelf)
export const getCompletedSeries = async (): Promise<SharedPost[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*, profiles!inner(role)`)
            .eq('profiles.role', 'admin')
            .eq('status', 'complete')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as SharedPost[];
    } catch (error) {
        return [];
    }
};

// Fetch Community Posts (For The Archive)
export const getCommunityPosts = async (): Promise<SharedPost[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`*, profiles(username)`)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        return data.map((post: any) => ({
            ...post,
            authorName: post.profiles?.username || 'Unknown'
        })) as SharedPost[];
    } catch (error) {
        console.error("Error fetching community posts:", error);
        return [];
    }
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select(`*, profiles(username)`)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
            
        if (error) return [];
        return data.map((c: any) => ({
            ...c,
            authorName: c.profiles?.username || 'Unknown'
        }));
    } catch (error) {
        return [];
    }
}

export const addComment = async (postId: string, userId: string, content: string): Promise<Comment | null> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: postId, user_id: userId, content }])
            .select(`*, profiles(username)`)
            .single();
        if (error) throw error;
         return {
            ...data,
            authorName: data.profiles?.username || 'Unknown'
        };
    } catch (error) {
        return null;
    }
}

export const getAdminStats = async () => {
    const { count: total } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    return { total: total || 0, stories: 0, images: 0 };
};
