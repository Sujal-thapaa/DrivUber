import { Loader } from '@googlemaps/js-api-loader';

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// Initialize the Google Maps loader
export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

// Load Google Maps API
export const loadGoogleMaps = async () => {
  try {
    const google = await googleMapsLoader.load();
    return google;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    
    // Check for specific API key errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('ExpiredKeyMapError') || errorMessage.includes('expired')) {
      throw new Error('Google Maps API key has expired or is invalid');
    } else if (errorMessage.includes('OVER_QUERY_LIMIT')) {
      throw new Error('Google Maps API quota exceeded');
    } else if (errorMessage.includes('REQUEST_DENIED')) {
      throw new Error('Google Maps API request denied - check API key restrictions');
    }
    
    throw error;
  }
};

// Geocoding utility function
export const geocodeAddress = async (address: string): Promise<google.maps.LatLng | null> => {
  try {
    const google = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          console.warn(`Geocoding failed for address: ${address}`, status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
};

// Get directions between two points
export const getDirections = async (
  origin: string,
  destination: string,
  waypoints?: string[]
): Promise<google.maps.DirectionsResult | null> => {
  try {
    const google = await loadGoogleMaps();
    const directionsService = new google.maps.DirectionsService();
    
    return new Promise((resolve, reject) => {
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        ...(waypoints && waypoints.length > 0 && {
          waypoints: waypoints.map(waypoint => ({ location: waypoint }))
        })
      };
      
      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          resolve(result);
        } else {
          console.warn(`Directions failed: ${status}`);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting directions:', error);
    return null;
  }
};

// Calculate distance and duration
export const calculateRouteInfo = async (
  origin: string,
  destination: string
): Promise<{ distance: string; duration: string } | null> => {
  try {
    const directions = await getDirections(origin, destination);
    if (directions && directions.routes[0]) {
      const route = directions.routes[0];
      const leg = route.legs[0];
      
      return {
        distance: leg.distance?.text || 'Unknown',
        duration: leg.duration?.text || 'Unknown'
      };
    }
    return null;
  } catch (error) {
    console.error('Error calculating route info:', error);
    return null;
  }
}; 