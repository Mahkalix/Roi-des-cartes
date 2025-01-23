import { useState } from "react";

const Puzzle2 = ({ onSolve }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedHint, setSelectedHint] = useState(null); // État pour afficher l'indice sélectionné
  const [selectedHintIndex, setSelectedHintIndex] = useState(null); // État pour afficher le numéro de l'indice sélectionné

  const anagram = "PEOTNIOMTIC"; // COMPÉTITION
  const currentStep = 5; // Étape correspondante dans la base

  const hints = [
    "C'est un mot associé à des événements avec des récompenses ou des classements.",
    "Ce mot commence par 'C' et se termine par 'N'.",
    "Il est souvent utilisé dans des activités où il y a des adversaires dans un but commun.",
  ];

  const checkAnswer = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/verify-answer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: input, currentStep }),
        }
      );

      const data = await response.json();
      if (data.correct) {
        setSuccess(true);
        setError("");
        if (typeof onSolve === "function") {
          onSolve(); // Notifie GamePage que l'énigme est résolue
        }
      } else {
        setSuccess(false);
        setError("Mauvaise réponse, essayez encore !");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la réponse :", error);
      setError("Erreur serveur.");
    }
  };

  return (
    <div className="puzzle-container">
      <h1>Anagramme</h1>
      <p>Résolvez cet anagramme :</p>
      <p>
        <strong>{anagram}</strong>
      </p>

      <div className="hint-buttons">
        {hints.map((hint, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedHint(hint); // Affiche l'indice sélectionné
              setSelectedHintIndex(index + 1); // Affiche le numéro de l'indice sélectionné
            }}
          >
            Indice {index + 1}
          </button>
        ))}
      </div>

      <div
        className={`hints-container ${
          selectedHintIndex === 1
            ? "left"
            : selectedHintIndex === 2
            ? "center"
            : "right"
        }`}
      >
        {/* Affichage de l'indice sélectionné */}
        {selectedHint && (
          <div className="hint-display">
            <p>
              <strong>Indice {selectedHintIndex} </strong>
            </p>
            <p>{selectedHint}</p>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Votre réponse"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={"bouton"} onClick={checkAnswer}>
        Soumettre
      </button>
      {success && <p className="success">Bonne réponse !</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Puzzle2;
