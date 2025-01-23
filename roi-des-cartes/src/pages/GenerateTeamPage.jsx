import { useState } from "react";

function GenerateTeamsButton() {
  const [message, setMessage] = useState("");

  // Fonction pour appeler l'API de génération des équipes
  const generateTeams = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/generate-teams",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Les équipes ont été générées avec succès!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setMessage("Une erreur de connexion est survenue.");
    }
  };

  return (
    <div>
      <button onClick={generateTeams}>Générer les équipes</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default GenerateTeamsButton;
