import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '@core/services/chatbot.service';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <!-- Floating Chat Button -->
    @if (!isOpen()) {
      <button class="chat-button" (click)="toggleChat()" title="Chat with RentAssist AI">
        <span class="material-icons-outlined">chat</span>
      </button>
    }

    <!-- Chat Window -->
    @if (isOpen()) {
      <div class="chat-window animate-slide-up">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-content">
            <span class="material-icons-outlined">smart_toy</span>
            <div>
              <h3>RentAssist AI</h3>
              <span class="status">Online</span>
            </div>
          </div>
          <button class="close-btn" (click)="toggleChat()" title="Close">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>

        <!-- Messages -->
        <div class="chat-messages" #messagesContainer>
          <!-- Welcome Message -->
          @if (messages().length === 0) {
            <div class="welcome-message">
              <span class="material-icons-outlined">waving_hand</span>
              <p>Hi! I'm RentAssist AI. How can I help you today?</p>
              <div class="quick-questions">
                <button (click)="sendQuickQuestion('How do I book a property?')" class="quick-btn">
                  How do I book a property?
                </button>
                <button (click)="sendQuickQuestion('What are booking statuses?')" class="quick-btn">
                  What are booking statuses?
                </button>
              </div>
            </div>
          }

          <!-- Chat Messages -->
          @for (message of messages(); track $index) {
            <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
              <div class="message-bubble">
                <p>{{ message.content }}</p>
                <span class="message-time">{{ message.timestamp | date:'shortTime' }}</span>
              </div>
            </div>
          }

          <!-- Typing Indicator -->
          @if (isTyping()) {
            <div class="message assistant">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          }

          <!-- Error Message -->
          @if (error()) {
            <div class="error-message">
              <span class="material-icons-outlined">error_outline</span>
              <p>{{ error() }}</p>
            </div>
          }
        </div>

        <!-- Input -->
        <div class="chat-input">
          <input
            type="text"
            [(ngModel)]="inputMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            [disabled]="isTyping()"
          />
          <button (click)="sendMessage()" [disabled]="!inputMessage.trim() || isTyping()">
            <span class="material-icons-outlined">send</span>
          </button>
        </div>
      </div>
    }
  `,
    styles: [`
    .chat-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-charcoal), #2d3b3a);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 999;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      }

      .material-icons-outlined {
        font-size: 28px;
      }
    }

    .chat-window {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      height: 550px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      z-index: 999;
      overflow: hidden;

      @media (max-width: 640px) {
        width: calc(100vw - 32px);
        height: calc(100vh - 100px);
        bottom: 16px;
        right: 16px;
      }
    }

    .chat-header {
      background: linear-gradient(135deg, var(--color-charcoal), #2d3b3a);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .material-icons-outlined {
          font-size: 28px;
        }

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .status {
          font-size: 12px;
          opacity: 0.8;
        }
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;

        &:hover {
          background: rgba(255,255,255,0.1);
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8f9fa;
    }

    .welcome-message {
      text-align: center;
      padding: 24px;

      .material-icons-outlined {
        font-size: 48px;
        color: var(--color-charcoal);
        margin-bottom: 12px;
      }

      p {
        color: var(--color-gray);
        margin-bottom: 16px;
      }

      .quick-questions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .quick-btn {
        padding: 12px;
        background: white;
        border: 1px solid var(--color-off-white);
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        text-align: left;

        &:hover {
          background: var(--color-off-white);
          border-color: var(--color-charcoal);
        }
      }
    }

    .message {
      display: flex;

      &.user {
        justify-content: flex-end;

        .message-bubble {
          background: var(--color-charcoal);
          color: white;
        }
      }

      &.assistant {
        justify-content: flex-start;

        .message-bubble {
          background: white;
          color: var(--color-charcoal);
        }
      }
    }

    .message-bubble {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);

      p {
        margin: 0 0 4px 0;
        font-size: 14px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .message-time {
        font-size: 10px;
        opacity: 0.6;
      }
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: white;
      border-radius: 16px;

      span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-gray);
        animation: typing 1.4s infinite;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }

    @keyframes typing {
      0%, 60%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      30% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .error-message {
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--color-error);
      font-size: 13px;

      .material-icons-outlined {
        font-size: 20px;
      }
    }

    .chat-input {
      padding: 16px;
      background: white;
      border-top: 1px solid var(--color-off-white);
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        padding: 12px;
        border: 1px solid var(--color-off-white);
        border-radius: 24px;
        outline: none;
        font-size: 14px;
        transition: border-color 0.2s;

        &:focus {
          border-color: var(--color-charcoal);
        }

        &:disabled {
          background: var(--color-off-white);
          cursor: not-allowed;
        }
      }

      button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--color-charcoal);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background: #2d3b3a;
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }
  `]
})
export class ChatbotComponent {
    isOpen = signal(false);
    messages = signal<Message[]>([]);
    inputMessage = '';
    isTyping = signal(false);
    error = signal<string | null>(null);

    constructor(private chatbotService: ChatbotService) { }

    toggleChat() {
        this.isOpen.update(v => !v);
        this.error.set(null);
    }

    async sendMessage() {
        const message = this.inputMessage.trim();
        if (!message || this.isTyping()) return;

        // Add user message
        this.messages.update(msgs => [...msgs, {
            role: 'user',
            content: message,
            timestamp: new Date()
        }]);

        this.inputMessage = '';
        this.isTyping.set(true);
        this.error.set(null);

        // Scroll to bottom
        setTimeout(() => this.scrollToBottom(), 100);

        try {
            // Get conversation history for context
            const history = this.messages().map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await this.chatbotService.sendMessage(message, history);

            // Add AI response
            this.messages.update(msgs => [...msgs, {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            }]);

            setTimeout(() => this.scrollToBottom(), 100);
        } catch (err: any) {
            this.error.set(err.message || 'Failed to get response. Please try again.');
        } finally {
            this.isTyping.set(false);
        }
    }

    sendQuickQuestion(question: string) {
        this.inputMessage = question;
        this.sendMessage();
    }

    private scrollToBottom() {
        const container = document.querySelector('.chat-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}
