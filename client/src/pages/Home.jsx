import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext';

const Home = () => {
    const [username, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const { socket } = useSocket();

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        socket.emit('game:join', { username, roomCode });

        await socket.on('game:full', (msg) => {
            alert(msg);
            return;
        })

        await socket.on('game:joined', (msg) => {
            console.log('game joined')
            if (username && roomCode) {
                navigate(`/room/${username}/${roomCode}`, { username, roomCode });
            }
        }
        )
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6">Join Room</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">Username</label>
                        <input type="text" id="username" name="username" className="w-full px-3 py-2 border focus:outline-none focus:border-blue-500 rounded-md"

                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="roomCode" className="block text-gray-600 text-sm font-medium mb-2">Room Code</label>
                        <input type="text" id="roomCode" name="roomCode" className="w-full px-3 py-2 border focus:outline-none focus:border-blue-500 rounded-md"
                            onChange={(e) => {
                                setRoomCode(e.target.value);
                            }}
                        />
                    </div>


                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Join</button>
                </form>
            </div>
        </div>
    )
}

export default Home
