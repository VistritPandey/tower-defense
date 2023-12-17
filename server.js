const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const subscriptionTopics = ['msg', 'loonState'];
const publishingTopics = ['turretPlacement', 'popLoon'];

function handleTurretPlacement(turretPlacement) {
  console.log('Received turret placement:', turretPlacement);
}

function handlePopLoon(popLoon) {
  console.log('Received popLoon:', popLoon);
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  subscriptionTopics.forEach((topic) => {
    ws.send(JSON.stringify({ subscribe: topic }));
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.publish) {
        const topic = Object.keys(data.publish)[0];

        if (publishingTopics.includes(topic)) {
          switch (topic) {
            case 'turretPlacement':
              handleTurretPlacement(data.publish.turretPlacement);
              break;
            case 'popLoon':
              handlePopLoon(data.publish.popLoon);
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});