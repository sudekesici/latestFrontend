import React, { useState } from "react";
import "../../pages/Challenge.css";

const questions = [
  {
    question: "Bir işte en çok neye önem verirsin?",
    options: ["Yaratıcılık", "Disiplin", "İletişim", "Analiz"],
  },
  {
    question: "Bir sorunla karşılaşınca ilk tepkin?",
    options: [
      "Farklı yollar denerim",
      "Plan yaparım",
      "Destek alırım",
      "Veri toplarım",
    ],
  },
  {
    question: "Bir ekipte hangi rol sana daha yakın?",
    options: [
      "Fikir üreten",
      "Organize eden",
      "İnsanları birleştiren",
      "Raporlayan",
    ],
  },
];

const superPowers = [
  "Yaratıcı Lider! Fikirlerinle ilham veriyorsun.",
  "Disiplinli Stratejist! Planlarınla başarıya ulaşıyorsun.",
  "İletişimci Ruh! Takımını bir arada tutuyorsun.",
  "Analitik Zihin! Verilerle yolunu buluyorsun.",
];

const Test = () => {
  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleOption = (optionIdx) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Demo: En çok seçilen index'e göre süper güç öner
      const counts = [0, 0, 0, 0];
      newAnswers.forEach((idx) => counts[idx]++);
      const maxIdx = counts.indexOf(Math.max(...counts));
      setResult(superPowers[maxIdx]);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setStep(0);
    setResult(null);
  };

  return (
    <div className="challenge-container">
      <div className="challenge-content">
        <h2>Girişimci Süper Güç Testi</h2>
        {result ? (
          <div>
            <h3 style={{ color: "#e9a480" }}>{result}</h3>
            <button className="start-test-btn" onClick={handleRestart}>
              Tekrar Dene
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: 24 }}>{questions[step].question}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {questions[step].options.map((opt, idx) => (
                <button
                  key={idx}
                  className="start-test-btn"
                  style={{
                    marginBottom: 0,
                    background: "#fff7f0",
                    color: "#a86c4b",
                    border: "1.5px solid #e9a480",
                  }}
                  onClick={() => handleOption(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
