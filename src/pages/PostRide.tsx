import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign, Plus, X, Car, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Trip } from '../lib/supabase';

interface RideFormData {
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  stops: string[];
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  notes: string;
  preferences: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
    musicPreference: string;
  };
}

const PostRide: React.FC = () => {
  const { user, addPostedRide } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStop, setNewStop] = useState('');
  
  const [formData, setFormData] = useState<RideFormData>({
    origin: '',
    destination: '',
    date: '',
    time: '',
    availableSeats: 1,
    price: 0,
    stops: [],
    vehicleInfo: {
      make: '',
      model: '',
      color: '',
      licensePlate: ''
    },
    notes: '',
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicPreference: 'Any'
    }
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RideFormData] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addStop = () => {
    if (newStop.trim() && !formData.stops.includes(newStop.trim())) {
      setFormData(prev => ({
        ...prev,
        stops: [...prev.stops, newStop.trim()]
      }));
      setNewStop('');
    }
  };

  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a Trip object from the form data
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        driver_id: user?.id || 'demo-driver',
        origin_city: formData.origin.split(',')[0]?.trim() || formData.origin,
        origin_state: formData.origin.split(',')[1]?.trim() || 'Unknown',
        destination_city: formData.destination.split(',')[0]?.trim() || formData.destination,
        destination_state: formData.destination.split(',')[1]?.trim() || 'Unknown',
        via_stops: formData.stops.length > 0 ? formData.stops.join(', ') : undefined,
        departure_date: formData.date,
        departure_time: formData.time + ':00',
        available_seats: formData.availableSeats,
        total_price: formData.price,
        notes: formData.notes || `${formData.vehicleInfo.make} ${formData.vehicleInfo.model} (${formData.vehicleInfo.color}). Music: ${formData.preferences.musicPreference}. ${formData.preferences.smokingAllowed ? 'Smoking allowed.' : ''} ${formData.preferences.petsAllowed ? 'Pets allowed.' : ''}`,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        driver: {
          id: user?.id || 'demo-driver',
          name: user?.name || 'Demo Driver',
          email: user?.email || 'driver@example.com',
          avatar_url: user?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          created_at: user?.created_at || new Date().toISOString()
        }
      };

      // Add the ride to the global state
      addPostedRide(newTrip);
      
      // Reset form
      setFormData({
        origin: '',
        destination: '',
        date: '',
        time: '',
        availableSeats: 1,
        price: 0,
        stops: [],
        vehicleInfo: {
          make: '',
          model: '',
          color: '',
          licensePlate: ''
        },
        notes: '',
        preferences: {
          smokingAllowed: false,
          petsAllowed: false,
          musicPreference: 'Any'
        }
      });

      alert('Ride posted successfully! You can now see it in the "Find Rides" page.');
    } catch (error) {
      console.error('Error posting ride:', error);
      alert('Error posting ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a Ride</h1>
          <p className="text-gray-600">Share your journey and help others get around</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Trip Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                Trip Details
              </h2>

              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Enter destination"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Seats and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Available Seats *
                  </label>
                  <select
                    required
                    value={formData.availableSeats}
                    onChange={(e) => handleInputChange('availableSeats', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price per Seat *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Stops */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stops (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newStop}
                    onChange={(e) => setNewStop(e.target.value)}
                    placeholder="Add a stop"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())}
                  />
                  <button
                    type="button"
                    onClick={addStop}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {formData.stops.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.stops.map((stop, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{stop}</span>
                        <button
                          type="button"
                          onClick={() => removeStop(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Vehicle & Preferences */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="w-6 h-6 mr-2 text-blue-600" />
                Vehicle & Preferences
              </h2>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleInfo.make}
                      onChange={(e) => handleInputChange('vehicleInfo.make', e.target.value)}
                      placeholder="e.g., Toyota"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleInfo.model}
                      onChange={(e) => handleInputChange('vehicleInfo.model', e.target.value)}
                      placeholder="e.g., Camry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleInfo.color}
                      onChange={(e) => handleInputChange('vehicleInfo.color', e.target.value)}
                      placeholder="e.g., Blue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleInfo.licensePlate}
                      onChange={(e) => handleInputChange('vehicleInfo.licensePlate', e.target.value)}
                      placeholder="e.g., ABC123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
        </div>
      </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Ride Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.smokingAllowed}
                      onChange={(e) => handleInputChange('preferences.smokingAllowed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Smoking allowed</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.petsAllowed}
                      onChange={(e) => handleInputChange('preferences.petsAllowed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pets allowed</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Music Preference
                  </label>
                  <select
                    value={formData.preferences.musicPreference}
                    onChange={(e) => handleInputChange('preferences.musicPreference', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Any">Any music</option>
                    <option value="No music">No music</option>
                    <option value="Classical">Classical</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Electronic">Electronic</option>
                  </select>
          </div>
        </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information for passengers..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
        </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Posting Ride...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Post Ride
                </>
              )}
            </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default PostRide;