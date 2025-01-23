import { useNavigate } from "react-router-dom";

const GameOverElimination = () => {
  const navigate = useNavigate();

  const handleSeeLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="gif-background">
      <h2 className="game-title">[GAME OVER]</h2>
      <h2>Partie terminée</h2>
      <p>Ooooppss !!!</p>
      <div className="rotating-card">
        <img
          className="death"
          src="/assets/death2.webp"
          alt="poster qui indique la mort"
        />
      </div>
      <p>Tu es éliminé.</p>
      <button className="btn-leaderboard" onClick={handleSeeLeaderboard}>
        Voir le classement
      </button>
    </div>
  );
};

export default GameOverElimination;
