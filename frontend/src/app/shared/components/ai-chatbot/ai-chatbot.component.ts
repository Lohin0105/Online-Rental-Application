import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatbotService, ChatMessage } from '../../../core/services/ai-chatbot.service';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container">
      <!-- Chat Button -->
      @if (!isOpen()) {
        <button class="chat-button" (click)="toggleChat()" [class.pulse]="!hasInteracted()">
          <span class="material-icons-outlined">chat</span>
          @if (!hasInteracted()) {
            <span class="notification-badge"></span>
          }
        </button>
      }

      <!-- Chat Window -->
      @if (isOpen()) {
        <div class="chat-window animate-slide-up">
          <!-- Header -->
          <div class="chat-header">
            <div class="header-content">
              <div class="ai-avatar">
                <span class="material-icons-outlined">support_agent</span>
              </div>
              <div>
                <h3>Haven Support</h3>
                <p class="status">
                  <span class="status-dot"></span>
                  Online
                </p>
              </div>
            </div>
            <button class="close-button" (click)="toggleChat()">
              <span class="material-icons-outlined">close</span>
            </button>
          </div>

          <!-- Messages -->
          <div class="chat-messages" #messageContainer>
            <!-- Welcome Message -->
            @if (messages().length === 0) {
              <div class="welcome-message">
                <div class="ai-icon">
                  <span class="material-icons-outlined">support_agent</span>
                </div>
                <h4>Welcome to Haven</h4>
                <p>How can we help you today? Ask about:</p>
                <div class="quick-questions">
                  <button class="quick-btn" (click)="sendQuickQuestion('How do I search for properties?')">
                    <span class="material-icons-outlined">search</span>
                    Search properties
                  </button>
                  <button class="quick-btn" (click)="sendQuickQuestion('What is the booking process?')">
                    <span class="material-icons-outlined">description</span>
                    Booking process
                  </button>
                  <button class="quick-btn" (click)="sendQuickQuestion('How do I list my property?')">
                    <span class="material-icons-outlined">add_business</span>
                    List property
                  </button>
                  <button class="quick-btn" (click)="sendQuickQuestion('Tell me about Haven features')">
                    <span class="material-icons-outlined">stars</span>
                    Platform features
                  </button>
                </div>
              </div>
            }

            <!-- Chat Messages -->
            @for (message of messages(); track message.timestamp) {
              <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                @if (message.role === 'assistant') {
                  <div class="message-avatar">
                    <span class="material-icons-outlined">support_agent</span>
                  </div>
                }
                <div class="message-content">
                  <div class="message-bubble" [innerHTML]="formatMessage(message.content)"></div>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
                @if (message.role === 'user') {
                  <div class="message-avatar user-avatar">
                    <span class="material-icons-outlined">person</span>
                  </div>
                }
              </div>
            }

            <!-- Typing Indicator -->
            @if (isTyping()) {
              <div class="message assistant">
                <div class="message-avatar">
                  <span class="material-icons-outlined">support_agent</span>
                </div>
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          <div class="chat-input">
            <div class="input-wrapper">
              <input
                type="text"
                [(ngModel)]="userInput"
                (keydown.enter)="sendMessage()"
                placeholder="Ask me anything about properties..."
                [disabled]="isTyping()"
              />
              <button 
                class="send-button" 
                (click)="sendMessage()"
                [disabled]="!userInput.trim() || isTyping()"
              >
                <span class="material-icons-outlined">send</span>
              </button>
            </div>
            <div class="input-footer">
              <span class="ai-badge">
                <span class="material-icons-outlined">info</span>
                Haven Help Center
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .chatbot-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    /* Chat Button */
    .chat-button {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--color-charcoal);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      }

      .material-icons-outlined {
        font-size: 28px;
      }

      .notification-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 12px;
        height: 12px;
        background: #ff4444;
        border-radius: 50%;
        border: 2px solid white;
      }

      &.pulse {
        animation: pulse 2s infinite;
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      50% {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 10px rgba(0,0,0,0.1);
      }
    }

    /* Chat Window */
    .chat-window {
      width: 400px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      @media (max-width: 480px) {
        width: calc(100vw - 32px);
        height: calc(100vh - 100px);
      }
    }

    /* Header */
    .chat-header {
      background: linear-gradient(135deg, var(--color-charcoal) 0%, #2a2a2a 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: rgba(255,255,255,0.7);
        margin: 2px 0 0 0;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        background: #4ade80;
        border-radius: 50%;
        animation: blink 2s infinite;
      }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .ai-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button {
      background: transparent;
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

    /* Messages */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8f9fa;
    }

    .welcome-message {
      text-align: center;
      padding: 24px;

      .ai-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--color-charcoal) 0%, #2a2a2a 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;

        .material-icons-outlined {
          font-size: 32px;
        }
      }

      h4 {
        margin: 0 0 8px 0;
        color: var(--color-charcoal);
      }

      p {
        color: var(--color-gray);
        margin: 0 0 16px 0;
        font-size: 14px;
      }
    }

    .quick-questions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }

    .quick-btn {
      background: white;
      border: 1px solid #e5e7eb;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      text-align: left;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;

      .material-icons-outlined {
        font-size: 18px;
        color: var(--color-medium-gray);
      }

      &:hover {
        background: var(--color-off-white);
        border-color: var(--color-charcoal);
        
        .material-icons-outlined {
          color: var(--color-charcoal);
        }
      }
    }

    .message {
      display: flex;
      gap: 8px;
      align-items: flex-start;

      &.user {
        flex-direction: row-reverse;

        .message-bubble {
          background: var(--color-charcoal);
          color: white;
        }

        .message-time {
          text-align: right;
        }
      }
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-charcoal);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .material-icons-outlined {
        font-size: 20px;
      }

      &.user-avatar {
        background: var(--color-accent);
      }
    }

    .message-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .message-bubble {
      background: white;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .message-time {
      font-size: 11px;
      color: var(--color-medium-gray);
      padding: 0 8px;
    }

    /* Typing Indicator */
    .typing-indicator {
      background: white;
      padding: 12px 16px;
      border-radius: 12px;
      display: flex;
      gap: 4px;

      span {
        width: 8px;
        height: 8px;
        background: var(--color-medium-gray);
        border-radius: 50%;
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
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }

    /* Input */
    .chat-input {
      border-top: 1px solid #e5e7eb;
      padding: 12px;
      background: white;
    }

    .input-wrapper {
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        padding: 12px 16px;
        font-size: 14px;
        outline: none;

        &:focus {
          border-color: var(--color-charcoal);
        }

        &:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
      }

      .send-button {
        width: 40px;
        height: 40px;
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
          background: #2a2a2a;
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .input-footer {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .ai-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-medium-gray);

      .material-icons-outlined {
        font-size: 14px;
      }
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AiChatbotComponent {
  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  isTyping = signal(false);
  hasInteracted = signal(false);
  userInput = '';

  constructor(private aiService: AiChatbotService) {}

  toggleChat() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.hasInteracted.set(true);
      // Load chat history if exists
      const history = this.aiService.getChatHistory();
      this.messages.set(history);
    }
  }

  async sendMessage() {
    const message = this.userInput.trim();
    if (!message || this.isTyping()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    this.messages.set([...this.messages(), userMessage]);
    this.userInput = '';
    this.isTyping.set(true);

    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 100);

    // Get AI response
    try {
      const response = await this.aiService.sendMessage(message);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      this.messages.set([...this.messages(), assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      this.messages.set([...this.messages(), errorMessage]);
    } finally {
      this.isTyping.set(false);
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async sendQuickQuestion(question: string) {
    this.userInput = question;
    await this.sendMessage();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  formatMessage(content: string): string {
    // Remove ALL markdown and special characters
    let formatted = content
      .replace(/\*\*/g, '')  // Remove bold
      .replace(/\*/g, '')    // Remove asterisks
      .replace(/#/g, '')     // Remove headers
      .replace(/`/g, '')     // Remove code blocks
      .replace(/\[|\]/g, '') // Remove brackets
      .trim();
    
    // Convert to simple HTML with line breaks
    formatted = formatted
      .split('\n\n').join('</p><p style="margin: 10px 0;">')
      .split('\n').join('<br>');
    
    return `<p style="margin: 0; line-height: 1.6;">${formatted}</p>`;
  }

  private scrollToBottom() {
    const messageContainer = document.querySelector('.chat-messages');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }
}

