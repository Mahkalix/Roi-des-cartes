import { useState } from "react";
import Modal from "../components/puzzle3modal";

const Puzzle3 = ({ onSolve }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(5).fill(""));
  const [finalWord, setFinalWord] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Message d'erreur pour la modale
  const [hasChecked, setHasChecked] = useState(false); // Nouveau state pour vérifier si les réponses ont été vérifiées

  const questions = [
    {
      question:
        "1. Quel terme désigne la méthode scientifique utilisée pour représenter la surface de la Terre ou d'autres corps célestes ?",
      options: ["cartographie", "chimie", "cryptologie"],
      correct: "cartographie",
      letter: "C",
    },
    {
      question: "2. Quel est le nom du pays qui a pour capitale Ottawa ?",
      options: ["Canada", "Finlande", "Australie"],
      correct: "Canada",
      letter: "A",
    },
    {
      question:
        "3. Parmi ces planètes du système solaire, laquelle est connue sous le nom de 'planète rouge' en raison de sa couleur caractéristique due à l'oxyde de fer ?",
      options: ["jupiter", "vénus", "mars"],
      correct: "mars",
      letter: "R",
    },
    {
      question:
        "4. Quel est le nom de l'instrument à vent en bois, caractérisé par un double embout et souvent utilisé dans les orchestres classiques et les ensembles de musique de chambre ?",
      options: ["trompette", "flûte", "hautbois"],
      correct: "hautbois",
      letter: "T",
    },
    {
      question:
        "5. Quel fruit, souvent associé à la tradition de la cueillette automnale, est cultivé dans des vergers et existe en nombreuses variétés, allant du vert au rouge, et est riche en fibres et en vitamine C ?",
      options: ["pomme", "poire", "cerise"],
      correct: "pomme",
      letter: "E",
    },
  ];

  const handleSelectAnswer = (index, option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const checkAnswers = () => {
    const isCorrect = questions.every(
      (q, i) => selectedAnswers[i] === q.correct
    );
    setHasChecked(true); // Marquer que les réponses ont été vérifiées
    if (isCorrect) {
      setShowModal(true);
      setMessage("Bravo !");
      document.querySelector(".message").style.color = "green";
    } else {
      setMessage("Certaines réponses sont incorrectes. Réessayez.");
      document.querySelector(".message").style.color = "red";
    }
  };

  // Vérification du mot final
  const checkFinalWord = async () => {
    if (finalWord.toLowerCase() === "carte") {
      // Appeler onSolve une fois que le mot final est correct
      if (typeof onSolve === "function") {
        onSolve(); // Indique à GamePage que l'énigme est résolue
      }
      setModalMessage(""); // Effacer tout message d'erreur
      setShowModal(false); // Fermer la modale
    } else {
      setModalMessage("Le mot final est incorrect. Réessayez.");
    }
  };

  return (
    <div
      className="puzzle-container"
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <h1>Quiz de Culture Générale</h1>
      <div className="questions-container">
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <p style={{ fontSize: "0.9rem" }}>
              <span style={{ color: "red" }}>{q.question.split(".")[0]}.</span>{" "}
              {q.question.split(".")[1]}
            </p>
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`option-button ${
                  selectedAnswers[index] === option ? "selected" : ""
                }`}
                onClick={() => handleSelectAnswer(index, option)}
                style={{ fontSize: "0.8rem", padding: "5px 10px" }}
              >
                {option} {selectedAnswers[index] === option && "✔"}
              </button>
            ))}
          </div>
        ))}
        {message && <p className="message">{message}</p>}

        <button className="check-button" onClick={checkAnswers}>
          Vérifier les réponses
        </button>
      </div>

      {showModal && (
        <Modal
          finalWord={finalWord}
          setFinalWord={setFinalWord}
          checkFinalWord={checkFinalWord}
          closeModal={() => {
            setShowModal(false);
            setModalMessage("");
          }}
          modalMessage={modalMessage}
        />
      )}
    </div>
  );
};

export default Puzzle3;
