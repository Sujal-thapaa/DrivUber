# Google Authentication Setup Guide

Your DrivUber app is currently running in **demo mode** with mock authentication. To enable real Google sign-in with your Google account, follow these steps:

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be set up (this takes a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**

## Step 3: Set Up Google OAuth in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it on
3. You'll need to set up a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Set the application type to **Web application**
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback` (replace with your actual Supabase URL)
     - `http://localhost:5173/auth/callback` (for local development)
4. Copy the **Client ID** and **Client Secret** and paste them into your Supabase Google provider settings

## Step 4: Create Your .env File

Create a `.env` file in your project root with your actual credentials:

```env
# Google Maps API Configuration (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Restart Your Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Step 6: Test Google Authentication

1. Go to your app's sign-in page
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you'll be redirected back to your app with your real Google account

## Troubleshooting

### Common Issues:

1. **"Supabase not configured" error**: Make sure your `.env` file has the correct Supabase URL and key
2. **OAuth redirect error**: Check that your redirect URIs are correctly configured in both Google Cloud Console and Supabase
3. **Google OAuth not working**: Make sure you've enabled the Google provider in Supabase and added the correct Client ID and Secret

### Current Status:
- ✅ App is working in demo mode
- ❌ Real Google authentication not configured
- ❌ Supabase not set up

Once you complete these steps, your app will use real Google authentication instead of the demo mode! 