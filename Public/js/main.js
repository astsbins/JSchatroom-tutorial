const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from url (surely there is a better way of doing this?)
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const socket = io();
//join chatrooom
socket.emit('joinroom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message => {
    //console.log(`client side: ${message}`);
    outputMessage(message);
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent form from automatically submitting to a file
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    //scroll down then clear input
    chatMessages.scrollTop = chatMessages.scrollHeight;
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    //console.log(users);
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}