import { useState } from "react";

const FinalPhase = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const correctAnswer = "GOGUEY"; // Réponse attendue pour l'énigme

  const checkAnswer = () => {
    if (input.toUpperCase() === correctAnswer) {
      setSuccess(true); // Affiche uniquement le message de succès
    } else {
      setError("Réponse incorrecte. Réessayez.");
    }
  };

  return (
    <div>
      {!success ? (
        <div className="final-phase-container">
          <h2>Dernière Phase : Énigme Collective</h2>
          <p>
            Les équipes gagnantes fusionnent pour former une grande équipe.
            Ensemble, vous devez résoudre l&apos;énigme suivante pour obtenir la
            carte 6 de Trèfles :
          </p>
          <blockquote>
            « Je suis un homme de petite taille, Avec des lunettes, je fais mon
            chemin, Toujours un ordinateur dans mes bras, Ma barbe est
            soigneusement taillée, Mes cheveux noirs sont bien coiffés, Dans le
            domaine du back-end, je suis un roi. Qui suis-je ? »
          </blockquote>
          <input
            type="text"
            placeholder="Entrez le nom de la personne"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bouton" onClick={checkAnswer}>
            Valider
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="success-message success">
          <p>
            Bravo ! Vous avez résolu l&apos;énigme et obtenu la carte 6 de
            Trèfles.
          </p>
          <p>Vous pouvez avancer au jeu suivant !</p>
        </div>
      )}
    </div>
  );
};

export default FinalPhase;
