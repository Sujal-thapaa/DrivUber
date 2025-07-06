import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, User, MessageCircle, ChevronLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver';
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  driverName: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverAvatar?: string;
  chatType?: 'driver' | 'general';
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  driverName,
  driverAvatar,
  chatType = 'driver'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dummy chat history for MVP
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      driverName: 'John Smith',
      lastMessage: 'I\'ll be there in 5 minutes',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      messages: [
        {
          id: '1',
          text: 'Hi! I\'m John Smith. How can I help you with your ride?',
          sender: 'driver',
          timestamp: new Date(Date.now() - 600000)
        },
        {
          id: '2',
          text: 'What time will you arrive?',
          sender: 'user',
          timestamp: new Date(Date.now() - 400000)
        },
        {
          id: '3',
          text: 'I\'ll be there in 5 minutes',
          sender: 'driver',
          timestamp: new Date(Date.now() - 300000)
        }
      ]
    },
    {
      id: '2',
      driverName: 'Sarah Johnson',
      lastMessage: 'Perfect! See you soon',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      messages: [
        {
          id: '1',
          text: 'Hi! I\'m Sarah Johnson. How can I help you with your ride?',
          sender: 'driver',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          id: '2',
          text: 'Can you pick me up at the mall?',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: '3',
          text: 'Perfect! See you soon',
          sender: 'driver',
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    },
    {
      id: '3',
      driverName: 'Mike Wilson',
      lastMessage: 'Got it! I\'ll be there on time',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: '1',
          text: 'Hi! I\'m Mike Wilson. How can I help you with your ride?',
          sender: 'driver',
          timestamp: new Date(Date.now() - 90000000)
        },
        {
          id: '2',
          text: 'Please be on time for my appointment',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: '3',
          text: 'Got it! I\'ll be there on time',
          sender: 'driver',
          timestamp: new Date(Date.now() - 86400000)
        }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize messages based on chat type
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        text: chatType === 'driver' 
          ? `Hi! I'm ${driverName}. How can I help you with your ride?`
          : `Hi! I'm ${driverName}. How can I assist you today?`,
        sender: 'driver',
        timestamp: new Date(Date.now() - 60000) // 1 minute ago
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, driverName, chatType]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate driver typing and auto-response (dummy)
      setTimeout(() => {
        setIsTyping(false);
        const driverMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getDummyResponse(newMessage.trim(), chatType),
          sender: 'driver',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, driverMessage]);
      }, 2000);
    }
  };

  const getDummyResponse = (userMessage: string, type: string): string => {
    if (type === 'driver') {
      const driverResponses = [
        "Thanks for the message! I'll see you at the pickup location.",
        "Got it! I'll be there on time.",
        "Perfect! Looking forward to the ride.",
        "Noted! I'll make sure to have a comfortable ride for you.",
        "Great! I'll keep you updated on any changes.",
        "Understood! I'll be driving safely.",
        "Thanks! I'll confirm the details before departure.",
        "Got it! I'll make sure everything is ready.",
        "Perfect! I'll be there a few minutes early.",
        "Thanks for letting me know! I'll accommodate your request."
      ];
      return driverResponses[Math.floor(Math.random() * driverResponses.length)];
    } else {
      const generalResponses = [
        "Thanks for reaching out! I'm here to help.",
        "Got it! Let me assist you with that.",
        "Perfect! I understand your request.",
        "Noted! I'll help you resolve this.",
        "Great! I'll get back to you shortly.",
        "Understood! I'm working on your request.",
        "Thanks! I'll look into this for you.",
        "Got it! I'll make sure to address your concern.",
        "Perfect! I'll help you find a solution.",
        "Thanks for contacting us! I'll assist you right away."
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const openChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowHistory(false);
  };

  const goBackToHistory = () => {
    setShowHistory(true);
    setCurrentChatId('');
    setMessages([]);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-[9999] overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ position: 'fixed', zIndex: 9999 }}>
      <div className={`bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`} style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {!showHistory && (
            <button
              onClick={goBackToHistory}
              className="flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Chats
            </button>
          )}
          <h2 className="text-xl font-bold">
            {showHistory ? 'Chat History' : `Chat with ${chatHistory.find(chat => chat.id === currentChatId)?.driverName || driverName}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
          {showHistory ? (
            /* Chat History List */
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => openChat(chat)}
                    className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {chat.driverName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{chat.driverName}</h3>
                      <p className="text-gray-600 text-sm">{chat.lastMessage}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatTime(chat.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 px-3 py-2 rounded-2xl border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default ChatModal; 