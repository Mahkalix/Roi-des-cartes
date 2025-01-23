import QrReader from "react-qr-barcode-scanner";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user", // Камера фронтальна, змініть на "environment" для тильної
};

const WebcamCapture = ({ onCapture }) => {
  return (
    <div>
      <Webcam
        audio={false}
        height={720}
        screenshotFormat="image/webp"
        width={1280}
        videoConstraints={videoConstraints}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot();
              if (imageSrc) {
                onCapture(imageSrc);
              }
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
    </div>
  );
};

WebcamCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

const QRScanner = ({ onScan }) => {
  const handleScan = (result) => {
    if (result?.text) {
      const code = result.text.trim(); // Нормалізація тексту
      onScan(code); // Передача знайденого коду
    }
  };

  const handleError = (err) => {
    console.error("Scanner error:", err || "No valid QR code.");
  };

  return (
    <div style={{ width: "100%" }}>
      <QrReader
        onUpdate={(err, result) => {
          if (err) {
            handleError(err);
          } else if (result) {
            handleScan(result);
          }
        }}
        facingMode="environment" // Камера тильна
      />
    </div>
  );
};

QRScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
};

const App = () => {
  const [qrCode, setQrCode] = useState("");
  const [image, setImage] = useState("");

  const handleQrScan = (code) => {
    setQrCode(code);
  };

  const handleImageCapture = (capturedImage) => {
    setImage(capturedImage);
  };

  return (
    <div>
      <h1>QR Scanner and Photo Capture</h1>
      <QRScanner onScan={handleQrScan} />
      <p>Scanned QR Code: {qrCode || "None"}</p>
      <WebcamCapture onCapture={handleImageCapture} />
      {image && (
        <div>
          <h3>Captured Image:</h3>
          <img
            src={image}
            alt="Captured from webcam"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
