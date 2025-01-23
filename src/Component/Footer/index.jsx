import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>İletişim</h3>
          <p>Email: info@example.com</p>
          <p>Telefon: +90 123 456 7890</p>
          <p>Adres: İstanbul, Türkiye</p>
        </div>

        <div className="footer-section">
          <h3>Hızlı Linkler</h3>
          <ul>
            <li>
              <a href="/">Ana Sayfa</a>
            </li>
            <li>
              <a href="/hakkimizda">Hakkımızda</a>
            </li>
            <li>
              <a href="/hizmetler">Hizmetler</a>
            </li>
            <li>
              <a href="/iletisim">İletişim</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Sosyal Medya</h3>
          <ul className="social-links">
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
