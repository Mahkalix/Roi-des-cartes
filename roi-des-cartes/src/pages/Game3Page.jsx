import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameTemplate from "../components/GameTemplate"; // Page d'introduction
import InstructionPage from "../components/InstructionPage"; // Page des instructions

const Game3 = () => {
  const [phase, setPhase] = useState("intro"); // phases possibles : 'intro', 'instructions', 'waiting', 'countdown', 'playing', 'puzzle1'
  const [countdown, setCountdown] = useState(12); // Compte à rebours de 12 secondes
  const navigate = useNavigate();

  // Fonction pour démarrer et afficher les instructions
  const handleStartGame = () => {
    setPhase("instructions");
  };

  // Fonction pour démarrer réellement le jeu (après les instructions)
  const handleStartGameFromInstructions = () => {
    setPhase("waiting");
  };

  // Fonction pour démarrer le compte à rebours
  const handleReady = () => {
    setPhase("countdown"); // Passe à la phase du compte à rebours
    let timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer); // Arrêter le compte à rebours quand il atteint 0
          setPhase("playing"); // Passe à la phase "À vous de jouer !"
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Transition automatique vers la première énigme après la phase "playing"
  useEffect(() => {
    if (phase === "playing") {
      const timer = setTimeout(() => {
        navigate("/team"); // Redirige vers /puzzle1 après 3 secondes
      }, 3000); // 3 secondes avant de passer à l'énigme
      return () => clearTimeout(timer); // Nettoie le timeout au changement de phase
    }
  }, [phase, navigate]);

  // Fonction pour formater le temps en MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {phase === "intro" && (
        <GameTemplate
          gameNumber="3"
          gameTitle="Survival Squad"
          imageUrl="/assets/trefles.webp"
          gameDescription="Jeux de trèfles"
          onStartGame={handleStartGame} // Lorsque le joueur commence, on passe à la phase d'instructions
        />
      )}

      {phase === "instructions" && (
        <InstructionPage
          title="[Game 3] Survival Squad"
          content="Survival Squad"
          description="Bienvenue dans le jeu Survival Squad ! Dans cette épreuve, l'esprit d'équipe sera essentiel pour survivre. Vous et votre équipe devez résoudre une série d’énigmes variées tout en collaborant efficacement. Chaque membre aura un rôle unique et devra contribuer à l’avancement du groupe. Rassemblez vos forces, communiquez bien et faites preuve de stratégie pour terminer avant les autres équipes. Êtes-vous prêts à relever le défi et prouver que votre squad est le plus fort ?"
          rules={[
            "Les équipes sont générées automatiquement. Chaque joueur reçoit une énigme spécifique.",
            "Les énigmes doivent être résolues dans un ordre précis. Les joueurs peuvent partager des indices.",
            "Chaque équipe dispose de 10 minutes maximum. Résolvez toutes les énigmes pour vous qualifier.",
          ]}
          onStartGame={handleStartGameFromInstructions} // Lorsque le joueur clique, on passe à la phase d'attente
        />
      )}

      {phase === "waiting" && (
        <div className="game-container">
          <h2>[Game 3]</h2>
          <p>En attente des autres joueurs...</p>
          <button
            className="start-button"
            onClick={handleReady} // Passe à la phase countdown
          >
            Tous prêts
          </button>
        </div>
      )}

      {phase === "countdown" && (
        <div className="game-container">
          <h2>[Game 3]</h2>
          <p>Le jeu commence dans :</p>
          <h1>{formatTime(countdown)}</h1>
        </div>
      )}

      {phase === "playing" && (
        <div className="game-container">
          <h2>[Game 3]</h2>
          <h1>À vous de jouer !</h1>
          {/* "À vous de jouer !" sera affiché pendant 3 secondes avant de passer à la première énigme */}
        </div>
      )}
    </>
  );
};

export default Game3;
