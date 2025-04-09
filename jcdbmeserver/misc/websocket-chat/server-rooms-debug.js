const WebSocket = require('ws');

// Create the WebSocket server
const wss = new WebSocket.Server({ port: 3000 });

// Store rooms and their members
let rooms = {}; // Example: { "room1": [ws1, ws2], "room2": [ws3] }

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  let currentRoom = null;

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'createRoom') {
        const roomName = data.roomName;
        if (!rooms[roomName]) {
          rooms[roomName] = [];
          console.log(`Room "${roomName}" created`);
        }
        rooms[roomName].push(ws);
        currentRoom = roomName;
        ws.send(JSON.stringify({ type: 'info', message: `Room "${roomName}" created` }));
      } 
      else if (data.type === 'joinRoom') {
        const roomName = data.roomName;
        if (rooms[roomName]) {
          rooms[roomName].push(ws);
          currentRoom = roomName;
          ws.send(JSON.stringify({ type: 'info', message: `You joined the room "${roomName}"` }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: `Room "${roomName}" does not exist` }));
        }
      } 
      else if (data.type === 'message' && currentRoom) {
        rooms[currentRoom].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', message: data.message }));
          }
        });
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });

  // Handle user disconnecting and removing them from the room
  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom] = rooms[currentRoom].filter(client => client !== ws);
      // If the room becomes empty, delete it
      if (rooms[currentRoom].length === 0) {
        delete rooms[currentRoom];
        console.log(`Room "${currentRoom}" deleted (no users left)`);
      }
    }
  });
});

console.log('WebSocket server running on ws://192.168.254.137:8080');
