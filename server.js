const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const  formatMessage = require('./utils/messages')
const {userJoin,getUser,userLeave,getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = "ChatCord bot"

// Run when client connects
io.on('connection', socket => {
    socket.on('joinroom', ({username,room})=>{
        const user = userJoin(socket.id,username,room)
        socket.join(user.room);


        socket.emit('message', formatMessage(botName,'Welcome to ChatChord')) //socket.emit emits to single client

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined he chat`)); //broadcast.emit emits to all clients but current one. the '.to'
                                                                                                                                    // means that it only emits to a room
        //refresh user list
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })


    socket.on('disconnect', ()=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`)) ;// io.emit emits to all
        userLeave(socket.id);
        //.log("user left")

        //refresh user list
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //listen for chatMessage
    socket.on('chatMessage', msg=>{
        //console.log(socket.id);
        const user = getUser(socket.id);
        //console.log(user);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));