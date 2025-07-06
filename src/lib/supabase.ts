import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client if environment variables are not provided
export const supabase = supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here'
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Mock Supabase client for development
      auth: {
        signInWithOAuth: async () => ({ 
          data: null, 
          error: new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file') 
        }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null })
      })
    };

// Types
export type UserType = 'rider' | 'driver' | 'both';
export type TripStatus = 'active' | 'completed' | 'cancelled';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_type?: UserType;
  vehicle_make?: string;
  vehicle_model?: string;
  license_plate?: string;
  created_at: string;
  updated_at?: string;
}

export interface Trip {
  id: string;
  driver_id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  via_stops?: string;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  total_price: number;
  notes?: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
  driver?: User;
}

export interface RideRequest {
  id: string;
  trip_id: string;
  rider_id: string;
  status: RequestStatus;
  message?: string;
  created_at: string;
  updated_at: string;
  trip?: Trip;
  rider?: User;
}

export interface ChatMessage {
  id: string;
  ride_request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: User;
}

export interface TripFormData {
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  via_stops?: string;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  total_price: number;
  notes?: string;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  departure_date: string;
}

// Legacy types for backward compatibility
export interface Ride {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  datetime: string;
  price: number;
  seats_available: number;
  passengers: string[];
  created_at: string;
  driver?: User;
}

export interface RideFormData {
  origin: string;
  destination: string;
  datetime: string;
  price: number;
  seats_available: number;
}