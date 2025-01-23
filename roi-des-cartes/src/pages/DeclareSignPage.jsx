import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DeclareSignPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPlayer, players } = location.state || {};
  const [declaredSymbol, setDeclaredSymbol] = useState("");
  const [result, setResult] = useState("");
  const [assignedSign, setAssignedSign] = useState("");

  useEffect(() => {
    const fetchAssignedSign = async () => {
      if (!currentPlayer) {
        console.error("Joueur actuel non trouvé. Retour à la liste.");
        navigate("/player-sign");
        return;
      }

      try {
        const response = await fetch(`/api/player-sign/${currentPlayer.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setResult("Aucun signe attribué pour ce joueur.");
          }
          throw new Error("Erreur lors de la récupération du signe attribué");
        }
        const data = await response.json();
        setAssignedSign(data.sign);
      } catch (error) {
        console.error("Erreur lors de la récupération du signe :", error);
      }
    };

    fetchAssignedSign();
  }, [currentPlayer, navigate]);

  const checkSymbol = async () => {
    if (!declaredSymbol) {
      setResult("Veuillez sélectionner un signe.");
      return;
    }

    if (declaredSymbol === assignedSign) {
      setResult("Bravo ! Vous avez trouvé votre signe.");
      setTimeout(() => navigate("/success", { state: { from: "declare-sign", currentPlayer, players } }), 2000); // Retour à la liste des joueurs
    } else {
      setResult("Dommage ! Vous êtes éliminé.");
      try {
        // Mettre à jour le statut du joueur
        await fetch(`/api/users/${currentPlayer.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "eliminated" }),
        });
        setTimeout(() => navigate("/game-over"), 2000); // Redirection vers "game-over"
      } catch (error) {
        console.error("Erreur lors de l'élimination du joueur :", error);
      }
    }
  };

  return (
    <div>
      <h1 className="title-game5">Déclarez votre signe</h1>
      <p>Choisissez le signe que vous pensez être le vôtre :</p>
      <div className="choice">
        <select onChange={(e) => setDeclaredSymbol(e.target.value)}>
          <option value="">Choisir un signe</option>
          {["♣️", "♥️", "♠️", "♦️"].map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
        <button onClick={checkSymbol}>Vérifier</button>
        {result && <p>{result}</p>}
      </div>
    </div>
  );
};

export default DeclareSignPage;
