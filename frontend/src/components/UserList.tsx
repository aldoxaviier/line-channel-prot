import React from 'react';

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
}

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUserId, onSelectUser }) => {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              selectedUserId === user.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => onSelectUser(user.id)}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              {user.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
