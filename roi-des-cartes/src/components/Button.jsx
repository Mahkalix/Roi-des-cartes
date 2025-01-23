import PropTypes from "prop-types";

const StartButton = ({ onClick }) => {
  return (
    <button className="start-button" onClick={onClick}>
      Commencer le jeu
    </button>
  );
};

StartButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default StartButton;
