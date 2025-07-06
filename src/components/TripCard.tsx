import React from 'react';
import { MapPin, Clock, Users, DollarSign, Calendar, Car, Star, Route } from 'lucide-react';
import { Trip } from '../lib/supabase';

interface TripCardProps {
  trip: Trip;
  onViewDetails?: (tripId: string) => void;
  onRequestRide?: (tripId: string) => void;
  showRequestButton?: boolean;
  showViewButton?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onViewDetails, 
  onRequestRide, 
  showRequestButton = false,
  showViewButton = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">
                {trip.origin_city}, {trip.origin_state}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">
                {trip.destination_city}, {trip.destination_state}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${trip.total_price}</div>
            <div className="text-blue-100 text-sm">total trip</div>
          </div>
        </div>
        
        {trip.via_stops && (
          <div className="flex items-center space-x-2 bg-white bg-opacity-10 rounded-lg p-3">
            <Route className="h-4 w-4" />
            <span className="text-sm font-medium">Via: {trip.via_stops}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Trip Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold text-gray-900">{formatDate(trip.departure_date)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-semibold text-gray-900">{formatTime(trip.departure_time)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-500">Seats</div>
              <div className="font-semibold text-gray-900">{trip.available_seats} available</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Car className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-500">Driver</div>
              <div className="font-semibold text-gray-900">{trip.driver?.name || 'Driver'}</div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <img 
            src={trip.driver?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'} 
            alt={trip.driver?.name || 'Driver'}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{trip.driver?.name || 'Driver'}</div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">(4.9)</span>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Verified
          </div>
        </div>

        {/* Notes */}
        {trip.notes && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 mt-0.5">💡</div>
              <div>
                <div className="font-medium text-yellow-800 mb-1">Trip Notes</div>
                <div className="text-sm text-yellow-700">{trip.notes}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {showViewButton && (
            <button
              onClick={() => onViewDetails?.(trip.id)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2 group-hover:shadow-md"
            >
              <span>View Details</span>
            </button>
          )}
          {showRequestButton && trip.available_seats > 0 && (
            <button
              onClick={() => onRequestRide?.(trip.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Request Ride</span>
            </button>
          )}
          {trip.available_seats === 0 && (
            <div className="flex-1 bg-red-50 text-red-600 py-3 px-4 rounded-xl text-center font-medium border border-red-200">
              Fully Booked
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="mt-4 flex justify-center">
          {trip.available_seats > 0 ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {trip.available_seats} seat{trip.available_seats > 1 ? 's' : ''} available
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              No seats available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;