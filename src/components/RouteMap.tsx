import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { loadGoogleMaps, getDirections, calculateRouteInfo } from '../lib/google-maps';

interface RouteMapProps {
  origin: string;
  destination: string;
  viaStops?: string;
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  origin, 
  destination, 
  viaStops, 
  className = "h-64" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps API
        const google = await loadGoogleMaps();

        if (!mapRef.current || !isMounted) return;

        // Ensure the map container is properly rendered
        if (!mapRef.current.offsetHeight) {
          // Wait for the next frame to ensure the container is rendered
          await new Promise(resolve => requestAnimationFrame(resolve));
          if (!isMounted) return;
        }

        // Create map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Create directions renderer
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });

        setMap(mapInstance);
        setDirectionsRenderer(directionsRendererInstance);

        // Get directions
        const waypoints = viaStops ? [viaStops] : undefined;
        const directions = await getDirections(origin, destination, waypoints);

        if (directions && isMounted) {
          directionsRendererInstance.setDirections(directions);
          
          // Calculate route info
          const info = await calculateRouteInfo(origin, destination);
          if (info && isMounted) {
            setRouteInfo(info);
          }
        } else if (isMounted) {
          setError('Unable to load route directions');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMounted) {
          // Check for specific Google Maps errors
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          if (errorMessage.includes('ExpiredKeyMapError') || errorMessage.includes('expired')) {
            setError('Google Maps API key has expired or is invalid. Please check your API key configuration.');
          } else if (errorMessage.includes('OVER_QUERY_LIMIT')) {
            setError('Google Maps API quota exceeded. Please try again later.');
          } else if (errorMessage.includes('REQUEST_DENIED')) {
            setError('Google Maps API request denied. Please check your API key restrictions.');
          } else {
            setError('Failed to load Google Maps. Please check your internet connection.');
          }
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, [origin, destination, viaStops]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [directionsRenderer]);

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Navigation className="w-5 h-5 text-blue-600 mr-2" />
          Route Map
        </h3>
        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
          Live
        </div>
      </div>
      
      {/* Map Container */}
      <div className="bg-white rounded-lg h-full border-2 border-gray-200 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <p className="text-xs text-gray-500">Route details shown below</p>
            </div>
          </div>
        )}

        {/* Google Maps Container */}
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ minHeight: '300px' }}
        />

        {/* Route Summary Overlay */}
        {routeInfo && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white rounded-lg p-3 shadow-lg border">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">Distance</div>
                  <div className="text-gray-600">{routeInfo.distance}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Duration</div>
                  <div className="text-gray-600">{routeInfo.duration}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Route Details */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center p-2 bg-white rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{origin}</p>
            <p className="text-xs text-gray-500">Departure</p>
          </div>
        </div>
        
        {viaStops && (
          <div className="flex items-center p-2 bg-white rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Via: {viaStops}</p>
              <p className="text-xs text-gray-500">Stop</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center p-2 bg-white rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{destination}</p>
            <p className="text-xs text-gray-500">Destination</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap; 