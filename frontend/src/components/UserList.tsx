import React from 'react';

interface User {
  user_id: string;
  display_name: string;
  picture_url: string;
  last_message?: string;
}

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
  notRead: number;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUserId, onSelectUser, notRead }) => {

  return (
    <div className="w-full h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {users.map((user) => (
          <div
            key={user.user_id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              selectedUserId === user.user_id ? 'bg-gray-100' : ''
            }`}
            onClick={() => onSelectUser(user.user_id)}
          >
            <img
              src={user.picture_url}
              alt={user.display_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">{user.display_name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.last_message? user.last_message : "Start a chat"}</p>
            </div>
            {notRead > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {notRead}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
