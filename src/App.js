import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from './api';
import ChatList from './components/ChatList';
import ChatWindow from './components/Chatwindow';
import MessageInput from './components/Messageinput';
import './App.css';

// Single socket initialization
const socket = io("https://whatsapp-backend-rhrf.onrender.com", {
  transports: ["websocket"],
});

function App() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Test Socket.IO connection
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, []);

  // Load conversations from backend
  useEffect(() => {
    API.get('/conversations')
      .then(res => {
        if (Array.isArray(res.data)) {
          setChats(res.data);
        } else {
          console.error("Unexpected conversations format:", res.data);
          setChats([]);
        }
      })
      .catch(err => {
        console.error("Error fetching conversations:", err);
        setChats([]);
      });
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('messageReceived', (msg) => {
      if (msg.wa_id === activeChat) {
        setMessages(prev => [...prev, msg]);
      }
      setChats(prev => {
        const updated = prev.map(chat =>
          chat._id === msg.wa_id
            ? { ...chat, lastMessage: msg.message, lastTime: msg.timestamp }
            : chat
        );
        return updated;
      });
    });

    return () => {
      socket.off('messageReceived');
    };
  }, [activeChat]);

  const handleSelectChat = (wa_id) => {
    setActiveChat(wa_id);
    API.get(`/conversations/${wa_id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          console.error("Unexpected messages format:", res.data);
          setMessages([]);
        }
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setMessages([]);
      });
  };

  const handleSendMessage = (text) => {
    if (!activeChat) return;

    const newMsg = {
      wa_id: activeChat,
      name: 'You',
      message: text,
      timestamp: new Date(),
      status: 'sent'
    };
    socket.emit('sendMessage', newMsg);
    setMessages(prev => [...prev, newMsg]); // Optimistic update
  };

  return (
    <div className="app">
      <ChatList chats={chats} onSelect={handleSelectChat} />
      {activeChat && (
        <div className="chat-section">
          <ChatWindow messages={messages} />
          <MessageInput onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
}

export default App;
