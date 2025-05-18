import React from "react";
import { useNavigate } from "react-router-dom";
import "./Challenge.css";

const Challenge = () => {
  const navigate = useNavigate();
  return (
    <div className="challenge-container">
      <div className="challenge-content">
        <h2>Girişimci Süper Gücünü Öğrenmeye Ne Dersin?</h2>
        <p>1 dakikalık özel teste katıl ve girişimci süper gücünü keşfet!</p>
        <button className="start-test-btn" onClick={() => navigate("/test")}>
          Teste Başla
        </button>
      </div>
    </div>
  );
};

export default Challenge;
