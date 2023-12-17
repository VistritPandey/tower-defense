import React, { useEffect, useRef } from 'react';

const GameWebSocket = () => {
  const socketRef = useRef(null);
  const maxRetries = 3;

  const initializeWebSocket = (retryCount = 0) => {
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
      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(2, retryCount);
        console.log(`Retrying WebSocket connection in ${delay / 1000} seconds...`);
        setTimeout(() => initializeWebSocket(retryCount + 1), delay);
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

  useEffect(() => {
    sendMessage('Hello, WebSocket!');
  }, []);

  return null;
};

export default GameWebSocket;