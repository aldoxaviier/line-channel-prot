import { useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import ChatBox from './components/ChatBox';

// Temporary mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=John',
    lastMessage: 'Hey, how are you?'
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Jane',
    lastMessage: 'See you tomorrow!'
  },
];

const mockMessages = [
  {
    id: '1',
    text: 'Hi there!',
    sender: 'user',
    timestamp: new Date(),
  },
  {
    id: '2',
    text: 'Hello! How can I help you today?',
    sender: 'other',
    timestamp: new Date(),
  },
];

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const selectedUser = mockUsers.find(user => user.id === selectedUserId);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Here you would typically send the message to your backend
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r border-gray-200">
        <UserList
          users={mockUsers}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>
      <div className="flex-1">
        <ChatBox
          selectedUser={selectedUser}
          messages={mockMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
