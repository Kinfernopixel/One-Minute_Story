import { supabase, Story, GeneratedImage } from './supabase'

// Note: This service now uses Supabase Edge Functions for secure AI generation

export interface StoryGenerationResult {
  story: string
  imageUrl?: string
  error?: string
}

export class AIService {
  static async generateStory(prompt: string): Promise<StoryGenerationResult> {
    try {
      // Check if we have proper environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Return mock data for development without proper setup
        return {
          story: `Once upon a time, ${prompt.toLowerCase()}. This is a demo story to show the UI changes! The magical world came alive with your creative prompt, and adventures unfolded beyond imagination.`,
          imageUrl: "https://via.placeholder.com/1024x1024/4F46E5/FFFFFF?text=AI+Generated+Image+Demo"
        }
      }

      // Call the Supabase Edge Function for secure AI generation
      const { data, error } = await supabase.functions.invoke('generate-story', {
        body: { prompt }
      })

      if (error) {
        console.error('Edge Function error:', error)
        return {
          story: '',
          error: error.message || 'Failed to generate story'
        }
      }

      if (!data || !data.success) {
        return {
          story: '',
          error: data?.error || 'Failed to generate story'
        }
      }

      return {
        story: data.story,
        imageUrl: data.imageUrl
      }
    } catch (error) {
      console.error('Error generating story:', error)
      return {
        story: '',
        error: error instanceof Error ? error.message : 'Failed to generate story'
      }
    }
  }

  static async saveStoryToDatabase(prompt: string, story: string, imageUrl?: string): Promise<Story | null> {
    try {
      // Check if we have proper environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Return mock data for development without proper setup
        return {
          id: Date.now().toString(),
          prompt,
          story,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          user_id: undefined
        }
      }

      const { data, error } = await supabase
        .from('stories')
        .insert([
          {
            prompt,
            story,
            image_url: imageUrl,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error saving story to database:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error saving story:', error)
      return null
    }
  }

  static async getStoriesFromDatabase(): Promise<Story[]> {
    try {
      // Check if we have proper environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Return empty array for development without proper setup
        return []
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching stories:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching stories:', error)
      return []
    }
  }

  static async deleteStoryFromDatabase(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting story:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting story:', error)
      return false
    }
  }
}
