import { useState } from "react";
import GameTemplate from "../components/GameTemplate";
import InstructionPage from "../components/InstructionPage";

const Game4 = () => {
  const [phase, setPhase] = useState("intro");

  const handleStartGame = () => {
    setPhase("instructions");
  };

  const handleStartGameFromInstructions = () => {
    window.location.href = "/player-sign"; // Redirection vers PlayerSignPage.jsx
  };

  return (
    <>
      {phase === "intro" && (
        <GameTemplate
          gameNumber={4}
          gameTitle="Le Jeu de Confiance"
          imageUrl="/assets/coeur.webp" // Image correspondant aux symboles
          gameDescription="Un jeu de psychologie"
          onStartGame={handleStartGame}
        />
      )}

      {phase === "instructions" && (
        <InstructionPage
          title="[Game 4]"
          content="Le Jeu de Confiance"
          description="Bienvenue dans le Jeu de Confiance ! Vous allez devoir déduire et déclarer votre symbole tout en observant ceux des autres. Prenez garde, une mauvaise déclaration entraînera votre élimination."
          rules={[
            "Chaque joueur reçoit un symbole parmi ♣️, ♥️, ♠️, ou ♦️.",
            "Vous voyez les symboles des autres joueurs, mais pas le vôtre.",
            "Déduisez votre symbole en écoutant et observant les autres.",
            "Déclarez votre symbole. Si vous vous trompez, vous êtes éliminé.",
            "Le dernier joueur restant remporte la partie.",
          ]}
          onStartGame={handleStartGameFromInstructions}
        />
      )}
    </>
  );
};

export default Game4;
