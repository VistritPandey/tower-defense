import React, { useState, useEffect, useRef } from 'react';
import Turrets from './Turrets';
import GameWebSocket from './GameWebSocket';

const GameCanvas = () => {
  const [turrets, setTurrets] = useState([]);
  const [loons, setLoons] = useState([]);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [gameUpdates, setGameUpdates] = useState([]);
  const [defeatedLoons, setDefeatedLoons] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();

    const turretX = e.clientX;
    const turretY = e.clientY;

    setTurrets((prevTurrets) => [...prevTurrets, { x: turretX, y: turretY }]);
  };

  useEffect(() => {
    const socket = socketRef.current;
  
    const subscriptionTopics = ['msg', 'loonState'];
    subscriptionTopics.forEach((topic) => {
      socket.send(JSON.stringify({ subscribe: topic }));
    });
  
    const handleSocketMessage = (event) => {
      const data = JSON.parse(event.data);
      switch (Object.keys(data)[0]) {
        case 'msg':
          handleMsg(data.msg);
          break;
        case 'loonState':
          handleLoonState(data.loonState);
          break;
        default:
          break;
      }
    };
  
    socket.addEventListener('message', handleSocketMessage);
  
    return () => {
      socket.removeEventListener('message', handleSocketMessage);
    };
  
  }, [socketRef]);
  

  const handleMsg = (msg) => {
    console.log('Received msg:', msg);

    if (msg.type === 'notification') {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { message: msg.message, type: msg.notificationType },
      ]);
    }

    if (msg.type === 'update') {
      setGameUpdates((prevUpdates) => [...prevUpdates, msg]);
    }
  };

  const handleLoonState = (loonState) => {
    console.log('Received loonState:', loonState);

    setLoons(loonState);

    loonState.forEach((loon) => {
      if (loon.health <= 0) {
        setDefeatedLoons((prevDefeatedLoons) => [
          ...prevDefeatedLoons,
          loon.id,
        ]);
      }
    });
  };

  return (
    <div
      className="game-canvas"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <GameWebSocket socketRef={socketRef} />
      {turrets.map((turret, index) => (
        <Turrets key={index} style={{ left: turret.x, top: turret.y }} />
      ))}
      {loons.map((loon, index) => (
        <div key={index} className="loon">
          L
        </div>
      ))}
    </div>
  );
};

export default GameCanvas;