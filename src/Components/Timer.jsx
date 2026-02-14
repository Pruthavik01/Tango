import { useState, useEffect, useRef } from "react";

export default function Timer({ isWin, onReset }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const startTimeRef = useRef(Date.now());

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isWin) {
      setIsRunning(false);
    }
  }, [isWin]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setIsRunning(true);
    onReset();
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="text-3xl font-bold text-gray-800">
        ⏱ {formatTime(elapsedTime)}
      </div>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
      >
        New Game
      </button>
    </div>
  );
}