import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
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
      const res = await axios.get("http://localhost:8080/api/v1/buyer/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError("Siparişler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="orders-loading">Yükleniyor...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-container">
      <h1>Siparişlerim</h1>
      {orders.length === 0 ? (
        <div className="orders-empty">
          <FaBoxOpen size={48} />
          <p>Henüz bir siparişiniz yok.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <span className="order-id">Sipariş No: {order.id}</span>
                <span
                  className={`order-status status-${order.status.toLowerCase()}`}
                >
                  {order.status === "PENDING" && <FaBoxOpen />}
                  {order.status === "CONFIRMED" && <FaCheckCircle />}
                  {order.status === "CANCELLED" && <FaTimesCircle />}
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <div>
                  <strong>Ürün:</strong> {order.product?.title}
                </div>
                <div>
                  <strong>Fiyat:</strong> {order.finalPrice} TL
                </div>
                <div>
                  <strong>Adet:</strong> 1
                </div>
                <div>
                  <strong>Teslimat Adresi:</strong> {order.shippingAddress}
                </div>
                <div>
                  <strong>Tarih:</strong> {order.createdAt?.slice(0, 10)}
                </div>
                <div>
                  <strong>Kargo Takip No:</strong>{" "}
                  {order.trackingNumber ? (
                    order.trackingNumber
                  ) : (
                    <span style={{ color: "#aaa" }}>Henüz yok</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
