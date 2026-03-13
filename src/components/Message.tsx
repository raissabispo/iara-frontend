import type { Message } from "../types/message"

interface Props {
  readonly message: Message
}

export function MessageBubble({ message }: Props) {
  const timestamp = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className={`message-bubble ${message.sender}`}>
      <div className="message-content">
        <div className="message-sender">
          {message.sender === 'agent' ? 'IARA' : 'Você'}
        </div>
        
        <div className="message-text">
          {message.text}
        </div>
        
        <div className="message-timestamp">
          {timestamp}
          {message.sender === 'user' && (
            <span className="message-status">✓✓</span>
          )}
        </div>
      </div>
    </div>
  )
}