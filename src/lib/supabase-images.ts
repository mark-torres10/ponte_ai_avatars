import { PersonaImages } from '@/types/avatar-images';

/**
 * Load avatar images by calling the backend API route
 */
export const loadAvatarImages = async (): Promise<PersonaImages> => {
  try {
    // Always log in production for debugging
    console.log('Frontend: Calling API route for avatar images...');
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('/api/avatar-images', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Frontend: API request failed:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Frontend: API response received:', result.success ? 'success' : 'error');
    
    if (result.success) {
      console.log('Frontend: Successfully loaded avatar images from API');
      return result.data;
    } else {
      console.warn('Frontend: API returned error, using fallback images');
      return result.data; // API returns fallback images on error
    }
  } catch (error) {
    // Always log errors for debugging
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Frontend: Request timeout while loading avatar images');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Frontend: Network error while loading avatar images');
      } else {
        console.error('Frontend: Failed to load avatar images from API:', error.message);
      }
    } else {
      console.error('Frontend: Unknown error while loading avatar images');
    }
    
    // Return fallback images if API call fails
    return getFallbackImages();
  }
};

/**
 * Get fallback images when API is not available
 */
const getFallbackImages = (): PersonaImages => {
  console.log('Frontend: Using fallback images');
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