import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AvatarImage {
  url: string;
  alt: string;
  index: number;
}

export interface PersonaImages {
  [personaId: string]: AvatarImage[];
}

/**
 * Generate signed URLs for avatar images from Supabase
 */
export const loadAvatarImages = async (): Promise<PersonaImages> => {
  try {
    const personaImages: PersonaImages = {};
    
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase not configured, using fallback images');
      return getFallbackImages();
    }
    
    // Define the persona configurations
    const personas = [
      { id: 'terry-crews', folder: 'voice_actor_a' },
      { id: 'will-howard', folder: 'voice_actor_b' }
    ];

    for (const persona of personas) {
      const images: AvatarImage[] = [];
      
      // Load 5 images for each persona (pic1.jpeg through pic5.jpeg)
      for (let i = 1; i <= 5; i++) {
        const imagePath = `avatar_assets/${persona.folder}/static/pic${i}.jpeg`;
        
        try {
          // Generate a signed URL that expires in 1 hour
          const { data, error } = await supabase.storage
            .from('test-bucket-ponteai') // Replace with your actual bucket name
            .createSignedUrl(imagePath, 3600); // 1 hour expiry
          
          if (error) {
            console.error(`Error loading image ${imagePath}:`, error);
            // Fallback to a placeholder image
            images.push({
              url: `/api/placeholder/300/300?text=${persona.id}-${i}`,
              alt: `${persona.id} - Image ${i}`,
              index: i
            });
          } else if (data?.signedUrl) {
            images.push({
              url: data.signedUrl,
              alt: `${persona.id} - Image ${i}`,
              index: i
            });
          }
        } catch (error) {
          console.error(`Failed to load image ${imagePath}:`, error);
          // Fallback to a placeholder image
          images.push({
            url: `/api/placeholder/300/300?text=${persona.id}-${i}`,
            alt: `${persona.id} - Image ${i}`,
            index: i
          });
        }
      }
      
      personaImages[persona.id] = images;
    }

    return personaImages;
  } catch (error) {
    console.error('Failed to load avatar images:', error);
    
    // Return fallback images if loading fails
    return getFallbackImages();
  }
};

/**
 * Get public URL for an image (if bucket is public)
 */
export const getPublicImageUrl = (personaId: string, imageIndex: number): string => {
  const folder = personaId === 'terry-crews' ? 'voice_actor_a' : 'voice_actor_b';
  const imagePath = `avatar_assets/${folder}/static/pic${imageIndex}.jpeg`;
  
  // If your bucket is public, you can use the public URL
  return `${supabaseUrl}/storage/v1/object/public/test-bucket-ponteai/${imagePath}`;
};

/**
 * Get fallback images when Supabase is not available
 */
const getFallbackImages = (): PersonaImages => {
  return {
    'terry-crews': Array.from({ length: 5 }, (_, i) => ({
      url: `/api/placeholder/300/300?text=terry-crews-${i + 1}`,
      alt: `Terry Crews - Image ${i + 1}`,
      index: i + 1
    })),
    'will-howard': Array.from({ length: 5 }, (_, i) => ({
      url: `/api/placeholder/300/300?text=will-howard-${i + 1}`,
      alt: `Will Howard - Image ${i + 1}`,
      index: i + 1
    }))
  };
};

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
}; 