import { useEffect, useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import ChatBox from './components/ChatBox';
import { io } from 'socket.io-client';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const selectedUser = users.find(user => user.user_id === selectedUserId);
  const [socket, setSocket] = useState<any>(null);

  const getUsers = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user/get-all-user`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      const parseRes = await response.json();
      setUsers(parseRes);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const getMessages = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/message/get-message/${selectedUserId}`,{
        method: 'GET',
      });
      const parseRes = await response.json();
      setMessages(parseRes);
      console.log("tessss");
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const getLastMessage = async(userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/message/get-last-message/${userId}`, {
        method: 'GET',
      });
      const parseRes = await response.json();
      return parseRes;
    } catch (error) {
      console.error('Error fetching last message:', error);
    }
  }

  const handleSendMessage = async(message: string) => {
    try {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        return;
      }
      const body = {message, selectedUserId};
      await socket.emit('send-message', body);
      await new Promise(resolve => setTimeout(resolve, 100));
      await getMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  

  useEffect(()=>{
    getUsers();
    const socket = io(import.meta.env.VITE_LOCAL_URL);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    socket?.on('incoming-message', async (data: any) => {
    setMessages(prevMessages => [...prevMessages, data]);
    });
    setSocket(socket);
    return () => {
    socket.disconnect();
    }
  },[]);

  useEffect(()=>{
    if (selectedUserId) {
      getMessages();
    }
  },[selectedUserId]);



  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r border-gray-200">
        <UserList
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          notRead={messages.filter(message => !message.isread).length}
        />
      </div>
      <div className="flex-1">
        <ChatBox
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
