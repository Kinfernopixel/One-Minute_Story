import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // Generate story using GPT-4
    const storyResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative storyteller who creates engaging, imaginative stories for children and adults. 
          Create a story that is:
          - 150-200 words long
          - Engaging and creative
          - Suitable for all ages
          - Has a clear beginning, middle, and end
          - Incorporates the user's prompt in a meaningful way
          - Includes vivid descriptions that would work well with illustrations`
        },
        {
          role: "user",
          content: `Create a story based on this prompt: "${prompt}"`
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    const story = storyResponse.choices[0]?.message?.content || ''

    if (!story) {
      throw new Error('Failed to generate story')
    }

    // Generate image using DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a beautiful, whimsical illustration for a children's story about: ${prompt}. 
      The image should be:
      - Safe for all ages
      - Colorful and engaging
      - In a storybook illustration style
      - High quality and detailed
      - Suitable for a story cover or main illustration`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    })

    const imageUrl = imageResponse.data[0]?.url

    // Return the generated story and image
    return new Response(
      JSON.stringify({
        story,
        imageUrl,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in generate-story function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
