import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import "./Header.css";

const Header = ({
  user,
  categories,
  setUser,
  unreadMessages,
  fetchUnreadMessages,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mesajlar için state
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      fetchMessages();
      fetchUnreadMessages();
    }
    // eslint-disable-next-line
  }, [user]);

  // Bildirimler
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    }
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/notifications/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(res.data);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/api/v1/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {}
  };

  // Mesajlar
  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8080/api/v1/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      setMessages([]);
    }
  };

  // Tüm mesajları okundu yap
  const handleMarkAllMessagesRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/api/v1/messages/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchUnreadMessages();
    } catch (err) {
      console.error("Mesajlar okundu olarak işaretlenemedi:", err);
    }
  };

  // Tüm mesajları okunmadı yap
  const handleUnmarkAllMessagesRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/api/v1/messages/unmark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchUnreadMessages();
    } catch (err) {
      console.error("Mesajlar okunmadı olarak işaretlenemedi:", err);
    }
  };

  // Tek mesajı okundu yap
  const handleMarkMessageRead = async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `http://localhost:8080/api/v1/messages/${messageId}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchUnreadMessages();
    } catch (err) {
      console.error("Mesaj okundu olarak işaretlenemedi:", err);
    }
  };

  // Tek mesajı okunmadı yap
  const handleUnmarkMessageRead = async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `http://localhost:8080/api/v1/messages/${messageId}/unmark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMessages();
      fetchUnreadMessages();
    } catch (err) {
      console.error("Mesaj okunmadı olarak işaretlenemedi:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    const publicRoutes = ["/", "/products", "/about", "/login", "/register"];
    if (publicRoutes.includes(path)) {
      navigate(path);
      setShowUserMenu(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(path);
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="src/assets/img/senior_logo.jpg" alt="site_logo" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Ana Sayfa</Link>
        <Link
          to="/products"
          onClick={(e) => {
            e.preventDefault();
            handleNavigation("/products");
          }}
        >
          Ürünler
        </Link>
        <Link to="/about">Hakkımızda</Link>
      </nav>

      <div className="header-right">
        {/* Bildirimler */}
        {user && (
          <div className="notification-section">
            <button
              className="notification-icon"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) handleMarkAllRead();
              }}
            >
              <span className="bell-icon" role="img" aria-label="Bildirim">
                🔔
              </span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <h4>Bildirimler</h4>
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    Hiç bildiriminiz yok.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item${n.read ? "" : " unread"}`}
                      style={{ cursor: n.link ? "pointer" : "default" }}
                      onClick={() => {
                        if (n.link) {
                          setShowNotifications(false);
                          navigate(n.link);
                        }
                      }}
                    >
                      {n.message}
                      <span className="notification-date">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Mesajlar */}
        {user && (
          <div className="message-section">
            <button
              className="message-icon"
              onClick={() => {
                setShowMessages(!showMessages);
                if (unreadMessages > 0) handleMarkAllMessagesRead();
              }}
            >
              <FaEnvelope />
              {unreadMessages > 0 && (
                <span className="message-badge">{unreadMessages}</span>
              )}
            </button>
            {showMessages && (
              <div className="message-dropdown">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4>Mesajlar</h4>
                </div>
                {messages.length === 0 ? (
                  <div className="message-empty">Hiç mesajınız yok.</div>
                ) : (
                  messages.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className={`message-item${m.isRead ? "" : " unread"}`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="message-sender"
                        onClick={() =>
                          navigate(
                            `/profile/${
                              m.sender.id === user.id
                                ? m.receiver.id
                                : m.sender.id
                            }`
                          )
                        }
                        style={{ cursor: "pointer" }}
                        title="Profili Görüntüle"
                      >
                        <b>{m.sender.firstName || "Kullanıcı"}</b>
                      </div>
                      <div
                        className="message-preview"
                        onClick={() => {
                          setShowMessages(false);
                          // Karşı tarafın id'sini bul
                          const otherUserId =
                            m.sender.id === user.id
                              ? m.receiver.id
                              : m.sender.id;
                          navigate(`/messages/${otherUserId}`);
                        }}
                        style={{ cursor: "pointer" }}
                        title="Mesajlaşmaya Git"
                      >
                        {m.content.substring(0, 30)}...
                      </div>
                      <div className="message-date">
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
                <div
                  className="message-all-link"
                  onClick={() => {
                    setShowMessages(false);
                    navigate("/messages");
                  }}
                >
                  Tüm Mesajlar
                </div>
              </div>
            )}
          </div>
        )}
        {/* Kullanıcı menüsü */}
        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <button
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img
                  src={
                    user.profilePicture
                      ? `http://localhost:8080/profiles/${user.profilePicture}`
                      : "/default-avatar.png"
                  }
                  alt="Profil"
                  className="user-avatar"
                />
                <span>{user.firstName}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(`/profile/${user.id}`);
                    }}
                  >
                    Profilim
                  </Link>
                  {user.userType === "SELLER" && (
                    <Link
                      to="/seller-dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/seller-dashboard");
                      }}
                    >
                      Kullanici Paneli
                    </Link>
                  )}
                  {user.userType === "ADMIN" && (
                    <Link
                      to="/admin"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/admin");
                      }}
                    >
                      Admin Paneli
                    </Link>
                  )}
                  <button onClick={handleLogout}>Çıkış Yap</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Giriş Yap
              </Link>
              <Link to="/register" className="register-button">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
