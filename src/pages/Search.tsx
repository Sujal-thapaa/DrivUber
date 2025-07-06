import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Trip, SearchFilters } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SearchForm from '../components/SearchForm';
import TripCard from '../components/TripCard';
import RideDetailModal from '../components/RideDetailModal';
import { MapPin, Calendar, Search as SearchIcon, Sparkles } from 'lucide-react';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, addBookedRide, postedRides } = useAuth();

  // Hardcoded dummy trips data with more routes including Denver to Dallas
  const dummyTrips: Trip[] = [
    {
      id: 'trip-1',
      driver_id: 'driver-1',
      origin_city: 'Denver',
      origin_state: 'CO',
      destination_city: 'Dallas',
      destination_state: 'TX',
      via_stops: 'Colorado Springs, Amarillo',
      departure_date: '2026-01-15',
      departure_time: '09:00:00',
      available_seats: 3,
      total_price: 75.00,
      notes: 'Comfortable SUV, can take luggage, scenic route through mountains',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-1',
        name: 'John Smith',
        email: 'john@example.com',
        avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-2',
      driver_id: 'driver-2',
      origin_city: 'Dallas',
      origin_state: 'TX',
      destination_city: 'Houston',
      destination_state: 'TX',
      via_stops: 'Austin',
      departure_date: '2026-01-16',
      departure_time: '07:30:00',
      available_seats: 2,
      total_price: 45.00,
      notes: 'Quick trip, AC, music allowed, can stop for food',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-3',
      driver_id: 'driver-3',
      origin_city: 'New York',
      origin_state: 'NY',
      destination_city: 'Philadelphia',
      destination_state: 'PA',
      via_stops: undefined,
      departure_date: '2026-01-17',
      departure_time: '14:00:00',
      available_seats: 4,
      total_price: 35.00,
      notes: 'Pet-friendly, can stop for breaks, comfortable sedan',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-4',
      driver_id: 'driver-4',
      origin_city: 'Los Angeles',
      origin_state: 'CA',
      destination_city: 'San Francisco',
      destination_state: 'CA',
      via_stops: 'Bakersfield, Fresno',
      departure_date: '2026-01-20',
      departure_time: '08:00:00',
      available_seats: 2,
      total_price: 85.00,
      notes: 'Luxury car, scenic coastal route, can stop for photos',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-5',
      driver_id: 'driver-5',
      origin_city: 'Chicago',
      origin_state: 'IL',
      destination_city: 'Detroit',
      destination_state: 'MI',
      via_stops: 'Gary, South Bend',
      departure_date: '2026-01-18',
      departure_time: '11:00:00',
      available_seats: 1,
      total_price: 60.00,
      notes: 'Business trip, quiet ride preferred, can work during trip',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-5',
        name: 'David Brown',
        email: 'david@example.com',
        avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-6',
      driver_id: 'driver-6',
      origin_city: 'Miami',
      origin_state: 'FL',
      destination_city: 'Orlando',
      destination_state: 'FL',
      via_stops: 'Fort Lauderdale',
      departure_date: '2026-01-22',
      departure_time: '10:00:00',
      available_seats: 3,
      total_price: 40.00,
      notes: 'Family trip, child seats available, can stop for theme parks',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-6',
        name: 'Lisa Garcia',
        email: 'lisa@example.com',
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-7',
      driver_id: 'driver-7',
      origin_city: 'Seattle',
      origin_state: 'WA',
      destination_city: 'Portland',
      destination_state: 'OR',
      via_stops: 'Tacoma, Olympia',
      departure_date: '2026-01-25',
      departure_time: '09:30:00',
      available_seats: 2,
      total_price: 55.00,
      notes: 'Scenic route through mountains, can stop for coffee',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-7',
        name: 'Alex Chen',
        email: 'alex@example.com',
        avatar_url: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    },
    {
      id: 'trip-8',
      driver_id: 'driver-8',
      origin_city: 'Phoenix',
      origin_state: 'AZ',
      destination_city: 'Las Vegas',
      destination_state: 'NV',
      via_stops: undefined,
      departure_date: '2026-01-28',
      departure_time: '16:00:00',
      available_seats: 4,
      total_price: 65.00,
      notes: 'Evening trip, perfect for weekend getaway, can stop for dinner',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      driver: {
        id: 'driver-8',
        name: 'Maria Rodriguez',
        email: 'maria@example.com',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        created_at: '2025-01-01T00:00:00Z'
      }
    }
  ];

  const initialFilters: SearchFilters = {
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    departure_date: searchParams.get('departure_date') || '',
  };

  useEffect(() => {
    // Show all trips by default when page loads
    if (!initialFilters.origin && !initialFilters.destination && !initialFilters.departure_date) {
      setTrips([...postedRides, ...dummyTrips]);
      setHasSearched(true);
    } else {
    // If there are search params, perform initial search
      handleSearch(initialFilters);
    }
  }, [postedRides]); // Add postedRides as dependency so it updates when new rides are posted

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setHasSearched(true);

    // Update URL params
    const params = new URLSearchParams();
    if (filters.origin) params.set('origin', filters.origin);
    if (filters.destination) params.set('destination', filters.destination);
    if (filters.departure_date) params.set('departure_date', filters.departure_date);
    setSearchParams(params);

    // Combine posted rides with dummy trips (posted rides first)
    const allTrips = [...postedRides, ...dummyTrips];
    const results: Trip[] = [];

    allTrips.forEach(trip => {
      // Build the full route array
      const route = [
        `${trip.origin_city}, ${trip.origin_state}`.trim(),
        ...(trip.via_stops ? trip.via_stops.split(',').map(s => s.trim()) : []),
        `${trip.destination_city}, ${trip.destination_state}`.trim()
      ];

      // Find all valid segments (A → B) in the route
      const searchOrigin = filters.origin?.trim().toLowerCase();
      const searchDest = filters.destination?.trim().toLowerCase();
      const matchesDate = !filters.departure_date || trip.departure_date === filters.departure_date;

      // Try to match full trip first
      const fullOrigin = `${trip.origin_city}, ${trip.origin_state}`.toLowerCase();
      const fullDest = `${trip.destination_city}, ${trip.destination_state}`.toLowerCase();
      const isFullMatch =
        (!searchOrigin || fullOrigin.includes(searchOrigin)) &&
        (!searchDest || fullDest.includes(searchDest)) &&
        matchesDate;
      if (isFullMatch) {
        results.push(trip);
        return;
      }

      // Try to match segments
      for (let i = 0; i < route.length - 1; i++) {
        for (let j = i + 1; j < route.length; j++) {
          const segOrigin = route[i].toLowerCase();
          const segDest = route[j].toLowerCase();
          const originMatch = !searchOrigin || segOrigin.includes(searchOrigin);
          const destMatch = !searchDest || segDest.includes(searchDest);
          if (originMatch && destMatch && matchesDate) {
            // Create a virtual trip for this segment
            results.push({
              ...trip,
              id: `${trip.id}-segment-${i}-${j}`,
              origin_city: route[i].split(',')[0].trim(),
              origin_state: route[i].split(',')[1]?.trim() || '',
              destination_city: route[j].split(',')[0].trim(),
              destination_state: route[j].split(',')[1]?.trim() || '',
              total_price: Math.round((trip.total_price / 2) * 100) / 100, // half price, rounded
              notes: (trip.notes ? trip.notes + '\n' : '') + `Segment of longer ride: ${route[0]} → ${route[route.length-1]}`,
              // Mark as a segment for UI
              status: 'active',
            });
            return;
          }
        }
      }
    });

    setTrips(results);
    setLoading(false);
  };

  const handleViewDetails = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  const handleRequestRide = async (tripId: string) => {
    if (!user) {
      alert('Please sign in to request a ride.');
      return;
    }

    // Find the trip
    const trip = trips.find(t => t.id === tripId);
    if (!trip) {
      alert('Trip not found.');
      return;
    }

    // Add to booked rides
    addBookedRide(trip, 'trip');
    
    // Close modal if open
    if (isModalOpen) {
      setIsModalOpen(false);
      setSelectedTrip(null);
    }

    // Show success message
        alert('Ride request sent! The driver will be notified and can accept or decline your request.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Ride Detail Modal */}
      {selectedTrip && (
        <RideDetailModal
          trip={selectedTrip}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBookRide={handleRequestRide}
        />
      )}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Ride
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-300 ml-3" />
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect with trusted drivers for comfortable, affordable long-distance travel
            </p>
          </div>
        </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <SearchIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Search Available Rides</h2>
            </div>
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading} 
            initialFilters={initialFilters}
          />
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-ping"></div>
              </div>
              <p className="text-lg text-gray-600 font-medium">Searching for the perfect rides...</p>
              <p className="text-sm text-gray-500 mt-2">This will just take a moment</p>
            </div>
          </div>
        )}

        {!loading && hasSearched && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Available Rides
                  </h2>
                  <p className="text-lg text-gray-600">
                {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Live Results
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip, index) => (
                <div key={trip.id} className="hover:scale-[1.02] transition-transform duration-200">
                <TripCard 
                  trip={trip} 
                  onViewDetails={handleViewDetails}
                  onRequestRide={handleRequestRide}
                  showRequestButton={user?.id !== trip.driver_id}
                />
                </div>
              ))}
            </div>

            {trips.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No trips found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or check back later for new trips.
                  </p>
                  <button 
                    onClick={() => {
                      setTrips([...postedRides, ...dummyTrips]);
                      setHasSearched(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Show All Available Rides
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to travel?</h3>
              <p className="text-gray-600 mb-6">
                Enter your travel details above to find the perfect ride for your journey.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Try searching for popular routes like "Denver to Dallas" or "New York to Philadelphia"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;