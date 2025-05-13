
import { supabase } from './client';

/**
 * Ensures the avatar storage bucket exists and has the correct settings
 */
export async function ensureAvatarBucketExists() {
  try {
    // Check if bucket exists
    const { data: bucket, error } = await supabase.storage.getBucket('avatars');
    
    // If bucket doesn't exist, create it
    if (error && error.message.includes('does not exist')) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024, // 1MB limit
      });
      console.log("Created avatars storage bucket");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring avatar bucket exists:", error);
    return false;
  }
}
