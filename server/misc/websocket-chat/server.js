const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Keep track of rooms and their clients
const rooms = {};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Handle the message event
  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    const { type, room, username, message } = parsedData;

    if (type === 'join') {
      // Add the user to the room
      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push(ws);
      ws.room = room;  // Store the room info in the WebSocket connection
      ws.username = username;  // Store the username in the WebSocket connection
      console.log(`${username} joined room: ${room}`);

      // Broadcast the room join message to everyone in that room
      wss.clients.forEach((client) => {
        if (client.room === room && client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'room', room: room }));
        }
      });
    } else if (type === 'message') {
      // Broadcast the message to all clients in the room
      if (rooms[room]) {
        wss.clients.forEach((client) => {
          if (client.room === room && client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', message: message, username: username }));
          }
        });
      }
    }
  });

  // Handle WebSocket close event
  ws.on('close', () => {
    console.log('A user disconnected');
    // Remove user from the room
    if (ws.room && rooms[ws.room]) {
      const roomClients = rooms[ws.room];
      const index = roomClients.indexOf(ws);
      if (index !== -1) {
        roomClients.splice(index, 1);
      }
    }
  });
});

// Serve static files (e.g., your frontend chat interface)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WS Chat server is running on http://192.168.254.137:${PORT}`);
});
