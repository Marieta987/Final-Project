var socket = io();
let players = {
    me: {
        name : '',
        room : ''
    },
    enemy: {
        name : '',
        room : ''
    }
};

const part1 = document.getElementById('part1');
const part2 = document.getElementById('userSelection');
const placeHolder = document.getElementById('message');


var userOption = undefined;


function playWith(option) {
    // first, we deselect the previous selected element (if exist)
    if (userOption !== undefined) {
        userSelectionElement = document.getElementById(userOption);
        // we remove the  border (if exist)
        userSelectionElement.style.border = "0px  #ffcc00 solid";
    }
    // then, we select the user option and we add
    // a purple border
    userOption = option;
    userSelectionElement = document.getElementById(option);
    userSelectionElement.style.border = "5px  #ffcc00 solid";
}

document.getElementById('new').addEventListener('click', function(e) {
    const name = document.getElementById('nameNew');
    if (name.value) {
        players.me.name = name.value;
        socket.emit('createGame', {
            name: name.value
        });
    }
});

socket.on('newGame', function(data) {
    placeHolder.innerText = `Hello, ${data.name}. Please ask your friend to enter Game ID: ${data.room}.
    Waiting for players.me 2...`;
    part1.style.display = 'none';
    console.log('mewgame', data);
    players.me = data;
});

document.getElementById('join').addEventListener('click', function(e) {
    if (document.getElementById('nameJoin').value && document.getElementById('room').value) {
        players.me.name = document.getElementById('nameJoin').value;
        players.me.id = 1;
        players.me.room = document.getElementById('room').value;
        socket.emit('joinGame', {
            name: document.getElementById('nameJoin').value,
            room: document.getElementById('room').value
        })
    }
});

socket.on('player1', function(data) {
    part1.style.display = 'none';
    part2.style.display = 'block';

    placeHolder.innerText = `${players.me.name}, ${data.opName}`;
});

socket.on('player2', function(data) {
    players.enemy = data;
    part1.style.display = 'none';
    part2.style.display = 'block';

    let player2Name ="";

    //Object.keys(io.sockets.sockets)
    placeHolder.innerText = `${players.enemy.name}, ${data.opName}`;
});

function submit(e) {
    if(userOption) {
        socket.emit('result', {
            option : userOption,
            id : players.me.id,
            room : players.me.room
        });
    }
}

socket.on('gameOver', function (data) {
    console.log(userOption, data, players);
    let result = 'You lose!';
    if(data == 2) {
        result = 'It is a draw!';
    } else if(userOption === data) {
        result = 'You win!';
    }

    alert(result);
});