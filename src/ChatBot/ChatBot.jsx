import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Merhaba! Ben e-ticaret asistanınızım. Size nasıl yardımcı olabilirim?",
      sender: "bot",
      timestamp: new Date(),
      messageType: "text",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [userJson, setUserJson] = useState(localStorage.getItem("user"));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Input'a otomatik focus
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newUserJson = localStorage.getItem("user");
      if (newUserJson !== userJson) {
        setUserJson(newUserJson);
        setMessages([
          {
            text: "Merhaba! Ben e-ticaret asistanınızım. Size nasıl yardımcı olabilirim?",
            sender: "bot",
            timestamp: new Date(),
            messageType: "text",
          },
        ]);
        setShowFeedback(false);
        setCurrentFeedback(null);
        console.log("Chatbot: Kullanıcı değişti, geçmiş sıfırlandı.");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userJson]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    console.log("Chatbot: Gönderilen kullanıcı mesajı:", inputMessage);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Lütfen giriş yapın.",
          sender: "bot",
          timestamp: new Date(),
          messageType: "text",
        },
      ]);
      return;
    }

    // Kullanıcı mesajını ekle
    const userMessage = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      messageType: "text",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("Chatbot: API'ye istek atılıyor...");
      const response = await axios.post(
        "http://localhost:8080/api/v1/chatbot/message",
        userMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Chatbot: API'den gelen yanıt:", response.data);
        setMessages((prev) => [...prev, response.data]);
        setShowFeedback(true);
        setCurrentFeedback({
          userMessage: userMessage.text,
          botResponse: response.data.text,
        });
      }
    } catch (error) {
      console.error("Chatbot: Hata oluştu:", error);
      let errorMessage =
        "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";

      if (error.response?.status === 403) {
        errorMessage = "Lütfen giriş yapın.";
      } else if (error.response?.status === 401) {
        errorMessage = "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
          messageType: "text",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (isHelpful) => {
    if (!currentFeedback) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log("Chatbot: Feedback gönderiliyor:", {
        ...currentFeedback,
        isHelpful,
      });
      await axios.post(
        "http://localhost:8080/api/v1/chatbot/feedback",
        {
          ...currentFeedback,
          isHelpful,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowFeedback(false);
      setCurrentFeedback(null);
    } catch (error) {
      console.error("Chatbot: Feedback gönderim hatası:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => {
            setIsOpen(true);
            console.log("Chatbot: Açıldı");
          }}
        >
          <FaRobot />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot />
              <span>E-Ticaret Asistanı</span>
            </div>
            <button
              className="chatbot-close"
              onClick={() => {
                setIsOpen(false);
                console.log("Chatbot: Kapatıldı");
              }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message typing">
                <FaSpinner className="spinner" />
                <span>Yazıyor...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showFeedback && (
            <div className="feedback-container">
              <span>Bu yanıt yardımcı oldu mu?</span>
              <button onClick={() => handleFeedback(true)}>
                <FaThumbsUp />
              </button>
              <button onClick={() => handleFeedback(false)}>
                <FaThumbsDown />
              </button>
            </div>
          )}

          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || inputMessage.trim() === ""}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
