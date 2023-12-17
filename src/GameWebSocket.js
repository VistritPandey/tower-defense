import React, { useEffect, useRef } from 'react';

const GameWebSocket = () => {
  const socketRef = useRef(null);
  const retryCount = useRef(0);
  const maxRetries = 3; // Set the maximum number of retries

  const initializeWebSocket = () => {
    socketRef.current = new WebSocket('wss://pronto-challenge.ngrok.app/vistritpandey@gmail.com/ws');

    socketRef.current.addEventListener('open', () => {
      console.log('WebSocket connection opened');

      const subscriptionTopics = ['msg', 'loonState'];
      subscriptionTopics.forEach((topic) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ subscribe: topic }));
        }
      });
    });

    socketRef.current.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
    });

    socketRef.current.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      if (retryCount.current < maxRetries) {
        console.log(`Retrying WebSocket connection (${retryCount.current + 1}/${maxRetries})...`);
        retryCount.current += 1;
        initializeWebSocket(); // Retry WebSocket connection
      } else {
        console.error('Max retries reached. Unable to establish WebSocket connection.');
      }
    });

    socketRef.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  };

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error('WebSocket not open. Unable to send message.');
    }
  };

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Example usage of sendMessage
  useEffect(() => {
    sendMessage('Hello, WebSocket!');
  }, []); // This sends a message when the component mounts

  return null;
};

export default GameWebSocket;
