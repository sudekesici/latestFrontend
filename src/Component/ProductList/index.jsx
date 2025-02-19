import React, { useState, useEffect } from "react";
import ShopHeader from "../ShopHeader";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <ShopHeader />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <ShopHeader />
      <div className="products-container">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="product-price">${product.price}</p>
                <div className="product-rating">
                  <span className="stars">
                    {"★".repeat(Math.round(product.rating.rate))}
                  </span>
                  <span className="rating-count">({product.rating.count})</span>
                </div>
                <button className="add-to-cart">Sepete Ekle</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
