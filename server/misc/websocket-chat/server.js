const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');  // Optional: If you want to save images locally

// Set up the Express app and HTTP server
const app = express();
const server = http.createServer(app);


// Set up WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A user connected');

  // Broadcast incoming messages to all clients except the sender
  ws.on('message', (message) => {
    if (typeof message === 'string') {
      // Handle text message (if any)
      console.log(`Received message: ${message}`);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } else if (Buffer.isBuffer(message)) {
      // Handle binary message (image or other files)
      console.log('Received binary message (image or file)');
      // Optionally save the image to disk
      fs.writeFileSync('uploaded-image.jpg', message);

      // Broadcast the binary data to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  // Handle WebSocket close event
  ws.on('close', () => {
    console.log('A user disconnected');
  });
});

// Serve static files (e.g., your frontend chat interface)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WS Chat server is running on http://192.168.254.137:${PORT}`);
});

