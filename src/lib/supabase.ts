import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key'

// Create a mock client for development without environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for stories
export interface Story {
  id: string
  prompt: string
  story: string
  image_url?: string
  created_at: string
  user_id?: string
}

// Database types for images
export interface GeneratedImage {
  id: string
  story_id: string
  image_url: string
  prompt: string
  created_at: string
}
