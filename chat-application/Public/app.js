const socket = io();

const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const messagesContainer = document.getElementById('messages');

sendMessageBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatMessage', message);  // Send message to server
    messageInput.value = '';  // Clear input field
  }
});

// Listen for incoming messages from server
socket.on('chatMessage', (msg) => {
  const msgElement = document.createElement('div');
  msgElement.textContent = msg;
  messagesContainer.appendChild(msgElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;  // Auto-scroll to latest message
});
