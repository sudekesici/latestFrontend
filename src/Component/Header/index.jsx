import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = ({ user, categories, setUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Bildirimleri çek
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
    // eslint-disable-next-line
  }, [user]);

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
      console.log(res.data);
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
      console.log(res.data);
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
        {/* Kategoriler dropdown'ı istersen buraya ekleyebilirsin */}
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
