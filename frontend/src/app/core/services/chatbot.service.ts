import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatResponse {
    success: boolean;
    message: string;
    data: {
        response: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private readonly API_URL = `${environment.apiUrl}/chatbot`;

    constructor(private http: HttpClient) { }

    async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.http.post<ChatResponse>(`${this.API_URL}/message`, {
                    message,
                    conversationHistory
                })
            );

            if (response.success && response.data) {
                return response.data.response;
            }

            throw new Error(response.message || 'Failed to get response');
        } catch (error: any) {
            console.error('Chatbot service error:', error);

            if (error.status === 401) {
                throw new Error('Please log in to use the chatbot');
            }

            if (error.status === 403) {
                throw new Error('Chatbot is not available for your account type');
            }

            throw new Error('Failed to connect to chatbot. Please try again.');
        }
    }
}
