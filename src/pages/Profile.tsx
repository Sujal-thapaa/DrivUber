import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Star, Car, Phone, Mail, Calendar, Settings, Shield, LogOut, Edit, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user stats - in a real app, this would come from the database
  const userStats = {
    rating: 4.8,
    totalRides: 47,
    memberSince: 2023,
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    licensePlate: 'ABC-1234',
    phone: '+1 (555) 123-4567',
    completedRides: 42,
    totalEarnings: 1250,
    averageRating: 4.8,
    responseRate: 98
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h2>
          <Link
            to="/auth"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/search"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(userStats.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 ml-2">{userStats.rating}</span>
                </div>

                <div className="text-sm text-gray-600">
                  Member since {userStats.memberSince}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalRides}</div>
                  <div className="text-sm text-gray-600">Total Rides</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{userStats.completedRides}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">{userStats.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'vehicle', label: 'Vehicle', icon: Car },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Statistics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total Earnings</p>
                            <p className="text-2xl font-bold text-blue-900">${userStats.totalEarnings}</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Response Rate</p>
                            <p className="text-2xl font-bold text-green-900">{userStats.responseRate}%</p>
                          </div>
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Average Rating</p>
                            <p className="text-2xl font-bold text-purple-900">{userStats.averageRating}</p>
                          </div>
                          <Star className="h-8 w-8 text-purple-600 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Completed ride from Denver to Boulder</span>
                          </div>
                          <span className="text-sm text-gray-500">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Posted new ride to Colorado Springs</span>
                          </div>
                          <span className="text-sm text-gray-500">1 day ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Received 5-star rating</span>
                          </div>
                          <span className="text-sm text-gray-500">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'vehicle' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make</label>
                          <div className="bg-white px-4 py-3 rounded-lg border">
                            {userStats.vehicleMake}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                          <div className="bg-white px-4 py-3 rounded-lg border">
                            {userStats.vehicleModel}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                          <div className="bg-white px-4 py-3 rounded-lg border font-mono">
                            {userStats.licensePlate}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                          <div className="bg-white px-4 py-3 rounded-lg border">
                            2020
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Car className="h-5 w-5 mr-2" />
                        Vehicle Status
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-900">Vehicle verified and active</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                            <p className="text-sm text-gray-600">Manage your privacy preferences</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Notifications</h4>
                            <p className="text-sm text-gray-600">Configure notification preferences</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Payment Methods</h4>
                            <p className="text-sm text-gray-600">Manage your payment options</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing icon components
const Bell = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l2.5 2.5H2.5L5 14.25v-4.5a6 6 0 0 1 6-6z" />
  </svg>
);

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export default Profile; 