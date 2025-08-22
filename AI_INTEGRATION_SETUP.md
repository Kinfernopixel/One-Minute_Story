# AI Integration Setup Guide

This guide will help you set up the real AI integration with Supabase and OpenAI for the One-Minute Story app.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **OpenAI API Key**: Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)

## Step 1: Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Step 2: Supabase Database Setup

1. Go to your Supabase dashboard
2. Create a new project or use an existing one
3. Go to the SQL Editor and run the following SQL to create the stories table:

## Step 3: Deploy Edge Function

1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
4. Deploy the Edge Function: `supabase functions deploy generate-story`
5. Set the OpenAI API key as a secret: `supabase secrets set OPENAI_API_KEY=your_openai_api_key`

```sql
-- Create stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  story TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (you can modify this based on your needs)
CREATE POLICY "Allow public read access" ON stories
  FOR SELECT USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access" ON stories
  FOR INSERT WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access" ON stories
  FOR DELETE USING (true);
```

## Step 4: Get Your API Keys

### Supabase
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Paste them in your `.env.local` file

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and paste it in your `.env.local` file

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the app
3. Try creating a story with a prompt
4. The app should now generate real stories using GPT-4 and images using DALL-E 3

## Features

- **GPT-4 Story Generation**: Creates engaging, creative stories based on user prompts
- **DALL-E 3 Image Generation**: Generates beautiful illustrations for each story
- **Supabase Database**: Stores stories and images persistently
- **Real-time Updates**: Stories are saved and retrieved from the database

## Security Notes

✅ **Secure Implementation**: This implementation uses Supabase Edge Functions to handle OpenAI API calls securely. Your API keys are never exposed to the frontend.

For additional security, consider:
1. Implementing user authentication with Supabase Auth
2. Adding rate limiting to the Edge Function
3. Setting up proper CORS policies for production

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that your `.env.local` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **"Failed to generate story"**
   - Verify your OpenAI API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure you're not hitting rate limits

3. **Database connection errors**
   - Verify your Supabase URL and anon key
   - Check that the stories table was created correctly
   - Ensure RLS policies are set up properly

### Rate Limits

- OpenAI has rate limits based on your account tier
- DALL-E 3 has specific rate limits for image generation
- Consider implementing retry logic and user feedback for rate limit scenarios

## Next Steps

1. **Authentication**: Add user authentication with Supabase Auth
2. **User Stories**: Associate stories with specific users
3. **Image Storage**: Store generated images in Supabase Storage
4. **Sharing**: Implement story sharing functionality
5. **Analytics**: Track story generation usage and popular prompts

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test your API keys independently
4. Check Supabase and OpenAI documentation for updates
