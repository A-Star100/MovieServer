const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Initialize the express app
const app = express();
const port = 8090;

// Read the certificate and key files
const options = {
    key: fs.readFileSync(path.join('/Users/anirudhsevugan/jcdbmeservercerts/server.key')),   // Path to your private key
    cert: fs.readFileSync(path.join('/Users/anirudhsevugan/jcdbmeservercerts/server.crt'))  // Path to your certificate
};

// Serve static files (HTML, CSS, JS, etc.) from the 'documentation' folder
app.use(express.static(path.join(__dirname, '/documentation')));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/documentation', 'movieserverdocs.html'));
});

// Start the HTTPS server on port 8090
https.createServer(options, app).listen(port, () => {
    console.log(`Documentation server running at https://localhost:${port}`);
});
