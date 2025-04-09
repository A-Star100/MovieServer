// Connect to WebSocket server
const socket = new WebSocket('ws://192.168.254.161:3000');

// Get references to DOM elements
const messages = document.getElementById('messages');
const messagesList = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const closedOverlay = document.getElementById('overlay');
const roomSelect = document.getElementById('roomSelect');  // New room selection dropdown
closedOverlay.style.display = "none";

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

// Handle WebSocket connection
socket.addEventListener('close', () => {
  console.warn('Connection to WebSocket server closed');
  closedOverlay.style.display = "block";
});

socket.addEventListener('error', function (error) {
  console.error('WebSocket error:', error);
});

// Handle incoming WebSocket messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'message') {
    // Display regular chat messages
    displayMessage(`${data.username}: ${data.message}`);
  } else if (data.type === 'room') {
    // Handle room join message
    if (data.username && data.room) {
      // Display a message saying the user joined the room
      displayMessage(`${data.username} has joined ${data.room}`);
    } else {
      // If no data about the room or username is present, handle it accordingly
      displayMessage('A user has joined the room.');
    }
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

// Add an event listener for the 'keydown' event
messageInput.addEventListener("keydown", function(event) {
  const message = messageInput.value;
  if (message && event.key === "Enter") {
    const room = roomSelect.value;
    const formattedMessage = JSON.stringify({ type: 'message', message: message, room: room, username: username });
    displayMessage(`${username}: ${message}`);
    socket.send(formattedMessage);  // Send the message along with room info
    messageInput.value = '';  // Clear input
    scrollToBottom();
  }
});

// Send a message when the send button is clicked
sendBtn.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    smallText.style.display = "none";
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

