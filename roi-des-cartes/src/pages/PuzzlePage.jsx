import { useState, useEffect, useCallback } from "react";
import puzzleImage from "/assets/arizu.webp";

const PuzzlePage = () => {
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true); // State to control modal visibility
  const [timerRunning, setTimerRunning] = useState(false); // State to control timer

  const shuffleTiles = useCallback(() => {
    const initialTiles = Array.from({ length: 9 }, (_, i) => i);
    let shuffledTiles;
    do {
      shuffledTiles = [...initialTiles].sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffledTiles) || isSolved(shuffledTiles));
    setEmptyIndex(shuffledTiles.indexOf(8));
    return shuffledTiles;
  }, []);

  useEffect(() => {
    if (!showInstructions) {
      setTiles(shuffleTiles());
    }
  }, [shuffleTiles, showInstructions]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0 && !solved) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !solved) {
      alert("Temps écoulé !");
      setScore(0); // Assign 0 points if time runs out
      sendScoreToServer(0); // Send score to server
      resetPuzzle();
    }
  }, [timeLeft, solved, timerRunning]);

  function isSolvable(tiles) {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] !== 8 && tiles[j] !== 8 && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  }

  function isSolved(tiles) {
    return tiles.every((tile, index) => tile === index);
  }

  const isMovable = (index) => {
    const [row, col] = [Math.floor(index / 3), index % 3];
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / 3), emptyIndex % 3];
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleTileClick = (index) => {
    if (isMovable(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);
      setEmptyIndex(index);
      if (isSolved(newTiles)) {
        setSolved(true);
        setScore(4); // Assign 4 points if solved before time runs out
        sendScoreToServer(4); // Send score to server
      }
    }
  };

  const sendScoreToServer = async (score) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("Aucun user_id trouvé. L'utilisateur doit être connecté.");
      return;
    }

    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/update-scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: score,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        // Si la réponse n'est pas OK (par exemple, code 404 ou 500), afficher l'erreur
        const errorText = await response.text();
        console.error("Erreur lors de l'envoi du score:", errorText);
        return;
      }

      const data = await response.json();
      if (data.success) {
        console.log("Score envoyé avec succès.");
      } else {
        console.error("Erreur lors de la mise à jour du score:", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du score :", error);
    }
  };

  const solvePuzzle = () => {
    const solvedTiles = Array.from({ length: 9 }, (_, i) => i);
    setTiles(solvedTiles);
    setEmptyIndex(8);
    setSolved(true);
    setScore(4);
    sendScoreToServer(4);
  };

  const resetPuzzle = () => {
    setTiles(shuffleTiles());
    setSolved(false);
  };

  const startGame = () => {
    setShowInstructions(false);
    setTimerRunning(true); // Start the timer when the game starts
  };

  return (
    <>
      {showInstructions && (
        <div className="instructions-popup-container">
          <div className="instructions-popup">
            <h2>Instructions</h2>

            <p>
              Votre objectif est de résoudre le puzzle avant la fin du temps
              imparti.
            </p>
            <img src="/assets/arizu.webp" alt="" />
            <button onClick={startGame}>Commencer</button>
          </div>
        </div>
      )}
      <div className={`puzzle-container ${showInstructions ? "blurred" : ""}`}>
        {!showInstructions && (
          <>
            <h1>Image Puzzle Game</h1>
            {!solved && (
              <div>
                <strong className="timer">
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
                  {timeLeft % 60}
                </strong>
              </div>
            )}
            <div className="puzzle-grid">
              {tiles.map((tile, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                return (
                  <div
                    key={index}
                    className={`puzzle-piece 
                ${tile === 8 ? "empty" : ""}
                row-${row} col-${col}`}
                    onClick={() => handleTileClick(index)}
                    style={{
                      backgroundImage:
                        tile !== 8 ? `url(${puzzleImage})` : "none",
                      backgroundPosition:
                        tile !== 8
                          ? `${(tile % 3) * 33.33}% ${
                              Math.floor(tile / 3) * 33.33
                            }%`
                          : "none",
                      backgroundSize: "400% 400%",
                    }}
                  ></div>
                );
              })}
            </div>
            <button onClick={solvePuzzle} className="solve-button">
              Résoudre
            </button>
            <button onClick={resetPuzzle} className="reset-button">
              <span className="icon">↻</span>
            </button>
            {solved && (
              <>
                <button
                  onClick={() => (window.location.href = "/locker-challenge")}
                  className="next-page-button"
                >
                  Aller à la page suivante
                </button>
                <div className="victory-message">
                  Bravo, Vous pouvez vous rendre au foyer !
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PuzzlePage;
