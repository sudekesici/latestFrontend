import React from "react";
import { useNavigate } from "react-router-dom";
import "./Challenge.css";

const Challenge = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    console.log("Teste yönlendiriliyor..."); // Debug için
    navigate("/test");
  };

  return (
    <div className="challenge-container">
      <div className="challenge-content">
        <h1>Girişimcilik Testi</h1>
        <p>
          Kendi girişimcilik karakterini keşfet! Bu test ile hangi tür girişimci
          olduğunu öğrenebilirsin.
        </p>
        <button onClick={handleStartTest} className="start-test-button">
          Teste Başla
        </button>
      </div>
    </div>
  );
};

export default Challenge;
