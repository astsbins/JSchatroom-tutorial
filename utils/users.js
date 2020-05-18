const users = {};
const rooms = {};

// Join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};
    if (room in rooms){
        rooms[room].push(user)
    }else{
        rooms[room] = [user];
    }
    users[id] = {username, room};
    //console.log(users)
    return user
}

function getUser(id) {
    return users[id];
}

function userLeave(id){
    delete users[id];
    //console.log(users);
}

function getRoomUsers(room) {
    //console.log(rooms);
    return rooms[room];
}

module.exports = {
    userJoin,
     getUser,
    userLeave,
    getRoomUsers,
};