const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model:'gemini-2.5-flash' });
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  // Generates optimized product information using the Gemini AI model.
  async generateOptimizedInfo(originalInfo) {
    const prompt = this.buildOptimizationPrompt(originalInfo);

    // Retry logic to handle transient API errors.
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return this.parseOptimizedResponse(text);
      } catch (error) {
        console.error(`Gemini API Error (attempt ${attempt}):`, error.message);
        if (attempt < this.maxRetries && error.message.includes('503')) {
          await new Promise((res) => setTimeout(res, this.retryDelay));
          continue;
        }
        throw new Error('Failed to generate optimized product information: ' + error.message);
      }
    }
  }

  // Constructs the prompt to be sent to the Gemini API.
  buildOptimizationPrompt(originalInfo) {
    return `
      As an e-commerce optimization expert, analyze this product information and provide an optimized version. Focus on improving conversion rates while maintaining accuracy.

      Original Product Information:
      ${JSON.stringify(originalInfo, null, 2)}

      Please provide the optimized version in this exact JSON format:
      {
        "title": "optimized title here",
        "description": "optimized description here",
        "features": ["feature1", "feature2", "feature3"],
        "keywords": ["keyword1", "keyword2", "keyword3"],
      }

      Guidelines:
      - Make the title more compelling and SEO-friendly.
      - Enhance the description to be more engaging and persuasive.
      - Keep the price the same.
      - Improve feature bullet points for better readability.
      - Add relevant keywords for search optimization.
      - Ensure all information remains truthful.
    `;
  }

  // Parses the JSON response from the AI.
  parseOptimizedResponse(responseText) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response: no JSON found');
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      throw new Error('Failed to parse AI response: invalid JSON');
    }
  }
}

module.exports = new GeminiService();