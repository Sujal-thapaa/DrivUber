import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Car, Sparkles } from 'lucide-react';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';
  const [isLogin, setIsLogin] = useState(mode === 'signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, signInWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/search" />;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign-in failed';
      setError(errorMessage);
      
      // Show helpful message if Supabase is not configured
      if (errorMessage.includes('Supabase not configured')) {
        setError('Demo mode: Using mock authentication. To enable real Google sign-in, please configure Supabase in your .env file.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Car className="h-16 w-16 text-blue-600" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            DrivUber
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to continue your journey
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-4 px-6 border border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="text-sm text-red-600 text-center">{error}</div>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure authentication</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>One-click sign in</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No password required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;