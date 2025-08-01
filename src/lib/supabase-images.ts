export interface AvatarImage {
  url: string;
  alt: string;
  index: number;
}

export interface PersonaImages {
  [personaId: string]: AvatarImage[];
}

/**
 * Load avatar images by calling the backend API route
 */
export const loadAvatarImages = async (): Promise<PersonaImages> => {
  try {
    console.log('Frontend: Calling API route for avatar images...');
    
    const response = await fetch('/api/avatar-images');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Frontend: Successfully loaded avatar images from API');
      return result.data;
    } else {
      console.warn('Frontend: API returned error, using fallback images');
      return result.data; // API returns fallback images on error
    }
  } catch (error) {
    console.error('Frontend: Failed to load avatar images from API:', error);
    
    // Return fallback images if API call fails
    return getFallbackImages();
  }
};

/**
 * Get fallback images when API is not available
 */
const getFallbackImages = (): PersonaImages => {
  return {
    'terry-crews': Array.from({ length: 5 }, (_, i) => ({
      url: `https://picsum.photos/300/300?random=${i + 1}&blur=2`,
      alt: `Terry Crews - Image ${i + 1}`,
      index: i + 1
    })),
    'will-howard': Array.from({ length: 5 }, (_, i) => ({
      url: `https://picsum.photos/300/300?random=${i + 6}&blur=2`,
      alt: `Will Howard - Image ${i + 1}`,
      index: i + 1
    }))
  };
}; 