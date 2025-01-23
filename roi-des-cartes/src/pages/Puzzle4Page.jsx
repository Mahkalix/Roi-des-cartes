import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateMaze } from "../utils/mazeutil.js";

export default function Puzzle4Page({ onSolve }) {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1); // Niveau actuel
  const [status, setStatus] = useState("playing"); // Statut du jeu
  const [playerPosition, setPlayerPosition] = useState([0, 0]); // Position initiale
  const [timeLeft, setTimeLeft] = useState(300); // Temps restant pour tous les niveaux
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false); // State to control timer
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const mazeSize = level === 1 ? 7 : level === 2 ? 10 : 15;
  const maze = useMemo(() => generateMaze(mazeSize, mazeSize), [level]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleOrientation = (event) => {
    const { beta, gamma } = event;
    const currentTime = Date.now();
    if (currentTime - lastMoveTime < 500) return; // Reduce speed by limiting moves to one every 500ms

    if (Math.abs(beta) > Math.abs(gamma)) {
      if (beta > 15) handleMove("down");
      else if (beta < -15) handleMove("up");
    } else {
      if (gamma > 15) handleMove("right");
      else if (gamma < -15) handleMove("left");
    }
    setLastMoveTime(currentTime);
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [playerPosition, status, lastMoveTime]);

  // Décrémentation du timer
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/game-over"); // Redirige vers la page de game-over
      return;
    }

    if (status === "playing" && !isPaused && timerRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Nettoyer le timer
    }
  }, [timeLeft, status, isPaused, timerRunning, navigate]);

  // Vérification de la victoire
  useEffect(() => {
    if (
      playerPosition[0] === mazeSize - 1 &&
      playerPosition[1] === mazeSize - 1
    ) {
      if (level === 3) {
        setStatus("won");
      } else {
        setLevel(level + 1);
        setPlayerPosition([0, 0]);
      }
    }
  }, [playerPosition, level, mazeSize]);

  // Déplacement du joueur
  const handleMove = (direction) => {
    if (status !== "playing") return;

    const [x, y] = playerPosition;
    if (direction === "up" && maze[x][y][0] === 1) {
      setPlayerPosition([x - 1, y]);
    }
    if (direction === "right" && maze[x][y][1] === 1) {
      setPlayerPosition([x, y + 1]);
    }
    if (direction === "down" && maze[x][y][2] === 1) {
      setPlayerPosition([x + 1, y]);
    }
    if (direction === "left" && maze[x][y][3] === 1) {
      setPlayerPosition([x, y - 1]);
    }
  };

  const getClassName = (i, j) => {
    const cellWalls = maze[i][j];
    const classes = [];
    if (cellWalls[0] === 0) classes.push("topWall");
    if (cellWalls[1] === 0) classes.push("rightWall");
    if (cellWalls[2] === 0) classes.push("bottomWall");
    if (cellWalls[3] === 0) classes.push("leftWall");

    if (i === playerPosition[0] && j === playerPosition[1])
      classes.push("player");
    if (i === mazeSize - 1 && j === mazeSize - 1) classes.push("destination");
    return classes.join(" ");
  };

  const finishGame = () => {
    setStatus("finished");
    onSolve();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startGame = () => {
    setShowInstructions(false);
    setTimerRunning(true); // Start the timer when the game starts
  };

  return (
    <>
      {showInstructions && (
        <div className="instructions-popup-container">
          <div className="modal-content">
            <h2>Instructions</h2>
            <p>
              Utilisez les mouvements de votre téléphone pour vous déplacer dans
              le labyrinthe et trouver la sortie. Vous avez{" "}
              <strong>90 secondes</strong> par labyrinthe.
            </p>
            <button onClick={startGame}>
              <strong className="primary-color">Commencer</strong>
            </button>
          </div>
        </div>
      )}
      <div className={`maze-game ${showInstructions ? "blurred" : ""}`}>
        <h1>Labyrinthe</h1>
        {status === "won" && (
          <div className="victory">
            <p>Bravo! Tu as terminé tous les niveaux du labyrinthe!</p>
            <button onClick={finishGame} className="finish-button">
              Terminer
            </button>
          </div>
        )}
        {/* Affichage du niveau et du timer */}
        {status === "playing" && (
          <div className="status-bar">
            <p>Niveau : {level}</p>
            <p className="timer">{formatTime(timeLeft)}</p>
          </div>
        )}
        {/* Labyrinthe */}
        <table className="maze">
          <tbody>
            {maze.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={getClassName(i, j)}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
