import PropTypes from "prop-types";
import "../styles/components/_puzzle3Modal.scss";

const Puzzle3Modale = ({
  finalWord,
  setFinalWord,
  checkFinalWord,
  closeModal,
  modalMessage,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Formez le mot final</h3>

        <p className="text">
          Utilisez les lettres obtenues dans chaque réponse correcte.
        </p>
        {modalMessage && <p className="error">{modalMessage}</p>}
        <input
          type="text"
          placeholder="Votre mot final"
          value={finalWord}
          onChange={(e) => setFinalWord(e.target.value)}
          className="answer-input"
        />

        <div className="modal-buttons">
          <button className="close-button" onClick={closeModal}>
            Fermer
          </button>
          <button className="check2-button" onClick={checkFinalWord}>
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
};

Puzzle3Modale.propTypes = {
  finalWord: PropTypes.string.isRequired,
  setFinalWord: PropTypes.func.isRequired,
  checkFinalWord: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalMessage: PropTypes.string,
};

export default Puzzle3Modale;
