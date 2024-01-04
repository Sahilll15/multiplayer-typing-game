import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Game = () => {
  const { username, roomCode } = useParams();
  const { socket } = useSocket();

  const [user, setUser] = useState("");
  const [sentence, setSentence] = useState("");
  const [typedSentence, setTypedSentence] = useState("");
  const [waiting, setWaitingTrue] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [winner, setWinner] = useState(false);

  const handleSubmit = () => {
    if (sentence.trim().toLowerCase() === typedSentence.trim().toLowerCase()) {
      const currentTime = new Date().toLocaleTimeString();
      toast.success(`Correct! Submission time: ${currentTime}`);
      socket.emit("game:submit", { username, currentTime });
      setSubmitted(true);
    } else {
      toast.warning("Incorrect, please retry");
    }
  };

  useEffect(() => {
    socket.on("game:joined", (data) => {
      console.log(data);
    });

    socket.on("game:start", (data) => {
      setWaitingTrue(false);
      console.log("game:start", data);
      setSentence(data);
    });

    socket.on("game:winner", (winner) => {
      setWinner(true);
      toast.success(`Winner is ${winner}`);
    });
  }, [socket]);

  return (
    <div
      className="p-10"
      style={{
        backgroundImage:
          "url('data:image/jpeg;base64,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')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        minHeight: "100vh", // Set minimum height to cover the entire viewport
      }}
    >
      <div className="p-10">
        <div className="font-bold flex justify-center items-center text-2xl text-red-500">
          {/* Welcome, {username} */}
        </div>

        {waiting ? (
          <div className="flex justify-center text-2xl text-white">
            Waiting for other players to join...
          </div>
        ) : (
          <div className="flex justify-center text-2xl bg-white text-black">
            Game has started
          </div>
        )}

        {sentence && !submitted ? (
          <div className=" justify-center mt-56">
            {winner ? (
              <div className="text-xl text-black font-bold">{winner}</div>
            ) : (
              <center>
<div className="text-2xl text-white mb-4" style={{ userSelect: 'none', fontFamily: 'Arial' }}>{sentence}</div>
                <div className=" items-center mt-8 ">
                  <textarea
                    type="text"
                    name="typedSentence"
                    onChange={(e) => setTypedSentence(e.target.value)}
                    value={typedSentence}
                    className="border-2 border-red-500 mt-4 bg-gray-100 text-green-500 rounded-md p-2 m-2 focus:outline-none w-full"
                    rows={6}
                  />
                  <br />
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </center>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Game;
