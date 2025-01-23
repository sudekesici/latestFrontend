import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Logo</Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Ana Sayfa</Link>
          </li>
          <li>
            <Link to="/about">Hakkımızda</Link>
          </li>
          <li>
            <Link to="/login">Giriş Yap</Link>
          </li>
          <li>
            <Link to="/register">Kayıt Ol</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
