import React from 'react';

export default function ChatWindow({ messages }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span style={{ color: '#53bdeb' }}>✓✓</span>;
      default:
        return '';
    }
  };

  return (
    <div className="chat-window">
      {messages.map((msg, idx) => {
        const formattedTime = new Date(msg.timestamp)
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            key={idx}
            className={msg.name === 'You' ? 'sent' : 'received'}
          >
            <p>{msg.message}</p>
            <small>
              {formattedTime} {msg.name === 'You' && getStatusIcon(msg.status)}
            </small>
          </div>
        );
      })}
    </div>
  );
}
