import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./TestPage.css";

const TestPage = () => {
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const [nameRes, descRes, questionsRes] = await Promise.all([
          fetch("http://localhost:3001/testName"),
          fetch("http://localhost:3001/description"),
          fetch("http://localhost:3001/questions"),
        ]);

        const nameData = await nameRes.json();
        const descData = await descRes.json();
        const questionsData = await questionsRes.json();

        setTestName(nameData.title);
        setDescription(descData.text);
        setQuestions(questionsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Test verisi yüklenirken hata:", error);
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, []);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    try {
      const scoringRes = await fetch("http://localhost:3001/scoring");
      const scoringData = await scoringRes.json();
      // Burada scoring mantığını implement edebilirsiniz
      setResult("Yenilikçi Girişimci"); // Örnek sonuç
      setShowResult(true);
    } catch (error) {
      console.error("Sonuç hesaplanırken hata:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="test-container">
        <div className="loading-animation">
          <div className="rocket">🚀</div>
          <p>Test yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="test-card"
          >
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(currentQuestion / questions.length) * 100}%`,
                }}
              />
            </div>
            <h2>{testName}</h2>
            <p className="question-number">
              Soru {currentQuestion + 1}/{questions.length}
            </p>
            <h3 className="question-text">
              {questions[currentQuestion]?.question}
            </h3>
            <div className="options-container">
              {questions[currentQuestion]?.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="option-button"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="result-card"
          >
            <h2>Test Sonucunuz</h2>
            <div className="result-content">
              <div className="result-icon">🎯</div>
              <h3>{result}</h3>
              <p>Tebrikler! İşte girişimcilik karakteriniz.</p>
            </div>
            <button
              className="restart-button"
              onClick={() => window.location.reload()}
            >
              Testi Tekrar Çöz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestPage;
