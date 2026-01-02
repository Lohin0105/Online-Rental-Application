import { Response } from 'express';
import { getChatbotResponse } from '../services/chatbotService';
import { AuthRequest } from '../types';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, conversationHistory } = req.body;
        const userRole = req.user?.role;

        // Validate message
        if (!message || typeof message !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Message is required'
            });
            return;
        }

        // Validate user role
        if (userRole !== 'tenant' && userRole !== 'owner') {
            res.status(403).json({
                success: false,
                message: 'Chatbot is only available for tenants and owners'
            });
            return;
        }

        // Get AI response
        const aiResponse = await getChatbotResponse(
            message,
            userRole,
            conversationHistory || []
        );

        res.json({
            success: true,
            message: 'Response generated successfully',
            data: {
                response: aiResponse
            }
        });
    } catch (error) {
        console.error('Chatbot controller error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get chatbot response'
        });
    }
};
