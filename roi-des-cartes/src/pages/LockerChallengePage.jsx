import { useState } from "react";
import InputField from "../components/InputField.jsx";
import NextButton from "../components/NextButton.jsx";
import { useNavigate } from "react-router-dom";

const LockerChallenge = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentStep = 3;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/verify-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: inputValue,
            currentStep,
          }),
        }
      );

      const data = await response.json();
      if (data.correct) {
        navigate("/locker-reveal");
      } else {
        setError("Code incorrect, essayez encore !");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code :", error);
      setError("Une erreur s'est produite. Réessayez plus tard.");
    }
  };

  return (
    <div className="locker-challenge-container">
      {/* Texte avec symbole d'attention */}
      <div className="attention-section">
        <span className="attention-symbol">⚠️</span>
        <p>
          Voici une série de chiffres avec un <b>motif caché</b>. Trouvez le
          chiffre qui suit et débloquez le code du casier.
        </p>
        <p>
          Cette partie de l’énigme se joue en <b>solitaire</b>. Seuls les
          premiers à trouver la solution passeront à l’étape suivante.
        </p>
      </div>

      <div className="sequence-display">
        <h2>Séquence :</h2>
        <p>2, 4, 8, 14, 22, ?</p>
      </div>

      {/* Champ et bouton de validation */}
      <div className="input-section">
        <InputField
          value={inputValue}
          placeholder="Entrez votre réponse"
          onChange={handleInputChange}
        />
        <NextButton onClick={handleSubmit} />
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LockerChallenge;
