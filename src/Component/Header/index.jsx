import React from "react";
import "./Header.css";
function Header() {
  return (
    <div className="header">
      <div className="logo"></div>
      <ul className="nav-links">
        <li>
          <a href="">Biz Kimiz?</a>
        </li>
        <li>
          <a href="">Online Kurslar</a>
        </li>
        <li>
          <a href="">Bize Ulaşın</a>
        </li>
        <li>
          <a href="">Giriş Yap</a>
        </li>
        <li>
          <a href="">Kayıt Ol</a>
        </li>
      </ul>
    </div>
  );
}

export default Header;
