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
  const windowRef = useRef(null);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        windowRef.current &&
        !windowRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchSuggestions = async (type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      let endpoint = "";
      if (type === "stories") {
        endpoint = "http://localhost:8080/api/v1/success-stories?page=0&size=3";
      } else if (type === "content") {
        endpoint =
          "http://localhost:8080/api/v1/educational-contents?page=0&size=3";
      }

      console.log(`Chatbot: Fetching ${type} from ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log(`Chatbot: ${type} response:`, response.data);
      return response.data.content || response.data;
    } catch (error) {
      console.error(`Chatbot: Error fetching ${type}:`, error);
      if (error.response) {
        console.error(`Chatbot: ${type} error status:`, error.response.status);
        console.error(`Chatbot: ${type} error data:`, error.response.data);
      }
      return null;
    }
  };

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

        // Ana yanıtı ekle
        setMessages((prev) => [...prev, response.data]);

        // Başarı hikayeleri ve eğitim içeriklerini kontrol et
        const lowerInput = inputMessage.toLowerCase();
        if (lowerInput.includes("başarı") || lowerInput.includes("hikaye")) {
          console.log("Chatbot: Başarı hikayeleri aranıyor...");
          const stories = await fetchSuggestions("stories");
          if (stories && stories.length > 0) {
            console.log("Chatbot: Başarı hikayeleri bulundu:", stories);
            setMessages((prev) => [
              ...prev,
              {
                text: "İşte size önerilen başarı hikayeleri:",
                sender: "bot",
                timestamp: new Date(),
                messageType: "suggestions",
                suggestions: {
                  type: "stories",
                  items: stories,
                },
              },
            ]);
          } else {
            console.log("Chatbot: Başarı hikayeleri bulunamadı");
          }
        } else if (
          lowerInput.includes("eğitim") ||
          lowerInput.includes("içerik") ||
          lowerInput.includes("kurs")
        ) {
          console.log("Chatbot: Eğitim içerikleri aranıyor...");
          const contents = await fetchSuggestions("content");
          if (contents && contents.length > 0) {
            console.log("Chatbot: Eğitim içerikleri bulundu:", contents);
            setMessages((prev) => [
              ...prev,
              {
                text: "İşte size önerilen eğitim içerikleri:",
                sender: "bot",
                timestamp: new Date(),
                messageType: "suggestions",
                suggestions: {
                  type: "content",
                  items: contents,
                },
              },
            ]);
          } else {
            console.log("Chatbot: Eğitim içerikleri bulunamadı");
            setMessages((prev) => [
              ...prev,
              {
                text: "Üzgünüm, şu anda eğitim içeriklerine ulaşılamıyor. Lütfen daha sonra tekrar deneyin.",
                sender: "bot",
                timestamp: new Date(),
                messageType: "text",
              },
            ]);
          }
        }

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

  const renderSuggestions = (suggestions) => {
    if (!suggestions) return null;

    const { type, items } = suggestions;
    return (
      <div className={`suggestions ${type}-suggestions`}>
        {items.map((item) => (
          <div key={item.id} className="suggestion-card">
            <img
              src={item.imageUrl || "https://via.placeholder.com/150"}
              alt={item.title}
            />
            <h4>{item.title}</h4>
            <p>
              {type === "stories"
                ? item.content?.substring(0, 100)
                : item.description?.substring(0, 100)}
              ...
            </p>
            <a
              href={`/${
                type === "stories" ? "success-stories" : "educational-content"
              }/${item.id}`}
              className="read-more"
            >
              {type === "stories" ? "Devamını Oku" : "Eğitime Git"}
            </a>
          </div>
        ))}
      </div>
    );
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
        <div className="chatbot-window" ref={windowRef}>
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
                {message.messageType === "suggestions" &&
                  renderSuggestions(message.suggestions)}
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
