import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const GameSetup = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const handleStartGame = () => {
    navigate("/discussion"); // Redirige vers la page "gameplay"
  };

  return (
    <div className="game-setup">
      <h1>Mistrust Among Us</h1>
      <p>Distribution des rôles en cours...</p>
      <Button onClick={handleStartGame}>Commencer le jeu</Button>
    </div>
  );
};

export default GameSetup;
