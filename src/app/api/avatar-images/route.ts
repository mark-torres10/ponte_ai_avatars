import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AvatarImage, PersonaImages } from '@/types/avatar-images';

// Initialize Supabase client with server-side environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const prodStorageBucket = process.env.PROD_STORAGE_BUCKET || 'ponteai-assets';

// Only create Supabase client if environment variables are available
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Load avatar images from Supabase storage
 */
async function loadAvatarImages(): Promise<PersonaImages> {
  try {
    const personaImages: PersonaImages = {};
    
    console.log('Backend: Starting to load avatar images from Supabase...');
    console.log('Backend: Supabase URL:', supabaseUrl ? 'Available' : 'Not available');
    console.log('Backend: Production bucket:', prodStorageBucket);
    
    // If Supabase is not configured, return fallback images
    if (!supabase) {
      console.log('Backend: Supabase not configured, using fallback images');
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
            .from(prodStorageBucket)
            .createSignedUrl(imagePath, 3600); // 1 hour expiry
          
          if (error) {
            console.error(`Backend: Error loading image ${imagePath}:`, error);
            // Fallback to a placeholder image
            images.push(createFallbackImage(persona.id, i));
          } else if (data?.signedUrl) {
            console.log(`Backend: Successfully loaded image for ${persona.id} - Image ${i}:`, data.signedUrl.substring(0, 50) + '...');
            images.push({
              url: data.signedUrl,
              alt: `${persona.id} - Image ${i}`,
              index: i
            });
          }
        } catch (error) {
          console.error(`Backend: Failed to load image ${imagePath}:`, error);
          // Fallback to a placeholder image
          images.push(createFallbackImage(persona.id, i));
        }
      }
      
      personaImages[persona.id] = images;
    }

    return personaImages;
  } catch (error) {
    console.error('Backend: Failed to load avatar images:', error);
    
    // Return fallback images if loading fails
    return getFallbackImages();
  }
}

/**
 * Create fallback image for a specific persona and index
 */
function createFallbackImage(personaId: string, index: number): AvatarImage {
  const randomSeed = personaId === 'terry-crews' ? index : index + 5;
  const personaName = personaId === 'terry-crews' ? 'Terry Crews' : 'Will Howard';
  
  return {
    url: `https://picsum.photos/300/300?random=${randomSeed}&blur=2`,
    alt: `${personaName} - Image ${index}`,
    index: index
  };
}

/**
 * Get fallback images when Supabase is not available
 */
function getFallbackImages(): PersonaImages {
  return {
    'terry-crews': Array.from({ length: 5 }, (_, i) => createFallbackImage('terry-crews', i + 1)),
    'will-howard': Array.from({ length: 5 }, (_, i) => createFallbackImage('will-howard', i + 1))
  };
}

export async function GET() {
  try {
    console.log('Backend: API route called for avatar images');
    
    // During build time, environment variables might not be available
    // Always return fallback images to prevent build failures
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Backend: Environment variables not available, returning fallback images');
      const fallbackImages = getFallbackImages();
      return NextResponse.json({
        success: true,
        data: fallbackImages
      });
    }
    
    const avatarImages = await loadAvatarImages();
    
    console.log('Backend: Successfully loaded avatar images:', Object.keys(avatarImages));
    
    return NextResponse.json({
      success: true,
      data: avatarImages
    });
  } catch (error) {
    console.error('Backend: API route error:', error);
    
    // Always return fallback images to prevent frontend from hanging
    const fallbackImages = getFallbackImages();
    console.log('Backend: Returning fallback images due to error');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load avatar images',
      data: fallbackImages
    }, { status: 500 });
  }
} 