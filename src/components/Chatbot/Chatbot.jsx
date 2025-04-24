import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import './ChatbotStyles.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef(null);
  
    // Initialize chatbot with greeting from backend
    useEffect(() => {
      const initializeChatbot = async () => {
        try {
          const response = await fetch('http://localhost:8081/api/chatbot/greeting');
          if (response.ok) {
            const data = await response.json();
            setMessages([{ text: data.greeting || "Hi there! How can I help you?", isBot: true }]);
          } else {
            setMessages([{ 
              text: "Hi there! I'm your PICT Calendar Assistant. How can I help you today?", 
              isBot: true 
            }]);
          }
        } catch (error) {
          console.error('Error initializing chatbot:', error);
          setMessages([{ 
            text: "Hi there! I'm your PICT Calendar Assistant. How can I help you today?", 
            isBot: true 
          }]);
        } finally {
          setIsInitialized(true);
        }
      };
  
      initializeChatbot();
    }, []);
  
    // Auto-scroll to the bottom when new messages are added
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage = { text: input, isBot: false };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Send message to the backend
      const response = await fetch('http://localhost:8081/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button */}
      <button 
        className="chatbot-toggle-button"
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Chatbot header */}
          <div className="chatbot-header">
            <h3>PICT Calendar Assistant</h3>
            <button 
              className="close-button"
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chatbot messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chatbot input */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Chat input"
            />
            <button 
              onClick={sendMessage}
              disabled={input.trim() === "" || isTyping}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;