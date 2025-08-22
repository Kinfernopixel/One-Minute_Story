import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.2.1'

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

    // Check if we have any API keys available
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    console.log('Gemini API key exists:', !!geminiApiKey)

    // Generate story using Gemini (free tier available)
    let story = ''
    let imageUrl = ''
    
    try {
      if (geminiApiKey) {
        console.log('Using Gemini for story generation')
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const storyPrompt = `Create a creative, engaging story for children about: ${prompt}. 
        The story should be:
        - 150-200 words long
        - Engaging and creative
        - Suitable for all ages
        - Has a clear beginning, middle, and end
        - Incorporates the prompt in a meaningful way
        - Includes vivid descriptions that would work well with illustrations`
        
        const result = await model.generateContent(storyPrompt)
        const response = await result.response
        story = response.text()
        
        if (!story) {
          throw new Error('Failed to generate story with Gemini')
        }
        
        // For now, use a placeholder image since Gemini text-to-image is limited
        // Create a more interesting placeholder with colors and styling
        const colors = ['4F46E5', 'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        imageUrl = `https://dummyimage.com/1024x1024/${randomColor}/FFFFFF&text=${encodeURIComponent(prompt)}`
        
      } else {
        // Fallback to mock stories if no Gemini key
        console.log('No Gemini key, using mock stories')
        const storyTemplates = [
          `Once upon a time, ${prompt.toLowerCase()}. The adventure began when magical creatures appeared from nowhere. They danced through the moonlit streets, spreading wonder and joy. As dawn approached, they whispered secrets of creativity to all who believed. And so, a new story was born from a simple idea.`,
          
          `In a world where ${prompt.toLowerCase()}, everything changed. The impossible became possible, and dreams took flight on wings of imagination. People discovered that magic was real, and creativity flowed like rivers of stardust.`,
          
          `Deep in the heart of a mystical forest, ${prompt.toLowerCase()}. The trees whispered ancient secrets, and the wind carried tales of wonder. Every creature, big and small, gathered to witness this extraordinary event.`,
          
          `On a day like any other, ${prompt.toLowerCase()}. The world stood still in amazement as the ordinary transformed into the extraordinary. Laughter echoed through the valleys, and joy spread like wildfire across the land.`,
          
          `In a kingdom far, far away, ${prompt.toLowerCase()}. The royal court was astonished, the people were delighted, and the animals spoke in rhymes. It was a day that would be remembered for generations to come.`
        ]
        
        story = storyTemplates[Math.floor(Math.random() * storyTemplates.length)]
        const colors = ['4F46E5', 'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        imageUrl = `https://dummyimage.com/1024x1024/${randomColor}/FFFFFF&text=${encodeURIComponent(prompt)}`
      }
    } catch (error) {
      console.log('Gemini story generation failed, using fallback:', error)
      
      // Fallback to mock stories
      const storyTemplates = [
        `Once upon a time, ${prompt.toLowerCase()}. The adventure began when magical creatures appeared from nowhere. They danced through the moonlit streets, spreading wonder and joy. As dawn approached, they whispered secrets of creativity to all who believed. And so, a new story was born from a simple idea.`,
        
        `In a world where ${prompt.toLowerCase()}, everything changed. The impossible became possible, and dreams took flight on wings of imagination. People discovered that magic was real, and creativity flowed like rivers of stardust.`,
        
        `Deep in the heart of a mystical forest, ${prompt.toLowerCase()}. The trees whispered ancient secrets, and the wind carried tales of wonder. Every creature, big and small, gathered to witness this extraordinary event.`,
        
        `On a day like any other, ${prompt.toLowerCase()}. The world stood still in amazement as the ordinary transformed into the extraordinary. Laughter echoed through the valleys, and joy spread like wildfire across the land.`,
        
        `In a kingdom far, far away, ${prompt.toLowerCase()}. The royal court was astonished, the people were delighted, and the animals spoke in rhymes. It was a day that would be remembered for generations to come.`
      ]
      
      story = storyTemplates[Math.floor(Math.random() * storyTemplates.length)]
      const colors = ['4F46E5', 'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8']
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      imageUrl = `https://dummyimage.com/1024x1024/${randomColor}/FFFFFF&text=${encodeURIComponent(prompt)}`
    }

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
