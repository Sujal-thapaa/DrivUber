import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, Users, DollarSign, Car, Star, MessageCircle, Calendar } from 'lucide-react';
import { Trip, User, Ride } from '../lib/supabase';
import RouteMap from './RouteMap';
import ChatModal from './ChatModal';

interface RideDetailModalProps {
  trip?: Trip;
  ride?: Ride;
  isOpen: boolean;
  onClose: () => void;
  onBookRide: (rideId: string) => void;
  isBooked?: boolean; // New prop to indicate if this is a booked ride
}

const RideDetailModal: React.FC<RideDetailModalProps> = ({
  trip,
  ride,
  isOpen,
  onClose,
  onBookRide,
  isBooked = false,
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!isOpen || (!trip && !ride)) return null;

  // Use trip data if available, otherwise use ride data
  const rideData = trip || ride;
  const isTrip = !!trip;

  const handleBookRide = async () => {
    setIsBooking(true);
    try {
      await onBookRide(rideData!.id);
      // Close modal after successful booking
      onClose();
    } catch (error) {
      console.error('Error booking ride:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (isTrip) {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  // Extract origin and destination
  const origin = isTrip ? `${trip!.origin_city}, ${trip!.origin_state}` : ride!.origin;
  const destination = isTrip ? `${trip!.destination_city}, ${trip!.destination_state}` : ride!.destination;
  const viaStops = isTrip ? trip!.via_stops : undefined;
  const departureDate = isTrip ? trip!.departure_date : ride!.datetime.split('T')[0];
  const departureTime = isTrip ? trip!.departure_time : ride!.datetime;
  const availableSeats = isTrip ? trip!.available_seats : ride!.seats_available;
  const price = isTrip ? trip!.total_price : ride!.price;
  const notes = isTrip ? trip!.notes : undefined;
  const driver = isTrip ? trip!.driver : ride!.driver;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-[9999] overflow-y-auto" style={{ position: 'fixed', zIndex: 9999 }}>
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Ride Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Map Section */}
          <div className="lg:w-1/2 p-6">
            <RouteMap 
              origin={origin}
              destination={destination}
              viaStops={viaStops}
              className="h-80"
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            {/* Driver Info */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3">
                  {driver?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{driver?.name || 'Driver'}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>4.8 (24 reviews)</span>
                  </div>
                </div>
              </div>
              
              {driver?.vehicle_make && (
                <div className="flex items-center text-sm text-gray-600">
                  <Car className="w-4 h-4 mr-2" />
                  <span>{driver.vehicle_make} {driver.vehicle_model}</span>
                </div>
              )}
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Ride Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Date</span>
                  </div>
                  <span className="font-medium">{formatDate(departureDate)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Time</span>
                  </div>
                  <span className="font-medium">{formatTime(departureTime)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Available Seats</span>
                  </div>
                  <span className="font-medium">{availableSeats}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Price per Seat</span>
                  </div>
                  <span className="font-medium text-green-600">${price}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="bg-white rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-600 text-sm">{notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isBooked ? (
                <button
                  onClick={handleBookRide}
                  disabled={isBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Request Ride
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-xl font-semibold text-center border border-green-200">
                  ✓ Ride Requested
                </div>
              )}
              
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Driver
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        driverName={driver?.name || 'Driver'}
        chatType="driver"
      />
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default RideDetailModal; 