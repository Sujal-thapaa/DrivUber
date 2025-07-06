import React, { useState } from 'react';
import { SearchFilters } from '../lib/supabase';
import { MapPin, Calendar, Search, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  initialFilters?: Partial<SearchFilters>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false, initialFilters = {} }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    origin: initialFilters.origin || '',
    destination: initialFilters.destination || '',
    departure_date: initialFilters.departure_date || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative group">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            name="origin"
            placeholder="From (City, State)"
            value={filters.origin}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
          />
        </div>
        
        <div className="relative group">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            name="destination"
            placeholder="To (City, State)"
            value={filters.destination}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
          />
        </div>
        
        <div className="relative group">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="date"
            name="departure_date"
            value={filters.departure_date}
            onChange={handleInputChange}
            min={minDate}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Search Rides</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Search Suggestions */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center mb-3">
          <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Popular Routes</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { origin: 'Denver', destination: 'Dallas' },
            { origin: 'New York', destination: 'Philadelphia' },
            { origin: 'Los Angeles', destination: 'San Francisco' },
            { origin: 'Chicago', destination: 'Detroit' }
          ].map((route, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setFilters({
                  origin: route.origin,
                  destination: route.destination,
                  departure_date: filters.departure_date
                });
              }}
              className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
            >
              {route.origin} → {route.destination}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default SearchForm;