import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WinnerValidation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const teamRank = location.state?.teamRank || 999; // Classement par défaut (non gagnant)

    useEffect(() => {
        if (teamRank <= 3) {
            // Redirige vers la phase finale après 3 secondes
            setTimeout(() => {
                navigate("/final-phase");
            }, 3000);
        }
    }, [teamRank, navigate]);

    return (
        <div className="winner-validation-container">
            {teamRank <= 3 ? (
                <>
                    <h2>Félicitations !</h2>
                    <p>
                        Votre équipe est parmi les trois premières à terminer les énigmes !
                        Préparez-vous à fusionner avec les autres gagnants pour résoudre
                        l'énigme collective.
                    </p>
                    <p>Redirection en cours...</p>
                </>
            ) : (
                <>
                    <h2>Merci d'avoir participé !</h2>
                    <p>
                        Malheureusement, votre équipe n'est pas parmi les trois premières.
                        Nous espérons vous revoir lors du prochain jeu !
                    </p>
                </>
            )}
        </div>
    );
};

export default WinnerValidation;
