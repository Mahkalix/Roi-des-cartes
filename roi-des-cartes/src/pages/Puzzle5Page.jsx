import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Puzzle5 = ({ onSolve }) => {
  const navigate = useNavigate();
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState("RIGHT");
  const [letter, setLetter] = useState({ x: 15, y: 15, value: "T" });
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [accelerometerEnabled, setAccelerometerEnabled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const gridSize = 20;
  const targetWord = "TREFLES"; //"TREFLES";

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setCollectedLetters([]);
    setLetter({ x: 15, y: 15, value: "T" });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleMove = (newDirection) => {
    if (
      (newDirection === "UP" && direction !== "DOWN") ||
      (newDirection === "DOWN" && direction !== "UP") ||
      (newDirection === "LEFT" && direction !== "RIGHT") ||
      (newDirection === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  const generateLetterPosition = () => {
    const margin = 2;
    const x = Math.floor(Math.random() * (gridSize - margin * 2)) + margin;
    const y = Math.floor(Math.random() * (gridSize - margin * 2)) + margin;
    return { x, y };
  };

  const moveSnake = () => {
    const head = { ...snake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];

    if (head.x === letter.x && head.y === letter.y) {
      setCollectedLetters([...collectedLetters, letter.value]);

      if (collectedLetters.length + 1 === targetWord.length) {
        setGameOver(true);

        onSolve();
        navigate("/success", { state: { from: "puzzle5" } });

        return;
      }

      const nextLetterIndex = collectedLetters.length + 1;
      const nextLetter = targetWord[nextLetterIndex];
      setLetter({
        ...generateLetterPosition(),
        value: nextLetter,
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const checkCollision = () => {
    const head = snake[0];

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      if (lives > 1) {
        setLives(lives - 1);
        resetGame();
      } else {
        navigate("/game-over");
      }
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        if (lives > 1) {
          setLives(lives - 1);
          resetGame();
        } else {
          navigate("/game-over");
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (isPaused || gameOver || showInstructions || !gameStarted) return;

    const interval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, isPaused, gameOver, showInstructions, gameStarted]);

  useEffect(() => {
    const handleOrientation = (event) => {
      const { beta, gamma } = event;

      if (Math.abs(beta) > Math.abs(gamma)) {
        if (beta > 15) {
          handleMove("DOWN");
        } else if (beta < -15) {
          handleMove("UP");
        }
      } else {
        if (gamma > 15) {
          handleMove("RIGHT");
        } else if (gamma < -15) {
          handleMove("LEFT");
        }
      }
    };

    if (accelerometerEnabled) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      window.removeEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [direction, accelerometerEnabled]);

  useEffect(() => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      const handlePermissionRequest = () => {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              window.addEventListener("devicemotion", (event) => {
                console.log("Accélération :", event.acceleration);
              });
              window.addEventListener("deviceorientation", (event) => {
                console.log(
                  "Orientation :",
                  event.alpha,
                  event.beta,
                  event.gamma
                );
              });
            } else {
              alert("Permission refusée pour les capteurs.");
            }
          })
          .catch(console.error);
      };

      const button = document.getElementById("sensor-button");
      if (button) {
        button.addEventListener("click", handlePermissionRequest);
      }

      return () => {
        if (button) {
          button.removeEventListener("click", handlePermissionRequest);
        }
      };
    } else {
      console.log("Les capteurs sont accessibles sans permission explicite.");
      window.addEventListener("devicemotion", (event) => {
        console.log("Accélération :", event.acceleration);
      });
      window.addEventListener("deviceorientation", (event) => {
        console.log("Orientation :", event.alpha, event.beta, event.gamma);
      });

      return () => {
        window.removeEventListener("devicemotion", () => {});
        window.removeEventListener("deviceorientation", () => {});
      };
    }
  }, []);

  return (
    <>
      {showInstructions && (
        <div className="instructions-popup-container">
          <div className="instructions-popup">
            <h2>Instructions</h2>
            <p>Bienvenue dans le jeu Snake !</p>
            <p>
              Votre objectif est de récupérer toutes les lettres pour former le
              mot &#34;TREFLES&#34;.
            </p>
            <p>Vous avez 3 vies. Bonne chance !</p>
            <button
              id="sensor-button"
              onClick={() => {
                setShowInstructions(false);
                setAccelerometerEnabled(true);
                setGameStarted(true);
              }}
            >
              Commencer
            </button>
          </div>
        </div>
      )}
      <div className={`snake-game ${showInstructions ? "blurred" : ""}`}>
        <div className="status-bar">
          <div className="word-display">
            {targetWord.split("").map((letter, index) => (
              <span
                key={index}
                style={{
                  color: index < collectedLetters.length ? "white" : "gray",
                  margin: "0 5px",
                  fontWeight:
                    index < collectedLetters.length ? "bold" : "normal",
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="lives-display">
            {Array.from({ length: 3 }, (_, i) => (
              <span
                key={i}
                style={{
                  filter: i < lives ? "none" : "grayscale(100%)",
                }}
              >
                {i < lives ? "❤️" : "💔"}
              </span>
            ))}
          </div>
          <button onClick={togglePause} className="pause-button">
            {isPaused ? "⏸" : "▶"}
          </button>
        </div>

        <div className="grid" onClick={() => setGameStarted(true)}>
          {!gameStarted && (
            <div className="play-button">
              <button onClick={() => setGameStarted(true)}>Play</button>
            </div>
          )}
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const isSnake = snake.some(
                (segment) => segment.x === col && segment.y === row
              );
              const isLetter = letter.x === col && letter.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isSnake ? "snake" : ""}`}
                >
                  {isLetter && letter.value}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Puzzle5;
