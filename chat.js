const socket = io();
let username = '';

function login() {
    username = document.getElementById('username').value;
    socket.emit('setUsername', username);
}

socket.on('valid', (isValid) => {
    if (isValid) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
    } else {
        document.getElementById('error').textContent = 'Username already taken!';
    }
});

socket.on('message', (data) => {
    const messageContainer = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${data.user}: ${data.text}`;
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('userList', (users) => {
    document.getElementById('user-list').textContent = 'Online: ' + users.join(', ');
});

function sendMessage() {
    const message = document.getElementById('message-input').value;
    socket.emit('chatMessage', message);
    document.getElementById('message-input').value = '';
}

// Emoji picker support
document.querySelector('emoji-picker').addEventListener('emoji-click', event => {
    const messageInput = document.getElementById('message-input');
    messageInput.value += event.detail.unicode;
});
