const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages')

const socket = io();

//message from server
socket.on('message', message => {
    console.log(`client side: ${message}`)
    outputMessage(message)
})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent form from automatically submitting to a file
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    //scroll down then clear input
    chatMessages.scrollTop = chatMessages.scrollHeight;
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">Mary <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `
    document.querySelector('.chat-messages').appendChild(div);
}