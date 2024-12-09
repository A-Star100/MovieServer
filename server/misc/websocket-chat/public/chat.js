// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:3000');

// Get references to DOM elements
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const overlay = document.getElementById('overlay');
overlay.style.display = "none";


// Prompt user for username when they first load the page
/*let username = prompt("Enter your username:");
if (!username) {
  username = "Anonymous";  // Default to "Anonymous" if no username is provided
  alert("Your username will be Anonymous since you provided no username.")
}*/

// Function to read the cookie and restore the messages
// Save messages to localStorage
function saveMessagesToCookie() {
  const messagesList = document.getElementById('messages');
  const messages = [];
  
  // Loop through <li> elements and save their text content
  for (const messageElement of messagesList.children) {
    messages.push(messageElement.textContent);
  }

  // Get the current time (in milliseconds)
  const currentTime = Date.now();
  
  // Set expiration time to 1 week (7 days)
  const expirationTime = 7 * 24 * 60 * 60 * 1000;  // 1 week in milliseconds
  
  // Store messages along with the timestamp and expiration time
  const data = {
    messages: messages,
    timestamp: currentTime,
    expiration: expirationTime
  };

  localStorage.setItem('messages', JSON.stringify(data));
}

// Restore messages from localStorage
const messagesList = document.getElementById('messages');
function restoreMessagesFromCookie() {
  const storedData = JSON.parse(localStorage.getItem('messages'));

  if (storedData) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - storedData.timestamp;
    
    // If the stored data is older than 1 week, remove it
    if (timeElapsed > storedData.expiration) {
      localStorage.removeItem('messages');
      messagesList.innerHTML = '';
      console.log('Stored messages expired, removing from localStorage');
    } else {
      // Otherwise, restore the messages
      storedData.messages.forEach(message => {
        const messageElement = document.createElement('li');
        messageElement.textContent = message;
        messagesList.appendChild(messageElement);
      });
    }
  }
}

// Log when WebSocket is connected
socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});



// Handle incoming messages
socket.addEventListener('message', (event) => {
  // Check if the message is a Blob (binary data)
  if (event.data instanceof Blob) {
    // Convert the Blob to a string
    const reader = new FileReader();
    reader.onload = function () {
      const message = reader.result; // This will be the string content of the Blob
      displayMessage(message);  // Display the received message
    };
    reader.readAsText(event.data); // Convert the Blob to a text string
  } else {
    // If it's already a string, just display it
    displayMessage(event.data);
  }
});

// Scroll to bottom function
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}


// Function to display the message in the chat window
function displayMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.textContent = message;  // Show the message
  messages.appendChild(messageElement);  // Append the message to the list
}

// Send a message when the send button is clicked
sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    const formattedMessage = `${username}: ${message}`;
    displayMessage(formattedMessage);  // Immediately show the message in the user's chat window
    socket.send(formattedMessage);    // Send the formatted message to the WebSocket server
    messageInput.value = '';  // Clear the input field after sending
    scrollToBottom();
    smallText.style.display = "none";
    saveMessagesToCookie();
  }
});
// Select the message input element from the DOM
// Add event listener to the input field to listen for the "Enter" key
messageInput.addEventListener('keydown', function(event) {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      const message = messageInput.value;
      if (message) {
        const formattedMessage = `${username}: ${message}`;
        displayMessage(formattedMessage);  // Immediately show the message in the user's chat window
        socket.send(formattedMessage);    // Send the formatted message to the WebSocket server
        messageInput.value = '';  // Clear the input field after sending
        smallText.style.display = "none";
        scrollToBottom();
        saveMessagesToCookie();
      }
    }
});

// Optionally, handle WebSocket close event
socket.addEventListener('close', () => {
  overlay.style.display = "block";
});

 // Save messages before the page is unloaded (including refresh)
 window.addEventListener('beforeunload', () => {
  saveMessagesToCookie();
});

function hideOverlay() {
overlay.style.display = "none";
}

// Call this function when the page loads to restore any saved messages
window.addEventListener('load', restoreMessagesFromCookie);
