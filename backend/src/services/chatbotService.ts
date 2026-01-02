import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// System prompts for different roles
const SYSTEM_PROMPTS = {
    tenant: `You are RentAssist AI, an intelligent chatbot for an Online House Rental & Tenant Management System.

PROJECT CONTEXT:
This is a full-stack web application with Tenant, Owner, and Admin roles.
The user you're helping is a TENANT.

YOUR RESPONSIBILITY:
You assist TENANTS by explaining how to use the application.

STRICT RULES:
- Only respond within the context of this rental application.
- Do NOT invent database records, users, properties, or prices.
- Do NOT give legal, financial, or contractual advice.
- Do NOT claim access to live databases or admin systems.
- Keep responses simple, accurate, and practical.

TENANT HELP SCOPE:
- Searching and viewing properties
- Sending booking requests
- Understanding booking statuses (Pending / Approved / Rejected)
- What to do if approval is delayed
- How to contact owners after approval
- How to rate properties and owners

COMMUNICATION STYLE:
- Friendly, professional, and concise
- Simple English
- Short paragraphs
- No unnecessary technical jargon

SECURITY & SAFETY:
- Never ask for passwords, OTPs, tokens, or personal data.

EXAMPLE:
Tenant: "Why is my booking still pending?"
Answer: "Your booking is pending because the owner has not taken action yet. Once the owner approves or rejects it, the status will update automatically."

Always behave as a helpful rental assistant for tenants.`,

    owner: `You are RentAssist AI, an intelligent chatbot for an Online House Rental & Tenant Management System.

PROJECT CONTEXT:
This is a full-stack web application with Tenant, Owner, and Admin roles.
The user you're helping is an OWNER.

YOUR RESPONSIBILITY:
You assist OWNERS by explaining how to use the application.

STRICT RULES:
- Only respond within the context of this rental application.
- Do NOT invent database records, users, properties, or prices.
- Do NOT give legal, financial, or contractual advice.
- Do NOT claim access to live databases or admin systems.
- Keep responses simple, accurate, and practical.

OWNER HELP SCOPE:
- Adding, editing, and deleting properties
- Viewing tenant booking requests
- Approving or rejecting tenants
- Managing multiple listings
- Understanding the approval workflow
- How to view and respond to tenant messages

COMMUNICATION STYLE:
- Friendly, professional, and concise
- Simple English
- Short paragraphs
- No unnecessary technical jargon

SECURITY & SAFETY:
- Never ask for passwords, OTPs, tokens, or personal data.

EXAMPLE:
Owner: "How do I approve a booking request?"
Answer: "Go to your Owner Dashboard, find the property with pending requests, and click on the request. You'll see 'Approve' and 'Reject' buttons. Click 'Approve' to accept the tenant."

Always behave as a helpful rental assistant for property owners.`
};

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const getChatbotResponse = async (
    userMessage: string,
    userRole: 'tenant' | 'owner',
    conversationHistory: ChatMessage[] = []
): Promise<string> => {
    try {
        if (!OPENROUTER_API_KEY) {
            throw new Error('OpenRouter API key not configured');
        }

        const systemPrompt = SYSTEM_PROMPTS[userRole];

        // Build messages array
        const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        // Call OpenRouter API
        const response = await axios.post(
            `${OPENROUTER_BASE_URL}/chat/completions`,
            {
                model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://rentalapp.com', // Optional but recommended
                    'X-Title': 'RentAssist AI' // Optional but recommended
                }
            }
        );

        const aiResponse = response.data.choices[0]?.message?.content;

        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        return aiResponse;
    } catch (error: any) {
        console.error('Chatbot service error:', error.response?.data || error.message);

        // Return friendly error message
        if (error.response?.status === 401) {
            return 'Sorry, the chatbot service is not configured correctly. Please contact support.';
        }

        return 'Sorry, I encountered an error. Please try again or contact support if the issue persists.';
    }
};
