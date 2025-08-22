// Test Gemini API key
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    // Replace with your actual API key
    const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY_HERE');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent('Say hello in 5 words');
    const response = await result.response;
    console.log('Gemini Response:', response.text());
  } catch (error) {
    console.error('Gemini Error:', error);
  }
}

testGemini();
