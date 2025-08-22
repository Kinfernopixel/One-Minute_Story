#!/bin/bash

echo "🚀 Deploying AI Integration for One-Minute Story App"
echo "=================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
else
    echo "✅ Supabase CLI found"
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    echo "🔐 Please login to Supabase..."
    supabase login
fi

# Get project reference
echo "📋 Enter your Supabase project reference (found in your project URL):"
read -r PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    exit 1
fi

# Link project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref "$PROJECT_REF"

# Deploy Edge Function
echo "🚀 Deploying Edge Function..."
supabase functions deploy generate-story

# Set OpenAI API key
echo "🔑 Setting OpenAI API key..."
echo "Enter your OpenAI API key:"
read -r OPENAI_API_KEY

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OpenAI API key is required"
    exit 1
fi

supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"

echo "✅ AI Integration deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Create a .env.local file with your Supabase credentials"
echo "2. Run 'npm run dev' to start the app"
echo "3. Test story generation with a prompt"
echo ""
echo "For detailed setup instructions, see AI_INTEGRATION_SETUP.md"
