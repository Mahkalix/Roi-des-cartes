import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CountdownTimer = ({ initialTime, onTimeUp, className }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining < 10 ? "0" : ""}${secondsRemaining}`;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      if (onTimeUp) onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return <div className={className}>{formatTime(timeLeft)}</div>;
};
CountdownTimer.propTypes = {
  initialTime: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func,
  className: PropTypes.string,
};

export default CountdownTimer;
