import { useState } from "react";
import PropTypes from "prop-types";

const InstructionPage = ({
  title,
  content,
  description,
  rules,
  onStartGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false); // État pour indiquer si le texte est en cours de lecture

  // Divise les règles en groupes de 5
  const rulesPerPage = 5;
  const rulePages = [];
  for (let i = 0; i < rules.length; i += rulesPerPage) {
    rulePages.push(rules.slice(i, i + rulesPerPage));
  }

  const totalPages = rulePages.length + 1; // Page de description + pages de règles

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fonction pour lire le contenu de la page
  const handleReadContent = () => {
    const synth = window.speechSynthesis;

    // Arrêter la lecture en cours si elle existe
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    let textToRead;
    if (currentIndex === 0) {
      textToRead = description; // Description sur la première page
    } else {
      textToRead = rulePages[currentIndex - 1].join(". "); // Règles sur les autres pages
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "fr-FR"; // Langue française

    utterance.onstart = () => setIsSpeaking(true); // Activer l'état de lecture
    utterance.onend = () => setIsSpeaking(false); // Désactiver l'état après la lecture

    synth.speak(utterance);
  };

  return (
    <>
      <div className="instruction-container">
        <p>{title}</p>
        <h1>{content}</h1>

        <button
          className={`volume-button ${isSpeaking ? "speaking" : ""}`}
          onClick={handleReadContent}
          aria-label="Lire le contenu"
        >
          {isSpeaking ? "🛑 Arrêter" : "🔊 Lire"}
        </button>

        <div className="instruction-content">
          {/* Affichage dynamique en fonction de la page */}
          {currentIndex === 0 ? (
            <p>{description}</p>
          ) : (
            <ul>
              {rulePages[currentIndex - 1].map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Navigation */}
      <div className="navigation-buttons">
        {currentIndex > 0 && (
          <button onClick={handlePrev} className="nav-button">
            ◀ Précédent
          </button>
        )}
        {currentIndex < totalPages - 1 ? (
          <button onClick={handleNext} className="nav-button">
            Suivant ▶
          </button>
        ) : (
          <button onClick={onStartGame} className="nav-button">
            Commencer le jeu
          </button>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </>
  );
};
InstructionPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  rules: PropTypes.arrayOf(PropTypes.string).isRequired,
  onStartGame: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

export default InstructionPage;
