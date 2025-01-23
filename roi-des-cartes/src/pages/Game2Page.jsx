import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameTemplate from "../components/GameTemplate";
import InstructionPage from "../components/InstructionPage";

const Game2 = () => {
  const [phase, setPhase] = useState("intro");
  const navigate = useNavigate();

  const handleStartGame = () => {
    setPhase("instructions");
  };

  const handleStartGameFromInstructions = () => {
    navigate("/puzzle-page");
  };

  return (
    <>
      {phase === "intro" && (
        <GameTemplate
          gameNumber="2"
          gameTitle="Chamber of Secrets"
          imageUrl="/assets/carreaux.webp"
          gameDescription="Jeux de carreaux"
          onStartGame={handleStartGame}
        />
      )}

      {phase === "instructions" && (
        <InstructionPage
          title="[Game 2]"
          content="Chamber of Secrets"
          description="Bienvenue dans le jeu Chamber of Secrets ! Votre mission est de résoudre des énigmes pour progresser dans le jeu. Assemblez les puzzles et découvrez les indices nécessaires pour avancer. Le premier puzzle se résout directement sur votre téléphone, et le second vous mènera à un endroit secret où vous devrez continuer votre quête. Les 60 % des joueurs les plus rapides passeront à la prochaine étape."
          rules={[
            "Vous avez 10 minutes pour résoudre les énigmes et découvrir l’endroit secret.",
            "Résolvez un premier puzzle directement sur votre téléphone pour obtenir un indice crucial pour la suite.",
            "Seuls les joueurs les plus rapides seront qualifiés pour l’étape suivante. Le classement est basé sur la vitesse et la précision dans la résolution des énigmes.",
          ]}
          onStartGame={handleStartGameFromInstructions}
        />
      )}
    </>
  );
};

export default Game2;
