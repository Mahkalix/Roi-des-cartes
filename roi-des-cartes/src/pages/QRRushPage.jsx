import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrReader from "react-qr-barcode-scanner";

const QRRush = () => {
  const [scanCount, setScanCount] = useState(0);
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(900); // 3 minutes 20 secondes pour les tests
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [gameEnded, setGameEnded] = useState(false);

  // Fonction pour envoyer les scans à la base de données
  const sendScansToDatabase = async (finalScanCount) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Utilisateur non authentifié !");
      return;
    }

    try {
      const response = await fetch(
        "https://g1s5d.22.gremmi.fr/api/update-scans",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            scanCount: finalScanCount,
          }),
        }
      );

      if (response.ok) {
        console.log(
          "Scans enregistrés dans la base de données :",
          finalScanCount
        );
        alert("Nombre de scans enregistré avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement des scans.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Gestion du scan des QR codes
  const handleScan = (result) => {
    if (!result?.text || gameEnded) return;
    const scannedString = result.text.trim();

    setScannedCodes((prevSet) => {
      if (!prevSet.has(scannedString)) {
        const updatedSet = new Set(prevSet);
        updatedSet.add(scannedString);

        // Mettre à jour le compteur
        const newCount = updatedSet.size;
        setScanCount(newCount);
        setErrorMessage(`Nouveau code scanné : ${scannedString}`);

        // Vérifier si le joueur a atteint l'objectif
        if (newCount >= 15) {
          setGameEnded(true);
          sendScansToDatabase(newCount);
          navigate("/success", { state: { from: "qr rush" } });
        }

        return updatedSet;
      } else {
        setErrorMessage(`Le code ${scannedString} a déjà été scanné.`);
      }
      return prevSet;
    });
  };

  // Gestion de la fin de la partie
  const handleEndGame = async () => {
    if (!gameEnded) {
      setGameEnded(true);
      await sendScansToDatabase(scanCount);
      navigate("/success", { state: { from: "qr-rush" } });
    }
  };

  // Décrémentation du temps
  useEffect(() => {
    if (timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !gameEnded) {
      handleEndGame();
    }
  }, [timeLeft, gameEnded]);

  return (
    <div
      className="qr-rush-container"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h2>QR Rush</h2>
      <p>Scannez le plus de QR codes !</p>
      <div>
        <strong className="timer">
          {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </strong>
      </div>
      <div className="qr-scanner" style={{ width: "400px" }}>
        <QrReader
          onUpdate={(error, result) => {
            if (error) {
              console.error("Erreur du scanner QR :", error);
            } else if (result) {
              handleScan(result);
            }
          }}
          facingMode="environment"
          style={{ width: "100%" }}
        />
      </div>
      <div
        className="scan-counter"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <p>
          QR Codes scannés uniques : <strong>{scanCount}</strong>
        </p>
        {errorMessage && (
          <div style={{ marginTop: "10px", color: "red" }}>{errorMessage}</div>
        )}
      </div>
      {scanCount >= 15 && (
        <div className="leaderboard-message">
          Félicitations ! Vous avez scanné 15 codes. Redirection vers le
          leaderboard...
        </div>
      )}

      <button onClick={handleEndGame} className="validate-button">
        Terminer
      </button>
    </div>
  );
};

export default QRRush;
