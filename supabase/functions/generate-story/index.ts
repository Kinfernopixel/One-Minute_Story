import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import OpenAI from 'https://esm.sh/openai@4.20.1'

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
    console.log('Function called with method:', req.method)
    
    // Get the request body
    const body = await req.json()
    console.log('Request body:', body)
    
    const { prompt } = body

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
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API key exists:', !!apiKey)
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found in environment variables')
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // TEMPORARY: Return dynamic mock data for testing (remove this when OpenAI is working)
    const storyTemplates = [
      `Once upon a time, ${prompt.toLowerCase()}. The adventure began when magical creatures appeared from nowhere. They danced through the moonlit streets, spreading wonder and joy. As dawn approached, they whispered secrets of creativity to all who believed. And so, a new story was born from a simple idea.`,
      
      `In a world where ${prompt.toLowerCase()}, everything changed. The impossible became possible, and dreams took flight on wings of imagination. People discovered that magic was real, and creativity flowed like rivers of stardust.`,
      
      `Deep in the heart of a mystical forest, ${prompt.toLowerCase()}. The trees whispered ancient secrets, and the wind carried tales of wonder. Every creature, big and small, gathered to witness this extraordinary event.`,
      
      `On a day like any other, ${prompt.toLowerCase()}. The world stood still in amazement as the ordinary transformed into the extraordinary. Laughter echoed through the valleys, and joy spread like wildfire across the land.`,
      
      `In a kingdom far, far away, ${prompt.toLowerCase()}. The royal court was astonished, the people were delighted, and the animals spoke in rhymes. It was a day that would be remembered for generations to come.`
    ]
    
    // Pick a random template for variety
    const randomTemplate = storyTemplates[Math.floor(Math.random() * storyTemplates.length)]
    
         // Create a unique image URL based on the prompt
     const mockImageUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`
    
    // TODO: Uncomment the real AI generation when OpenAI quota is resolved
    /*
    // Generate story using GPT-3.5-turbo (available in free tier)
    const storyResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    // Generate image using DALL-E 2 (more widely available)
    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: `Create a beautiful, whimsical illustration for a children's story about: ${prompt}. 
      The image should be:
      - Safe for all ages
      - Colorful and engaging
      - In a storybook illustration style
      - High quality and detailed
      - Suitable for a story cover or main illustration`,
      n: 1,
      size: "1024x1024"
    })

    const imageUrl = imageResponse.data[0]?.url
    */
    
         const story = randomTemplate
     const imageUrl = mockImageUrl

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
