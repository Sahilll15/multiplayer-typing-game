import logo from './logo.svg';
import './App.css';
import { useSocket } from './context/SocketContext';
import { useEffect, useState } from 'react';
import {
  BrowserRouter, Route,
  Routes
} from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';

function App() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat:message', (message) => {
      setMessages((state) => {
        return [...state, message];
      });
    });
  }, [socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:username/:roomCode" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
