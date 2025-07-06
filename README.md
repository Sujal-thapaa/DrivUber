# DrivUber MVP - Long-Distance Ride Sharing Platform

A comprehensive MVP web application for long-distance ride sharing, connecting drivers and passengers for intercity travel.

## Features

### Core User Flows

**Guest Users:**
- Browse homepage with search functionality
- Search for rides by origin, destination, and departure date
- View trip details and driver information
- No registration required for browsing

**Riders (Registered Users):**
- Register and log in with email/password
- Search and filter available trips
- Request rides from drivers
- Real-time chat with drivers (activated after request acceptance)
- Dashboard to manage ride requests and view trip history

**Drivers (Registered Users):**
- Register with vehicle information (make, model, license plate)
- Post long-distance trips with detailed route information
- Manage incoming ride requests (accept/decline)
- Real-time chat with accepted passengers
- Dashboard to manage posted trips and requests

### Technical Features

- **Authentication**: Secure user registration and login with Supabase Auth
- **Real-time Chat**: In-app messaging system between drivers and passengers
- **Responsive Design**: Mobile-first design optimized for all devices
- **Search & Filtering**: Advanced search with multiple criteria
- **Database**: PostgreSQL with Supabase for scalable data management
- **Security**: Row Level Security (RLS) policies for data protection

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database + Authentication + Real-time)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd drivuber-mvp
npm install
```

### 2. Set up Supabase (Optional for Demo)

**For Demo/Development (Current Setup):**
The app currently uses a mock authentication system that works without any backend setup. You can run the app immediately without configuring Supabase.

**For Production with Real Authentication:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Create a `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. **For Google OAuth to work:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Secret)
   - Add your redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

### 3. Set up Database

1. In your Supabase dashboard, go to SQL Editor
2. Run the SQL migration script located in `supabase/migrations/create_drivuber_schema.sql`
3. This will create all necessary tables, security policies, and indexes

### 4. Google Maps API Setup

**Required for Live Maps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Maps JavaScript API** (for interactive maps)
   - **Directions API** (for route planning)
   - **Geocoding API** (for address conversion)
   - **Places API** (for location search)
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key
5. Restrict the API key (recommended):
   - Click on the created API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add: `http://localhost:5173/*` (for development)
   - Under "API restrictions", select "Restrict key" and choose the APIs above
6. Create a `.env` file in the project root and add:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

**Note:** Without a valid API key, the app will show a placeholder map with route information.

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

### Users Table
- `id` (uuid, PK) - User ID from Supabase Auth
- `email` (text) - User's email address
- `first_name` (text) - User's first name
- `last_name` (text) - User's last name
- `phone` (text) - Phone number
- `user_type` (enum) - rider, driver, or both
- `vehicle_make` (text) - Vehicle make (for drivers)
- `vehicle_model` (text) - Vehicle model (for drivers)
- `license_plate` (text) - License plate (for drivers)

### Trips Table
- `id` (uuid, PK) - Unique trip identifier
- `driver_id` (uuid, FK) - Reference to users table
- `origin_city` (text) - Starting city
- `origin_state` (text) - Starting state
- `destination_city` (text) - Destination city
- `destination_state` (text) - Destination state
- `via_stops` (text) - Optional intermediate stops
- `departure_date` (date) - Departure date
- `departure_time` (time) - Departure time
- `available_seats` (integer) - Number of available seats
- `total_price` (decimal) - Total trip price
- `notes` (text) - Optional trip notes
- `status` (enum) - active, completed, cancelled

### Ride Requests Table
- `id` (uuid, PK) - Unique request identifier
- `trip_id` (uuid, FK) - Reference to trips table
- `rider_id` (uuid, FK) - Reference to users table
- `status` (enum) - pending, accepted, declined, cancelled
- `message` (text) - Optional request message

### Chat Messages Table
- `id` (uuid, PK) - Unique message identifier
- `ride_request_id` (uuid, FK) - Reference to ride_requests table
- `sender_id` (uuid, FK) - Reference to users table
- `message` (text) - Message content

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication Required**: All operations require authentication
- **Data Isolation**: Users can only access their own data
- **Secure Messaging**: Chat only available for accepted ride requests

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── TripCard.tsx
│   ├── TripForm.tsx
│   ├── SearchForm.tsx
│   ├── ChatWindow.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/               # Utilities and configurations
│   └── supabase.ts
├── pages/             # Page components
│   ├── Home.tsx
│   ├── Auth.tsx
│   ├── Search.tsx
│   ├── PostTrip.tsx
│   └── MyTrips.tsx
└── App.tsx            # Main app component
```

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred platform
3. Set environment variables in your deployment platform

### Database (Supabase)

- Database is automatically hosted and managed by Supabase
- No additional deployment steps required

## MVP Constraints & Future Enhancements

**Current MVP Limitations:**
- Payment handled directly between users (no in-app payments)
- No real-time GPS tracking
- Basic driver verification (manual review)
- No rating/review system
- Simple in-app notifications only

**Future Enhancement Opportunities:**
- Stripe payment integration
- Real-time location tracking
- Automated background checks
- Rating and review system
- Push notifications
- Mobile app development
- Advanced route optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.