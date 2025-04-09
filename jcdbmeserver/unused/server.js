const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
// Create an Express app
const app = express();

app.use(express.static('/volume1/family/Anirudh/Miscellaneous/jcdbmeserver/'));  // Assuming your static files are in the "public" directory

// Set the directory you want to serve as the root
const directoryToServe = path.join(__dirname, '/volume1/family/Anirudh/Miscellaneous/jcdbmeserver/');  // Change this to your desired folder

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Serve index.html as the landing page
});
// Serve static files from the specified directory
app.use(express.static(directoryToServe));

const baseDirectory = path.join(__dirname, '/volume1/family/Anirudh/Miscellaneous/jcdbmeserver/');  // Adjust this path to your needs

app.get('/fileserver.html', (req, res) => {
  const folderPath = path.join(baseDirectory, req.query.dir || '');  // If no folder is specified, serve the base directory

  // Check if the requested folder exists and is a directory
  fs.stat(folderPath, (err, stats) => {
    if (err || !stats.isDirectory()) {
      return res.status(404).send('Directory not found');
    }

    // Read the contents of the directory
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return res.status(500).send('Error reading directory');
      }

      // Generate an HTML page with links to files and subdirectories
      let fileListHtml = `<h1>Contents of ${folderPath}</h1><ul>`;
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
          fileListHtml += `<li><a href="/fileserver.html?dir=${req.query.dir ? req.query.dir + '/' + file : file}">${file}/</a></li>`;
        } else {
          fileListHtml += `<li><a href="/${req.query.dir ? req.query.dir + '/' + file : file}" target="_blank">${file}</a></li>`;
        }
      });
      fileListHtml += '</ul>';

      res.send(fileListHtml);
    });
  });
});

app.use((req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            max-width: 600px;
            padding: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            background: #fff;
            border-radius: 10px;
        }

        h1 {
            font-size: 96px;
            margin: 0;
            color: #0f52ba;
        }

        h2 {
            font-size: 24px;
            margin: 10px 0 20px;
            color: #666;
        }

        p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        a {
            display: inline-block;
            text-decoration: none;
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        a:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
            We're sorry, but the page you were looking for doesn't exist. <br>
            You can go back to the homepage.
        </p>
        <a href="https://192.168.254.137:8080">Go to Homepage</a>
    </div>
</body>
</html>
  `);
});


// Create an HTTPS server
const options = {
  key: fs.readFileSync('/volume1/family/Anirudh/Miscellaneous/jcdbmeserver/server.key'),
  cert: fs.readFileSync('/volume1/family/Anirudh/Miscellaneous/jcdbmeserver/server.crt'),
};

const httpsServer = https.createServer(options, app);

// Create an HTTP server that redirects to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
  res.end();
});

// Define the ports
const httpsPort = 8080;
const httpPort = 8443;

// Start the HTTP and HTTPS servers
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server running on port ${httpsPort}`);
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}, redirecting to HTTPS`);
});
