import { useState, useEffect } from "react";

export default function Timer({ isWin }) {
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval;

    if (!isWin) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWin, startTime]);

  return (
    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      ⏱ {formatTime(elapsedTime)}
    </div>
  );
}
