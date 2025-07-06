import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X, MapPin, Clock, DollarSign, Users, Calendar, Eye } from 'lucide-react';
import { Trip, Ride } from '../lib/supabase';
import RideDetailModal from './RideDetailModal';

interface BookedRide {
  id: string;
  type: 'trip' | 'ride';
  data: Trip | Ride;
  bookedAt: string;
}

interface BookedRidesProps {
  bookedRides: BookedRide[];
  onRemoveRide: (rideId: string) => void;
}

const BookedRides: React.FC<BookedRidesProps> = ({ bookedRides, onRemoveRide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<BookedRide | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  const getRideInfo = (bookedRide: BookedRide) => {
    if (bookedRide.type === 'trip') {
      const trip = bookedRide.data as Trip;
      return {
        origin: `${trip.origin_city}, ${trip.origin_state}`,
        destination: `${trip.destination_city}, ${trip.destination_state}`,
        date: trip.departure_date,
        time: trip.departure_time,
        price: trip.total_price,
        driver: trip.driver?.name || 'Driver',
        seats: trip.available_seats,
      };
    } else {
      const ride = bookedRide.data as Ride;
      return {
        origin: ride.origin,
        destination: ride.destination,
        date: ride.datetime.split('T')[0],
        time: ride.datetime,
        price: ride.price,
        driver: ride.driver?.name || 'Driver',
        seats: ride.seats_available,
      };
    }
  };

  const handleViewDetails = (bookedRide: BookedRide) => {
    setSelectedRide(bookedRide);
    setIsDetailModalOpen(true);
    setIsOpen(false); // Close the dropdown
  };

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 400; // Approximate height of dropdown
    
    // Check if there's enough space below the button
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    // If there's not enough space below but more space above, open upward
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRide(null);
  };

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        ref={buttonRef}
        data-booked-rides-button
        onClick={handleToggleDropdown}
        className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
      >
        <ShoppingCart className="h-5 w-5 text-blue-600" />
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          Booked Rides
        </span>
        {bookedRides.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {bookedRides.length}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute ${
            dropdownPosition === 'bottom' 
              ? 'top-full mt-2' 
              : 'bottom-full mb-2'
          } right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden animate-in slide-in-from-top duration-200 backdrop-blur-sm`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900">Booked Rides</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Rides List */}
          <div className="max-h-80 overflow-y-auto">
            {bookedRides.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No rides booked yet</p>
                <p className="text-gray-400 text-xs mt-1">Your booked rides will appear here</p>
              </div>
            ) : (
              <div className="p-2">
                {bookedRides.map((bookedRide) => {
                  const rideInfo = getRideInfo(bookedRide);
                  return (
                    <div
                      key={bookedRide.id}
                      className="bg-gray-50 rounded-xl p-3 mb-2 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(bookedRide)}
                    >
                      {/* Route */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{rideInfo.origin}</div>
                            <div className="text-gray-500">→ {rideInfo.destination}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(bookedRide);
                            }}
                            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-3 w-3 text-blue-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveRide(bookedRide.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            title="Remove Ride"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{formatDate(rideInfo.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{formatTime(rideInfo.time)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">${rideInfo.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{rideInfo.seats} seats</span>
                        </div>
                      </div>

                      {/* Driver */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Driver: <span className="font-medium text-gray-700">{rideInfo.driver}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mt-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Request Sent
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {bookedRides.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Booked:</span>
                <span className="font-semibold text-gray-900">{bookedRides.length} ride{bookedRides.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Ride Detail Modal */}
      {selectedRide && (
        <RideDetailModal
          trip={selectedRide.type === 'trip' ? selectedRide.data as Trip : undefined}
          ride={selectedRide.type === 'ride' ? selectedRide.data as Ride : undefined}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onBookRide={() => {}} // No-op since this is already booked
          isBooked={true} // This is a booked ride
        />
      )}
    </div>
  );
};

export default BookedRides; 