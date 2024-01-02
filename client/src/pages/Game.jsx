import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useParams } from 'react-router-dom'

const Game = () => {
    const { username, roomCode } = useParams();

    const { socket } = useSocket();
    const [user, setUser] = useState('')

    const [sentence, SetSentence] = useState('')
    const [typedSentence, setTypedSentence] = useState('');

    const [waiting, setWaitingTrue] = useState(true);
    const [subbmited, setSubmited] = useState(false);
    const [winner, setWinner] = useState(false);


    const handleSubmit = () => {
        // socket.emit('game:submit', { username, typedSentence });
        console.log(sentence, typedSentence)
        console.log(sentence.trim().toLowerCase() === typedSentence.trim().toLowerCase())
        if (sentence.trim().toLowerCase() === typedSentence.trim().toLowerCase()) {
            const currentTime = new Date().toLocaleTimeString();
            alert(`Correct! Submission time: ${currentTime}`);
            console.log('username', username)
            socket.emit('game:submit', { username, currentTime });
            setSubmited(true);
        } else {
            alert('Incorrect, please retry');
            // SetSentence('');
        }

    }


    useEffect(() => {
        socket.on('game:joined', (data) => {
            console.log(data);
        })
        socket.on('game:start', (data) => {
            setWaitingTrue(false);
            console.log('game:start', data)
            SetSentence(data);
        }
        )

        socket.on('game:winner', (winner) => {
            setWinner(true);
            alert(`Winner is ${winner}`);
        })


    }, [socket])
    return (
        <div className='p-10 '>
            <div className='font-bold flex justify-center text-2xl text-red-500'>
                {/* Welcome,{username} */}
            </div>

            {waiting ? <div className='flex justify-center text-2xl text-red-500'>
                Waiting for other players to join...
            </div> :

                <div className='flex justify-center text-2xl text-red-500'>
                    Game has started
                </div>
            }

            {
                sentence && !subbmited ?
                    <div className='flex justify-center'>
                        {
                            winner
                                ?
                                <div className='text-xl text-black font-bold'>
                                    {
                                        winner
                                    }
                                </div>
                                :
                                <div className=' text-2xl text-red-500'>
                                    {sentence}
                                </div>}


                        <input type="text" name='typedSentence'
                            onChange={(e) => {
                                setTypedSentence(e.target.value)
                            }}
                            value={typedSentence}
                            className='border-2 border-red-500 rounded-md p-2 m-2 '
                        />

                        <button

                            className='
                                border border-black p-2 bg-black text-white
                            '

                            onClick={handleSubmit
                            }
                        >
                            Submit
                        </button>

                    </div>
                    :
                    null
            }




        </div>

    )
}

export default Game
