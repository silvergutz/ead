import React, { useState, useEffect } from 'react';
import globalNotifications from '../../services/globalNotifications';

import './styles.css';

function GlobalNotifications() {
  const [ notifications, setNotifications ] = useState([]);

  useEffect(() => {
    const subscription = globalNotifications.getMessage().subscribe(message => {
      if (message) {
        addMessage(message);
      } else {
        setNotifications([]);
      }
    })

    return () => subscription.unsubscribe();
  });

  function addMessage(message) {
    if (notifications.some(m => m.id === message.id)) {
      return;
    }

    console.log(message);

    setNotifications([ ...notifications, message ]);

    if (message.autoClose) {
      setTimeout(() => dismissMessage(message), message.autoCloseTime || 3000);
    }
  }

  function dismissMessage(message) {
    const messages = notifications.filter(m => m.id !== message.id);
    setNotifications(messages);
  }

  return (
    <>
    {notifications.length > 0 &&
      <div className="notifications">
        {notifications.map(message => (
          <div key={message.id} className={'message ' + message.type}>
            <span>{message.content}</span>
            <button className="close link" onClick={e => dismissMessage(message)}>x</button>
          </div>
        ))}
      </div>
    }
    </>
  );
}

export default GlobalNotifications;
