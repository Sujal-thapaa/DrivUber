import React from 'react';
import { MapPin, Clock, Users, DollarSign, Calendar, User, Star, Route } from 'lucide-react';
import { Ride } from '../lib/supabase';

interface RideCardProps {
  ride: Ride;
  onBook?: (rideId: string) => void;
  onViewDetails?: (rideId: string) => void;
  showBookButton?: boolean;
  showViewButton?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ 
  ride, 
  onBook, 
  onViewDetails, 
  showBookButton = true,
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">{ride.origin}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">{ride.destination}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${ride.price}</div>
            <div className="text-green-100 text-sm">per seat</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Ride Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold text-gray-900">{formatDate(ride.datetime)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-semibold text-gray-900">{formatTime(ride.datetime)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-500">Seats</div>
              <div className="font-semibold text-gray-900">{ride.seats_available} available</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <User className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-500">Driver</div>
              <div className="font-semibold text-gray-900">{ride.driver?.name || 'Driver'}</div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <img 
            src={ride.driver?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'} 
            alt={ride.driver?.name || 'Driver'}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{ride.driver?.name || 'Driver'}</div>
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

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {showViewButton && (
            <button
              onClick={() => onViewDetails?.(ride.id)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2 group-hover:shadow-md"
            >
              <span>View Details</span>
            </button>
          )}
          {showBookButton && ride.seats_available > 0 && (
            <button
              onClick={() => onBook?.(ride.id)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Book Ride</span>
            </button>
          )}
          {ride.seats_available === 0 && (
            <div className="flex-1 bg-red-50 text-red-600 py-3 px-4 rounded-xl text-center font-medium border border-red-200">
              Fully Booked
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="mt-4 flex justify-center">
          {ride.seats_available > 0 ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {ride.seats_available} seat{ride.seats_available > 1 ? 's' : ''} available
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

export default RideCard;