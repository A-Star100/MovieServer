// Connect to WebSocket server
const socket = new WebSocket('ws://192.168.254.137:3000');

// Get references to DOM elements
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');


// Prompt user for username when they first load the page
let username = prompt("Enter your username:");
if (!username) {
  username = "Anonymous";  // Default to "Anonymous" if no username is provided
}

// Function to read the cookie and restore the messages
// Save messages to localStorage
function saveMessagesToCookie() {
  const messagesList = document.getElementById('messages');
  const messages = [];

  // Loop through <li> elements and save their text content
  for (const messageElement of messagesList.children) {
    messages.push(messageElement.textContent);
  }

  // Store the messages in localStorage
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Restore messages from localStorage
function restoreMessagesFromCookie() {
  const messages = JSON.parse(localStorage.getItem('messages'));

  if (messages) {
    const messagesList = document.getElementById('messages');
    messages.forEach(message => {
      const messageElement = document.createElement('li');
      messageElement.textContent = message;
      messagesList.appendChild(messageElement);
    });
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
      }
    }
});

// Optionally, handle WebSocket close event
socket.addEventListener('close', () => {
  alert('Disconnected from the chat server.');
});
