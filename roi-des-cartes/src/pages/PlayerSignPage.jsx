import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const symbols = ["♣️", "♥️", "♠️", "♦️"];

const PlayerSignPage = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const navigate = useNavigate();

  const fetchPlayersAndAssignSymbols = async () => {
    try {
      const response = await fetch("/api/users?status=in-game");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des joueurs");
      }
      const playerList = await response.json();
      console.log("Joueurs récupérés :", playerList); // Vérifiez les joueurs récupérés

      const existingSignsResponse = await fetch("/api/player-signs");
      if (!existingSignsResponse.ok) {
        throw new Error("Erreur lors de la récupération des signes existants");
      }
      const existingSigns = await existingSignsResponse.json();
      console.log("Signes existants :", existingSigns); // Vérifiez les signes existants

      assignSymbols(playerList, existingSigns);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const assignSymbols = async (playerList, existingSigns) => {
    const currentPlayerId = localStorage.getItem("userId"); // ID du joueur actuel

    // Filtrer les joueurs éliminés
    const activePlayers = playerList.filter((player) => player.status !== "eliminated");

    // Filtrer les joueurs sans signe
    const playersWithoutSign = activePlayers.filter(
        (player) => !existingSigns.some((sign) => sign.userId === player.id)
    );

    // Mélanger les signes pour une attribution aléatoire
    const shuffledSymbols = [...symbols].sort(() => Math.random() - 0.5);

    // Attribuer un signe aux joueurs sans signe
    const assignments = playersWithoutSign.map((player, index) => ({
      userId: player.id,
      sign: shuffledSymbols[index % symbols.length],
    }));

    if (assignments.length > 0) {
      // Sauvegarder les nouveaux signes dans la base de données
      try {
        await Promise.all(
            assignments.map((assignment) =>
                fetch("/api/player-sign", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(assignment),
                })
            )
        );
        console.log("Nouveaux signes enregistrés :", assignments); // Vérifiez les signes enregistrés
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des signes :", error);
      }
    }

    // Ajouter les signes existants et nouvellement attribués aux joueurs
    const playersWithSigns = activePlayers.map((player) => ({
      ...player,
      symbol: existingSigns.find((sign) => sign.userId === player.id)?.sign || assignments.find((assignment) => assignment.userId === player.id)?.sign || null,
    }));

    setPlayers(playersWithSigns);

    // Identifier le joueur actuel
    const currentPlayer = playersWithSigns.find(
        (player) => player.id === parseInt(currentPlayerId, 10)
    );

    if (!currentPlayer) {
      console.error("Joueur actuel non trouvé.");
      return;
    }

    setCurrentPlayer(currentPlayer);
  };

  useEffect(() => {
    fetchPlayersAndAssignSymbols();
  }, []); // Appel initial

  useEffect(() => {
    const handlePageFocus = () => {
      fetchPlayersAndAssignSymbols(); // Met à jour la liste des joueurs à chaque retour sur la page
    };

    window.addEventListener("focus", handlePageFocus); // Écouteur d'événement pour actualiser les données
    return () => window.removeEventListener("focus", handlePageFocus);
  }, []);

  const startGame = () => {
    navigate("/declare-sign", { state: { players, currentPlayer } });
  };

  return (
      <div>
        <h1 className="title-game5">Attribution des signes</h1>

        <ul className="players">
          {players.map((player) => (
              <li key={player.id}>
                {player.name} :{" "}
                {player.id === currentPlayer?.id ? "???" : player.symbol}
              </li>
          ))}
        </ul>
        <button onClick={startGame}>Passer à la déclaration</button>
      </div>
  );
};

export default PlayerSignPage;
