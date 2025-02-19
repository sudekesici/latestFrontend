import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaShare } from "react-icons/fa";
import "./ShopHeader.css";

const ShopHeader = () => {
  return (
    <header className="shop-header">
      <div className="shop-header-content">
        <div className="shop-logo">
          <Link to="/">Logo</Link>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Ürün ara..."
            className="search-input"
          />
          <button className="search-button">Ara</button>
        </div>

        <div className="shop-actions">
          <button className="icon-button">
            <FaHeart />
            <span className="icon-label">Favoriler</span>
          </button>
          <button className="icon-button">
            <FaShoppingCart />
            <span className="icon-label">Sepet</span>
          </button>
          <button className="icon-button">
            <FaShare />
            <span className="icon-label">Paylaş</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
