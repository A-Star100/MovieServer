const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const process = require('process');
// Create an Express app
const app = express();
const app2 = express();
const directoryToServe = path.join(__dirname, '/folder');  // Change this to your desired folder
app.use((req, res, next) => {
  // Content Security Policy to block iframe embedding
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none';", "default-src https:; script-src https: http:; style-src https: http:; img-src https: http:; video-src https: http:;");
  next();
});

// Middleware to handle URLs without the .html extension
app.use((req, res, next) => {
  const filePath = path.join(__dirname, `${req.path}.html`);
  res.sendFile(filePath, (err) => {
      if (err) {
          next(); // Proceed to next middleware if the file doesn't exist
      }
  });
});

app.use((req, res, next) => {
  if (req.protocol === 'http') {
    const secureUrl = `https://${req.headers.host}${req.url}`;
    res.redirect(301, secureUrl);  // Permanent redirect to HTTPS
  } else {
    next();  // If already HTTPS, continue with the request
  }
});
// Middleware to block access to specified folders and their contents
app.use((req, res, next) => {
  const forbiddenPaths = ['/server.js', '/python/https-server.py', '/certs'];  // List of forbidden paths (in local copy, certs directory is no longer in public directory, but if you wish to put it there it is listed as a forbidden path so users cannot access your SSL keys and decrypt encrypted data).

  // Check if the requested URL contains any of the forbidden paths
  for (const forbiddenPath of forbiddenPaths) {
    if (req.url.includes(forbiddenPath)) {
      res.status(403).send('<title>403 Forbidden</title> <style>body { background-color:black; color:white; }</style> <h1>403 Forbidden</h1> <p>You do not have the authorization to view the file(s) you were attempting to access.</p> <script>console.error("Failed to access file, server responded with status code 403")</script>');
      return; // Stop further processing if a forbidden path is matched
    }
  }
  
  next(); // Continue to the next middleware if no match is found
});

// Middleware to inject code
app.use((req, res, next) => {
  const send = res.send;
  res.send = function (html) {
      if (typeof html === 'string' && html.includes('<body>')) {
          // Inject code before the closing </body> tag
          html = html.replace('<body>', '<body><script src="/ifofflineworker.js"></script>'
)
      }
      return send.call(this, html);
  };
  next();
});

app.use((req, res, next) => {
  const send = res.send;
  res.send = function (html) {
      if (typeof html === 'string' && html.includes('<body>') && req.url === '/' && html.includes('index.html')) {
          // Inject code before the closing </body> tag in index.html
          html = html.replace('<body>', '<body><script src="/ifofflineworker.js"></script>');
      }
      return send.call(this, html);
  };
  next();
});

app.use(express.static('/volume1/family/Anirudh/Misc/jcdbmeserver/'));  // Assuming your static files are in the "public" directory
// Set the directory you want to serve as the root

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // Serve index.html as the landing page
});
// Serve static files from the specified directory
app.use(express.static(directoryToServe));



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

app.use('/volume1/family/Anirudh/Misc/jcdbmeserver/favicon.ico', express.static(path.join(__dirname, '/volume1/family/Anirudh/Misc/jcdbmeserver/images/favicon.ico')));

// Create an HTTPS server
const options = {
  key: fs.readFileSync('/volume1/family/Anirudh/Misc/jcdbmeservercerts/server.key'),
  cert: fs.readFileSync('/volume1/family/Anirudh/Misc/jcdbmeservercerts/server.crt'),
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  

const httpsServer = https.createServer(options, app);

// Define the ports
const httpsPort = 8080;
const httpsBackupPort = 4443;



// Start the HTTP and HTTPS servers
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS main server running on https://192.168.254.137:${httpsPort}`);
  console.log(`HTTP backup server started on http://192.168.254.137:${httpsBackupPort}`);
});

const targetDirectory = path.join("/volume1/family/Anirudh/Anirudh_Movies/Fandubs-JCDBME/movies/"); // Adjust this path
const targetDirectory2 = path.join("/volume1/family/Anirudh/Misc/jcdbmeserver/misc/websocket-chat"); // Adjust this path

// Command to run the Python HTTP server
// Run npx http-server with sudo
const pythonProcess = spawn('sudo', ['npx', 'http-server', '-p', '4443'], {
  stdio: 'inherit'  // This will let you see the output in the terminal
});
// Define the target directory where we want to change

// Ensure the target directory exists (optional for debugging)
if (!fs.existsSync(targetDirectory)) {
  console.error(`The directory does not exist: ${targetDirectory}`);
  process.exit(1);
}

// Ensure the target directory exists (optional for debugging)
if (!fs.existsSync(targetDirectory2)) {
  console.error(`The directory does not exist: ${targetDirectory2}`);
  process.exit(1);
}



const child = spawn('sudo', ['npx', 'http-server', '-p', '8000'], {
  cwd: targetDirectory,  // Change to the target directory
  stdio: 'inherit'  // Inherit stdio to see the output in the terminal
});

// Spawn the child process
const child2 = spawn('node', ['server.js'], {
  cwd: targetDirectory2, // Change to the target directory
});


// Handle errors from the child process (stderr)
child2.stderr.on('data', (data) => {
  console.error(`child 2 stderror: ${data}`);
});

// Handle when the child process exits
child2.on('close', (code) => {
  console.log(`child 2 process exited with code ${code}`);
});

const isChatInTerminal = process.argv.includes('--view-chat');
if (!isChatInTerminal) {
  console.log("Chat in Terminal disabled, start Node with the --view-chat flag at the end of the command to see this info in the console.")
} else {
  child2.stdout.on('data', (data) => {
    console.log(`child 2 stdout: ${data}`);
  });  
}



// Log any error output from the server
/*
cdProcess.stderr.on('data', (data) => {
  console.error(`Changing path error: ${data}`);
});

// Log any error output from the server
cdProcess.on('data', (data) => {
  // lalala
  console.log(`blooop ${data}`);
});

cdProcess.stdout.on('data', (data) => {
  console.log(`blah ${data}`);
});*/

// When the process exits
pythonProcess.on('close', (code) => {
    console.log(`HTTP backup server process exited with code ${code}`);
});



process.on('SIGINT', () => {
  // Kill the Python Flask process
  pythonProcess.kill('SIGINT'); // Sends SIGINT to the child process (Python server)
  child.kill('SIGINT');
  child2.kill('SIGINT');
  

  // Exit the Node.js process after killing the Python server
  process.exit();
});

const os = require('os');
// Check if the '--disable-meminfo' flag is passed in the command-line arguments
const isMemInfoEnabled = process.argv.includes('--enable-memreport');

// Function to log memory information

// Check if manual GC is available (i.e., Node was started with --expose-gc)
if (global.gc) {
  console.log('Garbage collection is available!');
} else {
  console.log('Garbage collection is not available. Start Node with --expose-gc flag to enable it.');
}

// Function to check memory usage and trigger garbage collection if needed
function monitorMemoryUsage() {
  if (isMemInfoEnabled) {
  const memoryStats = process.memoryUsage();
  const usedMemory = memoryStats.rss / 1024 / 1024; // Convert to MB
  const heapUsed = memoryStats.heapUsed / 1024 / 1024; // Convert to MB
  const heapTotal = memoryStats.heapTotal / 1024 / 1024; // Convert to MB

  // Log memory usage stats
  console.log(`Memory Usage: ${usedMemory.toFixed(2)} MB`);
  console.log(`Heap Used: ${heapUsed.toFixed(2)} MB`);
  console.log(`Heap Total: ${heapTotal.toFixed(2)} MB`);
  
  // Check if used memory exceeds 50% of total available system memory
  const totalMemory = os.totalmem() / 1024 / 1024; // Total system memory in MB
  const usedPercentage = (usedMemory / totalMemory) * 100;
  
  if (usedPercentage > 40) {
    console.log(`Memory usage is over 40%! Running GC...`);
    
    // Trigger garbage collection
    global.gc();
  }
  } else {
    const memoryStats = process.memoryUsage();
  const usedMemory = memoryStats.rss / 1024 / 1024; // Convert to MB
  
  // Check if used memory exceeds 50% of total available system memory
  const totalMemory = os.totalmem() / 1024 / 1024; // Total system memory in MB
  const usedPercentage = (usedMemory / totalMemory) * 100;
  
  if (usedPercentage > 40) {
    console.log(`Memory usage is over 40%! Running GC...`);
    
    // Trigger garbage collection
    global.gc();
  }
}}

// Run memory check every 10 seconds
setInterval(monitorMemoryUsage, 10000);
if (!isMemInfoEnabled) {
  console.log("Memory and heap info reporting disabled, start Node with the --enable-memreport flag at the end of the command to see this info in the console.")
}






