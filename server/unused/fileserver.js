// file_server.js

const express = require('express');
const path = require('path');

// Create an Express app
const app = express();

// Define the directory to serve files from
const directoryToServe = path.join(__dirname, '/volume1/family/Anirudh/Miscellaneous/jcdbmeserver'); // Replace 'files' with the directory you want to serve

// Serve static files from the specified directory
app.use(express.static(directoryToServe));

// Set up a simple HTTP server
const port = 8000;
app.listen(port, () => {
  console.log(`File server is running on http://localhost:${port}`);
});
