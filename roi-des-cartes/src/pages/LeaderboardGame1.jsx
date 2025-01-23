import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importer useNavigate

const LeaderboardGame1 = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Déclarer la constante navigate pour la redirection

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://g1s5d.22.gremmi.fr/api/scores");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        console.log("Données récupérées :", data); // Vérifie ici
        setLeaderboard(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du classement :", err);
        setError("Erreur de connexion");
      }
    };

    fetchLeaderboard();
  }, []);

  const goToGame2 = () => {
    navigate("/game2");
  };

  return (
    <div className="leaderboard">
      <h2>Classement du jeu 1</h2>
      {error && <p>{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Joueur</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => {
              console.log(`Rang ${index + 1}:`, player);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.username}</td>
                  <td>{player.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Bouton de redirection */}
      <button onClick={goToGame2}>Commencer le jeu 2</button>
    </div>
  );
};

export default LeaderboardGame1;
