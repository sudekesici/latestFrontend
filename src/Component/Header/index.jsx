import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">Logo</Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Ana Sayfa
          </Link>
          <Link to="/about" className="nav-link">
            Hakkımızda
          </Link>
          <Link to="/login" className="nav-link">
            Giriş Yap
          </Link>
          <Link to="/register" className="nav-link">
            Kayıt Ol
          </Link>
          <Link to="/products" className="nav-link shop-button">
            Alışverişe Başla
            <span className="arrow">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
