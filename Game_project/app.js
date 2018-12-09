const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = 0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));

console.log(__dirname + '/client');

io.on('connection', function (socket) {
    //loads the file and initilizes returns it into an
// creats room in server and puts newGame in it
    socket.on('createGame', (data) => {
        socket.join(`room-${++rooms}`);
        io.nsps['/'].adapter.rooms[`room-${rooms}`]['name1'] = data.name;
        socket.emit('newGame', {name: data.name, room: `room-${rooms}`, id : 0});
    });

// քցում է սենյակ,որտեղ որ առաջին խաղացողին է քցել եւ ցույց տալիս մեսիջ կներեք սենյակը լիքըն է եթե լիքն է ։Դ
    socket.on('joinGame', function (data) {
        console.log('joingame', data);
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {opName: io.nsps['/'].adapter.rooms[data.room]['name1']});
            io.nsps['/'].adapter.rooms[data.room]['name2'] = data.name;
            socket.emit('player2', {name: data.name, opName : io.nsps['/'].adapter.rooms[data.room]['name1'], room: data.room, id : 1})
        } else {
            socket.emit('err', {message: 'Sorry, The room is full!'});
        }
    });

    socket.on('result', function (data) {
        console.log(data);
        console.log('rooms', io.nsps['/'].adapter.rooms);
        if(!io.nsps['/'].adapter.rooms[data.room][data.id]) {
            io.nsps['/'].adapter.rooms[data.room][data.id] = data.option;
        }
        console.log('sdfsdf',io.nsps['/'].adapter.rooms[data.room]);
        if(io.nsps['/'].adapter.rooms[data.room][0] && io.nsps['/'].adapter.rooms[data.room][1]) {
            const winner = getWinner(io.nsps['/'].adapter.rooms[data.room][0], io.nsps['/'].adapter.rooms[data.room][1]);
            io.sockets.emit('gameOver', winner);
        }
    })
});

function getWinner(userSelection, user2Selection) {
  console.log(userSelection, user2Selection);
    if (userSelection == user2Selection) {
    return '2';
  }

  if (userSelection === "rock") {
    if (user2Selection === "scissors") {
      return userSelection;
    } else {
      return user2Selection;
    }

  } else if (userSelection === "paper") {

    if (user2Selection === "rock") {
      return userSelection;

    } else {
      return user2Selection;
    }

  } else if (userSelection === "scissors") {

    if (user2Selection === "rock") {
      return user2Selection;
    } else {
      return userSelection;
    }

  }
}
server.listen(8080, function () {
    console.log("Server is listening on 8080")
});

