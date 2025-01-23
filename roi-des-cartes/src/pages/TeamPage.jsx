import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const TeamsPage = ({ currentPlayerId }) => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("https://g1s5d.22.gremmi.fr/api/teams");
        const data = await response.json();
        console.log("Données récupérées depuis l'API :", data);
        setTeams(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
      }
    };

    fetchTeams();
  }, []);

  // Trouver l'équipe et rediriger vers l'énigme de l'utilisateur connecté
  const startGame = () => {
    console.log("ID du joueur actuel :", currentPlayerId);
    console.log("Équipes disponibles :", teams);

    const team = teams.find(
      (team) =>
        team.players.some(
          (player) => parseInt(player.id) === parseInt(currentPlayerId)
        ) // Comparer avec l'ID
    );

    if (team) {
      console.log("Équipe trouvée :", team);
      navigate(`/game/${team.team_id}/${currentPlayerId}`);
    } else {
      console.error(
        "Impossible de trouver l'équipe pour le joueur :",
        currentPlayerId
      );
      alert("Impossible de trouver votre équipe.");
    }
  };

  return (
    <div className="teams-container">
      <h1 className="page-title">Liste des Équipes</h1>
      <div className="team-cards-container">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team.team_id} className="team-card">
              <h2 className="team-name">{team.team_name}</h2>
              <ul className="players-list">
                {team.players.map((player) => (
                  <li key={player.id} className="player-item">
                    {player.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Chargement des équipes...</p>
        )}
      </div>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};
TeamsPage.propTypes = {
  currentPlayerId: PropTypes.number.isRequired,
};

export default TeamsPage;
