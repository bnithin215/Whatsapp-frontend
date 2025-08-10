import React from 'react';

export default function ChatList({ chats, onSelect }) {
  return (
    <div className="chat-list">
      {chats.map(chat => {
        const formattedTime = chat.lastTime
          ? new Date(chat.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        return (
          <div
            key={chat._id}
            className="chat-item"
            onClick={() => onSelect(chat._id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>{chat.name}</h4>
              <small>{formattedTime}</small>
            </div>
            <p>{chat.lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
}
