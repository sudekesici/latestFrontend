import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ user, categories, setUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    // Public routes that don't require authentication
    const publicRoutes = ["/", "/products", "/about", "/login", "/register"];

    if (publicRoutes.includes(path)) {
      navigate(path);
      setShowUserMenu(false);
      return;
    }

    // Protected routes that require authentication
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
          <img src="src\assets\img\senior_logo.jpg" alt="site_logo" />
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

        {/* <div className="category-container">
          <span className="category-trigger">Kategoriler</span>
          <div className="category-dropdown">
            {categories?.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="category-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(`/categories/${category.id}`);
                  }}
                >
                  {category.name}
                </Link>
              ))
            ) : (
              <span className="category-item">Yükleniyor...</span>
            )}
          </div>
        </div> */}
      </nav>

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
                  <>
                    <Link
                      to="/seller-dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation("/seller-dashboard");
                      }}
                    >
                      Kullanici Paneli
                    </Link>
                  </>
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
    </header>
  );
};

export default Header;
