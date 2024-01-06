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

const content = "Sahil is great coder and, he the is, lmao RIP english this auto  generated ok was typing speed test. You can win or sky was the cake.";

// Split the content into words using spaces and punctuation
const wordsArray = content.match(/\b\w+\b/g);

// Filter out empty strings
const filteredWords = wordsArray.filter(word => word.length > 0);

// Shuffle the array to get a random order
for (let i = filteredWords.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [filteredWords[i], filteredWords[j]] = [filteredWords[j], filteredWords[i]];
}

// Take the first 10 words from the shuffled array
const randomWords = filteredWords.slice(0, 10).join(' ');

// console.log(randomWords);



const roomUsers = {};
const users = []

let solution = [];

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

        if (roomUsers[roomCode]?.length === 2) {
            io.to(roomCode).emit('game:start', randomWords);
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

