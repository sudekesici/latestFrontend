import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("API'den kategori verisi alınırken hata oluştu:", error);
      }
    };

    fetchCategories();
  }, []);

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
          {/* Kategoriler dropdown menüsü */}
          <div className="dropdown">
            <button className="dropbtn">Kategoriler</button>
            <div className="dropdown-content">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link key={category.id} to={`/categories/${category.id}`}>
                    {category.name}
                  </Link>
                ))
              ) : (
                <p>Yükleniyor...</p>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
