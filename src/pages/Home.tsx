import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Users, DollarSign, Shield, Clock, Search, Sparkles, ArrowRight, Star } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { SearchFilters } from '../lib/supabase';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (filters: SearchFilters) => {
    setSearchLoading(true);
    // Navigate to search page with filters
    const params = new URLSearchParams();
    if (filters.origin) params.set('origin', filters.origin);
    if (filters.destination) params.set('destination', filters.destination);
    if (filters.departure_date) params.set('departure_date', filters.departure_date);
    
    navigate(`/search?${params.toString()}`);
    setSearchLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Car className="h-20 w-20 text-yellow-300 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-bounce" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Long-Distance <span className="text-yellow-300">Ride Sharing</span>
            </h1>
            <p className="text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect with drivers and passengers for intercity travel. Share the journey, split the costs, and make new connections across the country.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-center text-white mb-8">
                Find Your Next Ride
              </h2>
              <SearchForm onSearch={handleSearch} loading={searchLoading} />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-10 py-4 rounded-2xl text-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-yellow-500/25"
            >
              <Search className="h-6 w-6" />
              <span>Browse All Rides</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="bg-white/20 backdrop-blur-md text-white border-2 border-white/30 px-10 py-4 rounded-2xl text-xl font-bold hover:bg-white/30 transition-all duration-300 backdrop-blur-md"
            >
              Join DrivUber
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DrivUber</span>?
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The smart way to travel long distances with convenience, affordability, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 shadow-lg">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Money</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Split fuel and travel costs. Save up to 70% compared to flying or taking the bus for long-distance trips.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet People</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect with fellow travelers and make new friends during your intercity journeys.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Safe & Secure</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Verified driver profiles and secure messaging system ensure your safety and peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Getting started is simple. Follow these easy steps to begin your long-distance travel journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Search</h3>
              <p className="text-gray-600 text-lg">Find rides that match your route and travel dates</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Request</h3>
              <p className="text-gray-600 text-lg">Send a ride request to the driver with your details</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 text-lg">Chat with your driver once your request is accepted</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl mb-6 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Travel</h3>
              <p className="text-gray-600 text-lg">Enjoy your journey and arrive at your destination</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-300">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Cities Connected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-300">Miles Traveled</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9</div>
              <div className="flex justify-center items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-gray-300">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of travelers who are already saving money and making connections through DrivUber.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 px-12 py-4 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-white/25"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;