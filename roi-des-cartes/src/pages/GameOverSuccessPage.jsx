import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GameOverSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSeeLeaderboard = () => {
    setShowConfirmation(true);
  };

  const confirmLocation = () => {
    setShowConfirmation(false);
    const from = location.state?.from || "default";
    let leaderboardPath = "";
    if (from === "locker-reveal") {
      leaderboardPath = "/leaderboard-game2";
    } else if (from === "qr-rush") {
      leaderboardPath = "/leaderboard-game1";
    } else if (from === "puzzle5") {
      leaderboardPath = "/leaderboard-game3";
    } else if (from === "declare-sign") {
      leaderboardPath = "/leaderboard-game4";
    }
    navigate(leaderboardPath, { state: { from: "success" } });
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {showConfirmation && (
        <div className="modal-container-success">
          <div className="modal-success">
            <h1>Confirmation</h1>
            <p>Êtes-vous bien en salle 125 ?</p>
            <div className="success-buttons">
              <button onClick={confirmLocation}>Oui</button>
              <button onClick={cancelConfirmation}>Non</button>
            </div>
          </div>
        </div>
      )}
      <div className="fireworks-background">
        <h2>Épreuve terminée</h2>
        <p>Tu as survécu à l&apos;épreuve.</p>
        <div className="rotating-card">
          <img src="/assets/carreaux.webp" alt="carreaux" />
        </div>
        <p>Rends-toi en salle 125 pour récupérer ta carte</p>

        <button className="btn-leaderboard" onClick={handleSeeLeaderboard}>
          Voir le classement
        </button>
      </div>
    </>
  );
};

export default GameOverSuccess;
