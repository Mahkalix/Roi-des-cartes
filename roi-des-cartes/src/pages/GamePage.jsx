import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Puzzle1 from "./Puzzle1Page.jsx";
import Puzzle2 from "./Puzzle2Page.jsx";
import Puzzle3 from "./Puzzle3Page.jsx";
import Puzzle4 from "./Puzzle4Page.jsx";
import Puzzle5 from "./Puzzle5Page.jsx";

const GamePage = () => {
  const { teamId, playerId } = useParams();
  const navigate = useNavigate();
  const [gameStatus, setGameStatus] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await fetch(
          `https://g1s5d.22.gremmi.fr/api/game-status/${teamId}/${playerId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'état du jeu.");
        }
        const data = await response.json();
        setGameStatus(data);

        // Si le puzzle actuel est déjà résolu
        if (data?.currentGame?.isSolved) {
          setIsPuzzleSolved(true);
        }
      } catch (error) {
        console.error("Erreur :", error);
        setGameStatus({ error: "Impossible de charger l'état du jeu." });
      }
    };

    fetchGameStatus();
  }, [teamId, playerId]);

  const updateTeamScores = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/update-team-scores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teamId, points: 6 }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des scores.");
      }

      console.log("Points attribués avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'attribution des points :", error);
    }
  };

  const finishGame = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/finish-game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerId, teamId }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la validation de l'énigme.");
      }

      console.log("Énigme terminée !");
      setIsWaiting(true); // Mettre l'utilisateur en attente
    } catch (error) {
      console.error("Erreur lors de la validation de l'énigme :", error);
    }
  };

  const finishLastPuzzle = async () => {
    try {
      // Valider le puzzle du dernier joueur
      await finishGame();

      // Mettre à jour les scores de l'équipe
      await updateTeamScores();

      // Vérifier si tous les joueurs de l'équipe ont terminé
      const response = await fetch(
        `https://g1s5d.22.gremmi.fr/api/check-team-finished/${teamId}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification des autres joueurs.");
      }

      const data = await response.json();

      if (data.allFinished) {
        navigate("/success");
      }
    } catch (error) {
      console.error("Erreur lors de la fin du dernier puzzle :", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  if (isWaiting || (gameStatus && !gameStatus.isPlayerTurn)) {
    const currentPlayer = gameStatus?.currentGame?.player_name || "Inconnu";
    const currentStep = gameStatus?.currentGame?.step || 0;
    const totalSteps = gameStatus?.games?.length || 0;

    // Rediriger vers la page de succès si le joueur est "Inconnu" ou si le currentStep est égal à totalSteps
    if (currentPlayer === "Inconnu" || currentStep === totalSteps) {
      navigate("/success");
      return null;
    }

    return (
      <div className="waiting-container">
        <p>
          {isWaiting
            ? `Vous avez terminé votre énigme. Joueur actif : ${currentPlayer} (${currentStep}/${totalSteps}).`
            : `Attendez votre tour. Joueur actif : ${currentPlayer} (${currentStep}/${totalSteps}).`}
        </p>
        <button
          onClick={refreshPage}
          style={{ marginTop: "20px", padding: "10px 20px" }}
        >
          Rafraîchir
        </button>
      </div>
    );
  }
  if (!gameStatus) {
    return <p>Chargement...</p>;
  }

  if (gameStatus?.error) {
    return <p>{gameStatus.error}</p>;
  }

  if (!gameStatus.currentGame) {
    return (
      <p>Aucune énigme n&apos;est encore activée. Veuillez patienter...</p>
    );
  }

  const renderPuzzle = () => {
    switch (gameStatus.currentGame.puzzle_id) {
      case 1:
        return <Puzzle1 onSolve={() => setIsPuzzleSolved(true)} />;
      case 2:
        return <Puzzle2 onSolve={() => setIsPuzzleSolved(true)} />;
      case 3:
        return <Puzzle3 onSolve={() => setIsPuzzleSolved(true)} />;
      case 4:
        return <Puzzle4 onSolve={() => setIsPuzzleSolved(true)} />;
      case 5:
        return (
          <div>
            <Puzzle5 onSolve={() => setIsPuzzleSolved(true)} />
            {isPuzzleSolved && (
              <button onClick={finishLastPuzzle} style={{ marginTop: "20px" }}>
                Terminer
              </button>
            )}
          </div>
        );
      default:
        return <p>Énigme inconnue. Veuillez contacter un administrateur.</p>;
    }
  };

  return (
    <div className="game-container">
      {renderPuzzle()}
      {isPuzzleSolved && gameStatus.currentGame.puzzle_id !== 5 && (
        <button onClick={finishGame} style={{ marginTop: "20px" }}>
          Terminer
        </button>
      )}
    </div>
  );
};

export default GamePage;
