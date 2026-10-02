import { supabase } from './supabase';

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Uploads user avatar to Supabase Storage 'avatars' bucket.
 * @param file The image File object
 * @param userId The current user's authenticated UUID
 */
export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
  // Validate File Type
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return {
      url: null,
      error: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  // Validate File Size
  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return {
      url: null,
      error: 'File size exceeds 2MB limit. Please upload a smaller image.',
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upload avatar image.';
    return {
      url: null,
      error: message,
    };
  }
}
