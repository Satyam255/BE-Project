import { useState, useRef, useCallback } from "react";

/**
 * Encapsulates an elapsed-time timer for the interview session.
 * Returns seconds elapsed and a formatted MM:SS string.
 */
const useInterviewTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
  }, [stopTimer]);

  const formattedTime = `${Math.floor(elapsedTime / 60)
    .toString()
    .padStart(2, "0")}:${(elapsedTime % 60).toString().padStart(2, "0")}`;

  return { elapsedTime, formattedTime, startTimer, stopTimer, resetTimer };
};

export default useInterviewTimer;
