import React from 'react';

export default function ChatList({ chats, onSelect }) {
  if (!Array.isArray(chats) || chats.length === 0) {
    return (
      <div className="chat-list empty">
        <p>No chats yet.</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {chats.map(chat => {
        const formattedTime = chat.lastTime
          ? new Date(chat.lastTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '';

        return (
          <div
            key={chat._id || chat.wa_id}
            className="chat-item"
            onClick={() => onSelect(chat._id || chat.wa_id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>{chat.name || 'Unnamed Chat'}</h4>
              <small>{formattedTime}</small>
            </div>
            <p>{chat.lastMessage || ''}</p>
          </div>
        );
      })}
    </div>
  );
}
