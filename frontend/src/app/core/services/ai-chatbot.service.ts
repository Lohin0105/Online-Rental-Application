import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatbotService {
  private ai: GoogleGenAI;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: environment.geminiApiKey
    });
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // User-friendly system prompt - no technical jargon
      const systemPrompt = `You are a friendly Haven customer support representative helping users with the rental platform.

ABOUT HAVEN:
Haven is a rental platform where property owners can list their homes and renters can find their perfect place to live.

WHAT USERS CAN DO:

For People Looking for a Home:
- Browse available properties with photos and details
- Filter by location, price, number of rooms, and amenities
- View property details including rent, size, and available amenities
- Submit booking requests to property owners
- Track your booking requests and see if they were approved

For Property Owners:
- List your properties with photos and descriptions
- Set your monthly rent and property details
- Receive booking requests from interested renters
- Approve or reject booking requests
- Manage all your properties in one place

Getting Started:
- Visit the Properties page to see available homes
- Register for a free account to book properties
- Owners can sign up and start listing properties immediately

USER QUESTION: ${userMessage}

IMPORTANT RESPONSE RULES:
- Keep response to 2-3 sentences maximum
- Use plain text only - NO asterisks, NO markdown, NO special characters
- If listing items, use simple numbers like "1. Item" on new lines
- Be friendly but brief
- Focus on the answer, not extra details`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt
      });
      const assistantMessage = response.text || 'I apologize, but I could not generate a response. Please try again.';

      // Add assistant message to history
      this.chatHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      return assistantMessage;
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      const errorMsg = error?.message || 'Unknown error';
      return `I'm having trouble connecting right now. This might be due to: API key issues, network problems, or rate limits. Technical details: ${errorMsg}. Please try again in a moment.`;
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearHistory(): void {
    this.chatHistory = [];
  }

  // AI-powered property recommendations based on user preferences  
  async getPropertyRecommendations(preferences: {
    budget?: number;
    location?: string;
    bedrooms?: number;
    propertyType?: string;
  }): Promise<string> {
    const prompt = `Give a brief price estimate for this rental:
- Budget: ${preferences.budget ? `$${preferences.budget}/month` : 'Not specified'}
- Location: ${preferences.location || 'Any'}
- Bedrooms: ${preferences.bedrooms || 'Any'}
- Property Type: ${preferences.propertyType || 'Any'}

Output ONLY:
1. Estimated rent range (one line)
2. One key pricing factor (one line)
3. One pricing tip (one line)

Maximum 40 words total. No headers, footers, or extra text.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      let result = response.text || 'Unable to generate estimate.';
      
      // Clean formatting
      result = result
        .replace(/^(Here's|Here is).*?:/gmi, '')
        .replace(/^---+$/gm, '')
        .trim();
      
      return result;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return 'Unable to generate estimate at this time.';
    }
  }

  // Generate property description enhancement
  async enhancePropertyDescription(basicDescription: string): Promise<string> {
    const prompt = `Enhance this property description to make it more appealing while keeping it truthful and professional:

"${basicDescription}"

IMPORTANT: Output ONLY the enhanced description. Do NOT include any headers, footers, or meta-text like "Here's an enhanced..." or "---". Just the pure description text. Keep it concise (2-3 paragraphs).`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      let enhanced = response.text || basicDescription;
      
      // Clean up any headers/footers that might slip through
      enhanced = enhanced
        .replace(/^(Here's|Here is).*?:/gmi, '')
        .replace(/^---+$/gm, '')
        .replace(/^\*\*.*?\*\*$/gm, '')
        .trim();
      
      return enhanced || basicDescription;
    } catch (error) {
      console.error('Error enhancing description:', error);
      return basicDescription;
    }
  }

  // Smart search suggestions with keyword extraction
  async getSearchSuggestions(query: string): Promise<string[]> {
    const prompt = `Extract 3 property search refinements from: "${query}"

Output ONLY 3 search terms, one per line, no numbers or extra text.
Example format:
2 bedroom apartments downtown
affordable studios near transit
pet friendly rentals`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '';
      return text.split('\n').filter((s: string) => s.trim()).slice(0, 3);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  // RAG: Extract search keywords from natural language query
  async extractSearchKeywords(naturalQuery: string): Promise<{
    location?: string;
    propertyType?: string;
    minRent?: number;
    maxRent?: number;
    bedrooms?: number;
    keywords: string[];
  }> {
    const prompt = `Extract search parameters from this property query: "${naturalQuery}"

If user mentions "2bhk" or "2BHK", interpret as 2 bedrooms.
If user mentions "3bhk" or "3BHK", interpret as 3 bedrooms.
If location is not specified but context suggests India (Bangalore, Mumbai, etc), use that.
If budget is mentioned as "cheap" or "affordable", suggest maxRent: 2000.

Output ONLY a JSON object:
{
  "location": "city or area",
  "propertyType": "apartment/house/studio/condo/villa",
  "minRent": number,
  "maxRent": number,
  "bedrooms": number,
  "keywords": ["keyword1", "keyword2"]
}

Example: "2bhk in bangalore" → {"location":"bangalore","bedrooms":2,"propertyType":"apartment"}`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '{}';
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const params = JSON.parse(jsonMatch[0]);
        // Add defaults if missing
        if (params.bedrooms && !params.propertyType) {
          params.propertyType = 'apartment';
        }
        return params;
      }
      return { keywords: [naturalQuery] };
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return { keywords: [naturalQuery] };
    }
  }

  // Explain why these search results match user query
  async explainSearchResults(userQuery: string, extractedParams: any): Promise<string> {
    const prompt = `User searched for: "${userQuery}"

We extracted these filters:
${JSON.stringify(extractedParams, null, 2)}

Write ONE SHORT sentence (max 20 words) explaining what properties we're showing and why they match.

Example: "Showing 2-bedroom apartments in Bangalore based on your search"

NO headers, NO extra text, just the explanation sentence.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return (response.text || '').trim();
    } catch (error) {
      console.error('Error generating explanation:', error);
      return '';
    }
  }
}

