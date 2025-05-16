import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SellerOrders.css";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await axios.get(
        "http://localhost:8080/api/v1/seller/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      setError("Satışlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="seller-orders-container">
        <div>Yükleniyor...</div>
      </div>
    );
  if (error)
    return (
      <div className="seller-orders-container">
        <div>{error}</div>
      </div>
    );

  return (
    <div className="seller-orders-container">
      <h1 className="seller-orders-title">Satışlarım</h1>
      {orders.length === 0 ? (
        <div className="seller-orders-empty">Henüz bir satışınız yok.</div>
      ) : (
        <div className="seller-orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="seller-order-item"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="seller-order-row">
                <span className="seller-order-label">Sipariş No:</span>
                <span className="seller-order-value">{order.id}</span>
              </div>
              <div className="seller-order-row">
                <span className="seller-order-label">Ürün:</span>
                <span className="seller-order-value">
                  {order.product?.title}
                </span>
              </div>
              <div className="seller-order-row">
                <span className="seller-order-label">Fiyat:</span>
                <span className="seller-order-value">
                  {order.finalPrice} TL
                </span>
              </div>
              <div className="seller-order-row">
                <span className="seller-order-label">Durum:</span>
                <span className={`seller-order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="seller-order-row">
                <span className="seller-order-label">Kargo Takip No:</span>
                <span className="seller-order-value">
                  {order.trackingNumber || "Henüz yok"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
