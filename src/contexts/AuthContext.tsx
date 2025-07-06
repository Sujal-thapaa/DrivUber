import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User, Trip, Ride } from '../lib/supabase';

interface BookedRide {
  id: string;
  type: 'trip' | 'ride';
  data: Trip | Ride;
  bookedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  bookedRides: BookedRide[];
  postedRides: Trip[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  addBookedRide: (ride: Trip | Ride, type: 'trip' | 'ride') => void;
  removeBookedRide: (rideId: string) => void;
  addPostedRide: (ride: Trip) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedRides, setBookedRides] = useState<BookedRide[]>([]);
  const [postedRides, setPostedRides] = useState<Trip[]>([]);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        // First check localStorage for demo user
        const storedUser = localStorage.getItem('drivuber-user');
        if (storedUser) {
          const mockUser = JSON.parse(storedUser);
          setUser(mockUser);
          
          // Load booked rides from localStorage
          const storedBookedRides = localStorage.getItem('drivuber-booked-rides');
          if (storedBookedRides) {
            setBookedRides(JSON.parse(storedBookedRides));
          }

          // Load posted rides from localStorage
          const storedPostedRides = localStorage.getItem('drivuber-posted-rides');
          if (storedPostedRides) {
            setPostedRides(JSON.parse(storedPostedRides));
          }
          
          setLoading(false);
          return;
        }

        // Then check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Create a mock user object from the session
          const mockUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url,
            first_name: session.user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            user_type: 'rider',
            created_at: session.user.created_at,
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const mockUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url,
            first_name: session.user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            user_type: 'rider',
            created_at: session.user.created_at,
          };
          setUser(mockUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);



  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
        // Fall back to demo mode if Supabase is not configured
        console.log('Supabase not configured, using demo mode');
        
        const mockUser: User = {
          id: 'demo-user-' + Date.now(),
          email: 'demo@example.com',
          name: 'Demo User',
          avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          first_name: 'Demo',
          last_name: 'User',
          user_type: 'rider',
          created_at: new Date().toISOString(),
        };

        // Simulate a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(mockUser);
        localStorage.setItem('drivuber-user', JSON.stringify(mockUser));
        return;
      }
      
      // Use real Google OAuth with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/search`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // The user will be set automatically by the auth state change listener
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear user state
      setUser(null);
      
      // Remove from localStorage
      localStorage.removeItem('drivuber-user');
      localStorage.removeItem('drivuber-booked-rides');
      localStorage.removeItem('drivuber-posted-rides');
      
      // Sign out from Supabase if there's a session
      await supabase.auth.signOut();
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addBookedRide = (ride: Trip | Ride, type: 'trip' | 'ride') => {
    const newBookedRide: BookedRide = {
      id: `${ride.id}-${Date.now()}`, // Make ID unique by adding timestamp
      type,
      data: ride,
      bookedAt: new Date().toISOString(),
    };
    setBookedRides(prev => {
      const updated = [...prev, newBookedRide];
      localStorage.setItem('drivuber-booked-rides', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookedRide = (rideId: string) => {
    setBookedRides(prev => {
      const updated = prev.filter(ride => ride.id !== rideId);
      localStorage.setItem('drivuber-booked-rides', JSON.stringify(updated));
      return updated;
    });
  };

  const addPostedRide = (ride: Trip) => {
    setPostedRides(prev => {
      const updated = [ride, ...prev]; // Add new ride at the beginning
      localStorage.setItem('drivuber-posted-rides', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    bookedRides,
    postedRides,
    signInWithGoogle,
    signOut,
    addBookedRide,
    removeBookedRide,
    addPostedRide,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};