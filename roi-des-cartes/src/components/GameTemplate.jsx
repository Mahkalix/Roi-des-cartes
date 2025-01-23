import PropTypes from "prop-types";

const GameTemplate = ({
  gameNumber,
  gameTitle,
  imageUrl,
  gameDescription,
  onStartGame,
}) => {
  return (
    <div className="game-container">
      <p>[Game {gameNumber}]</p>
      <h1>{gameTitle}</h1>
      <div className="image-container">
        <img src={imageUrl} alt={gameTitle} className="game-image" />
      </div>
      <p>{gameDescription}</p>
      <button className="start-button" onClick={onStartGame}>
        Commencer
      </button>
    </div>
  );
};
GameTemplate.propTypes = {
  gameNumber: PropTypes.number.isRequired,
  gameTitle: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  gameDescription: PropTypes.string.isRequired,
  onStartGame: PropTypes.func.isRequired,
};

export default GameTemplate;
