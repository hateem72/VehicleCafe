import { useState, useEffect } from 'react';
import { sendMessage, getChats } from '../utils/api.js';
import { FaPaperPlane, FaComments } from 'react-icons/fa';

function ChatBox({ chatId, recipient }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chats = await getChats();
        const chat = chats.find(c => c._id === chatId);
        if (chat) setMessages(chat.messages);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const updatedChat = await sendMessage(chatId, newMessage);
      setMessages(updatedChat.messages);
      setNewMessage('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-primaryBlue mb-4 flex items-center">
        <FaComments className="mr-2" /> Chat with {recipient?.username || 'User'}
      </h3>
      {error && <p className="text-primaryRed mb-4">{error}</p>}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === recipient._id ? 'text-left' : 'text-right'}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === recipient._id
                  ? 'bg-primaryBlue text-backgroundWhite'
                  : 'bg-primaryYellow text-primaryBlue'
              }`}
            >
              {msg.content}
              <span className="block text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryYellow"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-3 bg-primaryGreen text-backgroundWhite rounded-lg hover:bg-primaryRed transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;