import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const audioRef = useRef(null);

  const slides = [
    {
      title: "Bienvenue !",
      name: (
        <>
          <div className="glitch" data-text="ROI DES CARTES">
            <span className="subtitle">ROI DES CARTES</span>
          </div>
        </>
      ),
      content: (
        <>
          <img
            src="/assets/king.webp"
            alt="Roi des Cartes"
            className="intro-image"
          />
          Préparez-vous pour une expérience unique.
        </>
      ),
    },
    {
      title: "Contexte du jeu",
      content:
        "Vous et votre équipe êtes soudainement téléportés dans une version parallèle de Grenoble, devenue déserte et chaotique. Pour survivre et retourner dans le monde réel, vous devez participer à un jeu de cartes mortel orchestré par une entité mystérieuse appelée le Roi des Cartes. Chaque carte représente une épreuve ou une énigme à résoudre, avec des niveaux de difficulté et de danger variés. Le seul moyen de survivre est de réussir toutes les épreuves et de récupérer toutes les cartes avant la fin du temps imparti.",
      name: null,
      cards: null,
    },
    {
      title: "Catégories",
      content: null,
      name: null,
      cards: [
        {
          title: "Logique et Stratégie",
          description:
            "Ce sont des énigmes mathématiques ou de logique pure, où il faut résoudre des puzzles complexes en un temps limité, avec un niveau de difficulté facile (niveau 2)",
          image: "/assets/pique.webp",
        },
        {
          title: "Survie",
          description:
            "Ce sont des énigmes ou défis où la rapidité d'exécution est cruciale. Chaque énigme oblige les joueurs à résoudre des puzzles sous pression, avec un niveau de difficulté moyen (niveau 4).",
          image: "/assets/carreaux.webp",
        },
        {
          title: "Jeux d'équipes",
          description:
            "Ces épreuves requièrent coordination et collaboration : chaque joueur résout une partie de l'énigme, la réussite dépend de l'équipe, avec un niveau de difficulté modéré (niveau 6).",
          image: "/assets/trefles.webp",
        },
        {
          title: "Psychologie",
          description:
            "Ces épreuves mêlent confiance et trahison, avec des décisions collectives ou des énigmes testant la cohésion du groupe, avec un niveau de difficulté élevé (niveau 8).",
          image: "/assets/coeur.webp",
        },
      ],
    },
  ];

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = () => {
    navigate("/login");
  };

  const handleNextSlide = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex + 1) % slides[2].cards.length
    );
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? slides[2].cards.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const playAudio = () => {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    };

    if (audioRef.current) {
      playAudio();
    }

    document.addEventListener("visibilitychange", playAudio);

    return () => {
      document.removeEventListener("visibilitychange", playAudio);
    };
  }, []);

  return (
    <div className="home-page">
      <div className="blood-animation"></div>
      <audio
        ref={audioRef}
        src="/assets/music/Intro.mp3"
        preload="auto"
        loop
        autoPlay
      ></audio>
      <div
        className={`slider-container ${currentSlide === 0 ? "clickable" : ""}`}
        onClick={currentSlide === 0 ? handleNextSlide : null}
      >
        <div className="slide">
          <h1>{slides[currentSlide].title}</h1>
          <p className={`content ${currentSlide === 2 ? "no-padding" : ""}`}>
            {slides[currentSlide].content}
          </p>
          <h3>{slides[currentSlide].name}</h3>
          {slides[currentSlide].cards && (
            <div className="cards-container">
              <div className="card-slider">
                <button className="btn-slider" onClick={handlePreviousCard}>
                  ‹
                </button>
                <div className="card">
                  <img
                    src={slides[2].cards[currentCardIndex].image}
                    alt={slides[2].cards[currentCardIndex].title}
                    className="card-image"
                  />
                  <h3>{slides[2].cards[currentCardIndex].title}</h3>
                  <p>{slides[2].cards[currentCardIndex].description}</p>
                </div>
                <button className="btn-slider" onClick={handleNextCard}>
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="navigation">
          {currentSlide > 0 && (
            <div className="navigation-buttons">
              <button onClick={handlePrevious}>&#8592;</button>
            </div>
          )}

          {currentSlide < 2 && currentSlide > 0 && (
            <div className="navigation-buttons">
              <button onClick={handleNextSlide}>&#8594;</button>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="navigation-buttons">
              <button onClick={handleStart}>&#8594;</button>
            </div>
          )}
        </div>

        {currentSlide === 0 && (
          <div className="blinking-text">Cliquez ici </div>
        )}
      </div>
      <button className="sound-button" onClick={toggleMusic}>
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </div>
  );
}

export default Home;
