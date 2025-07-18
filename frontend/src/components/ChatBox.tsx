import React, { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  message: any;
  direction: string;
  timestamp: string;
  isread: boolean;
}

interface User {
  user_id: string;
  display_name: string;
  picture_url: string;
}

interface ChatBoxProps {
  selectedUser?: User;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedUser, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isRead, setIsRead] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const instantScrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    instantScrollToBottom();
  }, [messages]); // Scroll when messages change

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const countIsRead = () => {
     setIsRead(messages.filter(message => message.isread).length);
  }

  useEffect(() => {
    countIsRead();
  });

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <img
              src={selectedUser.picture_url}
              alt={selectedUser.display_name}
              className="w-12 h-12 rounded-full object-cover"
            />
        <h2 className="text-xl font-semibold text-gray-800">{selectedUser.display_name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.direction === 'out' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex flex-col max-w-[70%] rounded-lg p-2 ${
                message.direction === 'out'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.message}</p>
              <div className={`flex ${message.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(':', '.')}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
