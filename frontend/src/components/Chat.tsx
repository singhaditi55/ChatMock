import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

interface Message {
  text: string;
  sender: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket.on('previous messages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on('chat message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('previous messages');
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      socket.emit('chat message', { text: inputValue, sender: 'me' });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
