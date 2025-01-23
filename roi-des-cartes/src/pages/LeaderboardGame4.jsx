import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://g1s5d.22.gremmi.fr/api/scores");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        console.log(data);
        setLeaderboard(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du classement :", err);
        setError("Erreur de connexion");
      }
    };

    fetchLeaderboard();
  }, []);

  const goToNextPage = () => {
    const confirmation = window.confirm(
      "Veuillez vous rendre dans la salle 125 et confirmer que vous y êtes."
    );
    if (confirmation) {
      navigate("/victory");
    }
  };

  return (
    <div className="leaderboard">
      <h2>Classement Final</h2>
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
            {leaderboard.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={goToNextPage}>Terminer le jeu</button>
    </div>
  );
};

export default Leaderboard;
