import { useNavigate } from "react-router-dom";
import NextButton from "../components/NextButton.jsx";

const NextStepPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/puzzle-numbers");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Félicitations !</h1>
      <p>
        Bravo ! c’est le bon mot. Rendez-vous dans cet endroit pour trouver les
        pièces manquantes du puzzle au verso.
      </p>

      <NextButton onClick={handleNext} label="Suivant" />
    </div>
  );
};

export default NextStepPage;
