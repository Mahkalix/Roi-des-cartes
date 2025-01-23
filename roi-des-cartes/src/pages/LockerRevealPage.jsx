import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
const ShakeToReveal = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [codeVisible, setCodeVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  const handleMotion = (event) => {
    const { x, y, z } = event.acceleration || {};

    const shakeThreshold = 15;
    if (x > shakeThreshold || y > shakeThreshold || z > shakeThreshold) {
      setShakeCount((prevCount) => prevCount + 1);
    }
  };

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      DeviceMotionEvent.requestPermission
    ) {
      DeviceMotionEvent.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  useEffect(() => {
    const requiredActions = 3;
    if (shakeCount >= requiredActions || clickCount >= requiredActions) {
      setCodeVisible(true);
      window.removeEventListener("devicemotion", handleMotion);
    }
  }, [shakeCount, clickCount]);

  const handleNextGame = () => {
    navigate("/success", { state: { from: "locker-reveal" } });
  };

  return (
    <div className="shake-to-reveal" onClick={handleClick}>
      {codeVisible && <Confetti />} {/* Affiche les confettis */}
      <h1>Bravo, tu as réussi !</h1>
      <p>
        {isMobile
          ? "Secoue le téléphone ou clique 3 fois sur l'écran pour révéler le code du casier"
          : "Clique 3 fois sur l'écran pour révéler le code"}
      </p>
      {!codeVisible && (
        <p>Nombre d&apos;actions : {Math.max(shakeCount, clickCount)} / 3</p>
      )}
      {codeVisible && (
        <>
          <p>Le code est : 1234</p>
          <button onClick={handleNextGame}>Passer au jeu suivant</button>
        </>
      )}
    </div>
  );
};

export default ShakeToReveal;
