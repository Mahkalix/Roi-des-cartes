import { useState } from "react";
import GameTemplate from "../components/GameTemplate";
import InstructionPage from "../components/InstructionPage";

const Game1 = () => {
  const [phase, setPhase] = useState("intro");

  const handleStartGame = () => {
    setPhase("instructions");
  };

  const handleStartGameFromInstructions = () => {
    window.location.href = "/qr-rush";
  };

  return (
    <>
      {phase === "intro" && (
        <GameTemplate
          gameNumber="1"
          gameTitle="QR Codes Rush"
          imageUrl="/assets/pique.webp"
          gameDescription="Jeu de pique"
          onStartGame={handleStartGame}
        />
      )}

      {phase === "instructions" && (
        <InstructionPage
          title="[Game 1]"
          content="QR Codes Rush"
          description="Bienvenue dans le jeu QR Codes Rush ! Votre mission est de trouver et scanner le maximum de QR codes cachés dans le bâtiment de l'IUT. Il y a un total de 15 QR codes à découvrir. Les joueurs qui scannent le plus grand nombre de QR codes seront classés parmi les premiers. Bonne chance !"
          rules={[
            "Vous avez 10 minutes pour scanner le maximum de QR codes.",
            "Vous êtes autorisés à chercher dans tous les espaces accessibles du bâtiment de l'IUT, y compris les couloirse et les salles de cours.",
            "À la fin du jeu, les joueurs seront classés en fonction du nombre de QR codes scannés et de leur rapidité. Ceux qui scannent le plus grand nombre de codes obtiendront un meilleur classement.",
          ]}
          onStartGame={handleStartGameFromInstructions}
        />
      )}
    </>
  );
};

export default Game1;
