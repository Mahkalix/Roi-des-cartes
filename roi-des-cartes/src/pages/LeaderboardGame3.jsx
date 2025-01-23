import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importer useNavigate et useLocation

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Déclarer la constante navigate pour la redirection
  const location = useLocation(); // Déclarer la constante location pour obtenir l'emplacement actuel

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://g1s5d.22.gremmi.fr/api/scores");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        console.log(data); // Ajoutez cette ligne pour voir la réponse du backend
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
      navigate("/game4");
    }
  };

  return (
    <div className="leaderboard">
      <h2>Classement du jeu 3</h2>
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
        </table>{" "}
      </div>{" "}
      <button onClick={goToNextPage}>
        {" "}
        {location.state && location.state.from
          ? `Commencer le ${location.state.from.replace("game", "jeu ")}`
          : "Commencer le jeu 4"}{" "}
      </button>{" "}
    </div>
  );
};

export default Leaderboard;
