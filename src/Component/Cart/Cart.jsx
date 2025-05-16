import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (err) {
      setError("Sepet bilgileri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/v1/cart/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCartItems(); // Sepeti yeniden yükle
    } catch (err) {
      alert("Ürün sepetten çıkarılamadı.");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/cart/update/${productId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCartItems(); // Sepeti yeniden yükle
    } catch (err) {
      alert("Miktar güncellenemedi.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="cart-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="cart-error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="cart-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Geri Dön
        </button>
        <h1>Sepetim</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Sepetiniz Boş</h2>
          <p>Sepetinizde henüz ürün bulunmuyor.</p>
          <button
            onClick={() => navigate("/products")}
            className="cart-shop-button"
          >
            Alışverişe Başla
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={
                      item.product.images && item.product.images.length > 0
                        ? `http://localhost:8080/uploads/products/${
                            item.product.id
                          }/${item.product.images[0].split("/").pop()}`
                        : "/default-product.png"
                    }
                    alt={item.product.title}
                  />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product.title}</h3>
                  <p className="cart-item-price">{item.price} TL</p>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Toplam:</span>
              <span>{calculateTotal()} TL</span>
            </div>
            <button className="cart-checkout-button">Siparişi Tamamla</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
