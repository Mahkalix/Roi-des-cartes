const VictoryPage = () => {
  return (
    <div className="victory-container">
      <h1>Félicitations !</h1>
      <img src="/assets/joker.webp" alt="carte du joker" />
      <p>
        Vous avez résolu toutes les énigmes. <br />
        Vous avez survécu au
      </p>
      <div className="glitch" data-text="ROI DES CARTES">
        <span className="subtitle">ROI DES CARTES</span>
      </div>
    </div>
  );
};

export default VictoryPage;
