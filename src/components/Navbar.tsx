import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookedRides from './BookedRides';
import ChatModal from './ChatModal';
import { Car, User, LogOut, Search, MapPin, Sparkles, MessageCircle, Plus, Star, Phone, Mail, Calendar, ChevronDown, Settings, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut, bookedRides, removeBookedRide } = useAuth();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50';
  };

  // Mock user stats for demo
  const userStats = {
    rating: 4.8,
    totalRides: 47,
    memberSince: '2023',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    licensePlate: 'ABC-1234',
    phone: '+1 (555) 123-4567'
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Car className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DrivUber
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/search"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${isActive('/search')}`}
            >
              <Search className="h-4 w-4" />
              <span>Find Rides</span>
            </Link>
            <Link
              to="/post-ride"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${isActive('/post-ride')}`}
            >
              <Plus className="h-4 w-4" />
              <span>Post Ride</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Booked Rides Cart */}
            <BookedRides 
              bookedRides={bookedRides} 
              onRemoveRide={removeBookedRide} 
            />
            
            {/* Chat Icon */}
            {user && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                title="Chat with drivers"
              >
                <MessageCircle className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            )}
            
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-xl border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
              >
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.first_name} {user.last_name}
                </span>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        driverName="Driver"
        chatType="driver"
      />
    </nav>
  );
};

export default Navbar;