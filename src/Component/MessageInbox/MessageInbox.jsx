import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Messages/Messages.css";

const API_URL = "http://localhost:8080/api/v1";

const MessageInbox = ({ user, onUnreadChange }) => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const unreadCount = conversations.filter((msg) => !msg.isRead).length;
  useEffect(() => {
    fetchInbox();
    // eslint-disable-next-line
  }, []);

  const fetchInbox = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Her kullanıcıyla en son mesajı bul
      const grouped = {};
      res.data.forEach((msg) => {
        const otherUser = msg.sender.id === user.id ? msg.receiver : msg.sender;
        if (
          !grouped[otherUser.id] ||
          new Date(msg.createdAt) > new Date(grouped[otherUser.id].createdAt)
        ) {
          grouped[otherUser.id] = { ...msg, otherUser };
        }
      });
      setConversations(Object.values(grouped));
      setError(null);
    } catch (err) {
      setConversations([]);
      setError("Mesajlar yüklenirken bir hata oluştu");
    }
  };

  // Tüm mesajları okundu yap
  const handleMarkAllRead = async () => {
    console.log(unreadCount);
    console.log("Marking all messages as read");
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/messages/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInbox();
    } catch (err) {
      alert("Tüm mesajlar okundu olarak işaretlenemedi.");
    }
    if (onUnreadChange) onUnreadChange();
  };

  // Tüm mesajları okunmadı yap
  const handleUnmarkAllRead = async () => {
    console.log(unreadCount);
    console.log("Unmarking all messages as read");
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/messages/unmark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInbox();
    } catch (err) {
      alert("Tüm mesajlar okunmadı olarak işaretlenemedi.");
    }
    if (onUnreadChange) onUnreadChange();
  };

  // Tek mesajı okundu/okunmadı yap
  const handleToggleRead = async (msg) => {
    console.log(unreadCount);
    console.log("Toggling read status for message", msg.id);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      if (!msg.isRead) {
        await axios.post(
          `${API_URL}/messages/${msg.id}/mark-read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}/messages/${msg.id}/unmark-read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchInbox();
      if (onUnreadChange) onUnreadChange();
    } catch (err) {
      alert("Mesaj güncellenemedi.");
    }
  };

  if (error) {
    return <div className="messages-error">{error}</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-inbox-header">
        <h2>Mesaj Kutusu</h2>
        <div>
          <button className="mark-btn" onClick={handleMarkAllRead}>
            Tümünü Okundu Yap
          </button>
          <button className="mark-btn" onClick={handleUnmarkAllRead}>
            Tümünü Okunmadı Yap
          </button>
        </div>
      </div>
      <div className="messages-list">
        {conversations.length === 0 ? (
          <div className="messages-empty">Hiç mesajınız yok.</div>
        ) : (
          conversations.map(
            (msg) => (
              console.log("msg", msg),
              (
                <div
                  key={msg.id}
                  className={`message-item${msg.isRead ? "" : " unread"}`}
                >
                  <div
                    className="message-sender"
                    onClick={() => navigate(`/profile/${msg.otherUser.id}`)}
                    style={{ cursor: "pointer" }}
                    title="Profili Görüntüle"
                  >
                    <img
                      src={
                        msg.otherUser.profilePicture
                          ? `http://localhost:8080/profiles/${msg.otherUser.profilePicture}`
                          : "/default-avatar.png"
                      }
                      alt="Profil"
                      className="user-avatar"
                    />
                    <b>
                      {msg.otherUser.firstName} {msg.otherUser.lastName}
                    </b>

                    {!msg.read && (
                      <span
                        className="unread-dot"
                        title="Okunmamış mesaj"
                      ></span>
                    )}
                  </div>
                  <div
                    className="message-preview"
                    onClick={() => navigate(`/messages/${msg.otherUser.id}`)}
                    style={{ cursor: "pointer" }}
                    title="Mesajlaşmaya Git"
                  >
                    {msg.content.substring(0, 30)}...
                  </div>
                  <div className="message-date">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <button
                      className="mark-btn"
                      onClick={() => handleToggleRead(msg)}
                    >
                      {msg.isRead ? "Okunmadı Yap" : "Okundu Yap"}
                    </button>
                  </div>
                </div>
              )
            )
          )
        )}
      </div>
    </div>
  );
};

export default MessageInbox;
