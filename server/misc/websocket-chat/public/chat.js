// Connect to WebSocket server
const socket = new WebSocket('ws://192.168.254.137:3000'); // Replace with actual server URL

// Get references to DOM elements
const messages = document.getElementById('messages');
const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const overlay = document.getElementById('overlay');
const roomSelect = document.getElementById('roomSelect');  // New room selection dropdown
overlay.style.display = "none";

// Define global variables

// Room selection functionality
roomSelect.addEventListener('change', () => {
  // When room is changed, update the current room and display a welcome message
  const room = roomSelect.value;
  if (room) {
    socket.send(JSON.stringify({ type: 'join', room: room, username: username }));
  }
});

// Handle WebSocket connection
socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});

// Handle incoming WebSocket messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'message') {
    displayMessage(`${data.username}: ${data.message}`);
  } else if (data.type === 'room') {
    // Handle room join message
    displayMessage(`Somebody joined ${data.room}`);
  }
});

// Scroll to bottom function
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// Function to display the message in the chat window
function displayMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.textContent = message;
  messages.appendChild(messageElement);
}

// Send a message when the send button is clicked
sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    const room = roomSelect.value;
    const formattedMessage = JSON.stringify({ type: 'message', message: message, room: room, username: username });
    displayMessage(`${username}: ${message}`);
    socket.send(formattedMessage);  // Send the message along with room info
    messageInput.value = '';  // Clear input
    scrollToBottom();
  }
});

// Save and restore messages from localStorage (if necessary)
window.addEventListener('beforeunload', () => {
  saveMessagesToCookie();
});

function saveMessagesToCookie() {
  const messagesList = document.getElementById('messages');
  const messages = [];
  for (const messageElement of messagesList.children) {
    messages.push(messageElement.textContent);
  }
  localStorage.setItem('messages', JSON.stringify({ messages: messages }));
}

function restoreMessagesFromCookie() {
  const storedData = JSON.parse(localStorage.getItem('messages'));
  if (storedData) {
    storedData.messages.forEach(message => {
      displayMessage(message);
    });
  }
}

window.addEventListener('load', restoreMessagesFromCookie);

