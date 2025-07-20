import { useState, useEffect } from 'react';
import { getChats, createChat } from '../utils/api.js';
import ChatBox from '../components/ChatBox.jsx';
import { FaUserFriends } from 'react-icons/fa';

function Chat() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [recipientId, setRecipientId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getChats();
        setChats(response);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChats();
  }, []);

  const handleCreateChat = async (e) => {
    e.preventDefault();
    try {
      const newChat = await createChat(recipientId);
      setChats([...chats, newChat]);
      setSelectedChat(newChat._id);
      setRecipientId('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-primaryBlue mb-6 flex items-center">
        <FaUserFriends className="mr-2" /> Chats
      </h2>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-primaryBlue mb-4">Start New Chat</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Recipient User ID"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
            />
            <button
              onClick={handleCreateChat}
              className="w-full p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition"
            >
              Start Chat
            </button>
          </div>
          <h3 className="text-xl font-semibold text-primaryBlue mt-6 mb-4">Your Chats</h3>
          <ul className="space-y-2">
            {chats.map(chat => (
              <li
                key={chat._id}
                onClick={() => setSelectedChat(chat._id)}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedChat === chat._id ? 'bg-primaryYellow' : 'bg-gray-100'
                } hover:bg-primaryYellow transition`}
              >
                Chat with {chat.participants.find(p => p._id !== localStorage.getItem('userId'))?.username || 'User'}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          {selectedChat ? (
            <ChatBox
              chatId={selectedChat}
              recipient={chats.find(c => c._id === selectedChat)?.participants.find(p => p._id !== localStorage.getItem('userId'))}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-600">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;