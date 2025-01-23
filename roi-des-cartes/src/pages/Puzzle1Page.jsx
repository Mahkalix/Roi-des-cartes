import { useState } from "react";
import PropTypes from "prop-types";

const Puzzle1 = ({ onSolve }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const checkAnswer = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/verify-answer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: input, currentStep: 4 }),
        }
      );
      const data = await response.json();

      if (data.correct) {
        setSuccess(true);
        setError("");
        console.log("Puzzle résolu, appel de onSolve.");
        if (onSolve) {
          onSolve(); // Appeler la fonction uniquement si elle est définie
        }
      } else {
        setSuccess(false);
        setError("Mauvaise réponse, essayez encore !");
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la réponse :", err);
      setError(
        "Impossible de vérifier la réponse. Vérifiez votre connexion ou contactez l'administrateur."
      );
    }
  };

  return (
    <div className="puzzle-container">
      <h1>Rébus Visuel</h1>
      <p>Indiquez le mot formé par les images suivantes :</p>
      <div className="rebus-images">
        <img src="/assets/serpent.webp" alt="serpent" />
        <span>+</span>
        <img src="/assets/t.webp" alt="Lettre t'" />
        <span>+</span>
        <img src="/assets/rat.avif" alt="rat" />
        <span>+</span>
        <img src="/assets/the.webp" alt="thé" />
        <span>+</span>
        <img src="/assets/J.webp" alt="Lettre J" />
      </div>

      <input
        type="text"
        placeholder="Votre réponse"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="bouton" onClick={checkAnswer}>
        Soumettre
      </button>
      {success && <p className="success">Bonne réponse !</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};


Puzzle1.propTypes = {
  onSolve: PropTypes.func,
};

export default Puzzle1;
