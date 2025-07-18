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

  // Function to fetch users and messages
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

  // Function to fetch messages for the selected user
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

  // Function to handle sending a message
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
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.user_id === body.selectedUserId) {
          return {
            ...user,
            last_message: body.message
          };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleIncomingMessage = async (data: any) => {
      setMessages(prevMessages => [...prevMessages, data]);
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.user_id === data.user_id) {
          return {
            ...user,
            last_message: data.message,
            unread_count: data.direction === 'in' ? user.unread_count++ : user.unread_count
          };
        }
        return user;
      }));
      // if (selectedUserId === data.user_id) {
      //   socket.emit('read-messages', selectedUserId);
      // }
    };

  // initial connection to the WebSocket server and fetching users
  useEffect(()=>{
    getUsers();
    const socket = io(import.meta.env.VITE_LOCAL_URL);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    
    setSocket(socket);
    
    return () => {
      socket.disconnect();
    }
  },[]);

  // Add a new useEffect for the socket event listener
  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-message', handleIncomingMessage);
    socket.emit('read-messages', selectedUserId);
    
    return () => {
      socket.off('incoming-message', handleIncomingMessage);
    };
  }, [socket, selectedUserId]);



  // initial fetch of messages when a user is selected
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
          //notRead={messages.filter(message => !message.isread).length}
          onSelectUser={setSelectedUserId}
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
