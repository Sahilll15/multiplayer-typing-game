import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const ArrayOfContent = [
    "This is sahil chalke",
    'This is chikitsa nijai ',
    'this is sanjay chalke',
    'this is chalke family',
    'this is prachi chalke'
]

const roomUsers = {};
const users = []

const solution = [];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    users.push(socket.id);

    console.log('Total users connected:', users.length);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users.splice(users.indexOf(socket.id), 1);

        console.log('Total users connected:', users.length);
    });

    socket.on('game:join', (data) => {
        const { username, roomCode } = data;

        console.log(`length of the room code ${roomCode}`, roomUsers[roomCode]?.length);
        if (roomUsers[roomCode]?.length >= 2) {
            console.log('game full');
            return socket.emit('game:full', 'Sorry, the game is already full');
        }

        if (!roomUsers[roomCode]) {
            socket.join(roomCode);
            roomUsers[roomCode] = [{
                username,
                socketId: socket.id
            }];
            console.log('roomUsers', roomUsers);
        } else {
            roomUsers[roomCode].push({
                username,
                socketId: socket.id
            });
            socket.join(roomCode);
            console.log('roomUsers', roomUsers);
        }

        console.log(username, 'has joined the room with code', roomCode);
        socket.emit('game:joined', data);
        io.to(roomCode).emit('game:joined', data);

        if (roomUsers[roomCode].length === 2) {
            const randomIndex = Math.floor(Math.random() * ArrayOfContent.length);
            io.to(roomCode).emit('game:start', ArrayOfContent[randomIndex]);
        }


        socket.on('game:submit', (data) => {
            solution.push(data);



            console.log(solution);

            if (solution.length === 2) {
                let winner = '';
                if (solution[0].currentTime > solution[1].currentTime) {
                    winner = solution[1].username;
                    console.log(winner)
                } else if (
                    solution[0].currentTime < solution[1].currentTime
                ) {
                    winner = solution[0].username;
                    console.log(winner)
                }
                else {
                    winner = 'Draw';
                }

                io.to(roomCode).emit('game:winner', winner);
                solution = [];
            }
        })



    });

    socket.on('chat:message', (data) => {
        const { message, username, createdAt, count } = data;
        console.log('message: ' + message);
        console.log(count);
        io.emit('chat:message', data);
    });
});


server.listen(4000, () => {
    console.log('server is running on port 4000')
})

app.get('/', () => {
    console.log('hello')
})

