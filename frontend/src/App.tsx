import { use, useEffect, useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import ChatBox from './components/ChatBox';

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const selectedUser = users.find(user => user.user_id === selectedUserId);

  const getUsers = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user/get-all-user`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });
      const parseRes = await response.json();
      const usersWithLastMessage = await Promise.all(
      parseRes.map(async (user: any) => {
        const last_message = await getLastMessage(user.user_id);
        return {
          ...user,
          last_message: last_message ? last_message.message : '',
        };
      })
      );
      setUsers(usersWithLastMessage);
      console.log("users", usersWithLastMessage);
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
      const body = {message, selectedUserId};
      const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/message/send-message`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      await new Promise(resolve => setTimeout(resolve, 100));
      await getMessages();
      await getUsers();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(()=>{
    getUsers();
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
