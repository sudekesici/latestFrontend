import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");
    if (!token) {
      navigate("/login");
      return;
    }
    setUserType(type);
    fetchOrder();
  }, [id, navigate]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("userType");
      const endpoint =
        type === "SELLER"
          ? `http://localhost:8080/api/v1/seller/orders/${id}`
          : `http://localhost:8080/api/v1/buyer/orders/${id}`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      setError("Sipariş detayları alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/v1/seller/orders/${id}/status`,
        null,
        {
          params: { newStatus },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrder();
    } catch (err) {
      setError("Sipariş durumu güncellenemedi.");
    }
  };

  if (loading) return <div className="order-detail-loading">Yükleniyor...</div>;
  if (error) return <div className="order-detail-error">{error}</div>;
  if (!order)
    return <div className="order-detail-error">Sipariş bulunamadı.</div>;

  return (
    <div className="order-detail-container">
      <h1
        className="order-detail-title
      "
      >
        Sipariş Detayı
      </h1>
      <div className="order-detail-card">
        <div className="order-detail-header">
          <span className="order-detail-id">Sipariş No: {order.id}</span>
          <span
            className={`order-detail-status status-${order.status.toLowerCase()}`}
          >
            {order.status === "PENDING" && <FaBoxOpen />}
            {order.status === "CONFIRMED" && <FaCheckCircle />}
            {order.status === "SHIPPED" && <FaTruck />}
            {order.status === "CANCELLED" && <FaTimesCircle />}
            {order.status}
          </span>
        </div>

        <div className="order-detail-content">
          <div className="order-detail-section">
            <h3>Ürün Bilgileri</h3>
            <p>
              <strong>Ürün:</strong> {order.product?.title}
            </p>
            <p>
              <strong>Fiyat:</strong> {order.finalPrice} TL
            </p>
            <p>
              <strong>Adet:</strong> 1
            </p>
          </div>

          <div className="order-detail-section">
            <h3>Teslimat Bilgileri</h3>
            <p>
              <strong>Adres:</strong> {order.shippingAddress}
            </p>
            {order.trackingNumber && (
              <p>
                <strong>Kargo Takip No:</strong> {order.trackingNumber}
              </p>
            )}
            {order.shippingStatus && (
              <p>
                <strong>Kargo Durumu:</strong> {order.shippingStatus}
              </p>
            )}
          </div>

          <div className="order-detail-section">
            <h3>Sipariş Bilgileri</h3>
            <p>
              <strong>Oluşturulma Tarihi:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Son Güncelleme:</strong>{" "}
              {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>

          {userType === "SELLER" && order.status !== "CANCELLED" && (
            <div className="order-detail-actions">
              {order.status === "PENDING" && (
                <button
                  className="order-detail-confirm-btn"
                  onClick={() => handleUpdateStatus("CONFIRMED")}
                >
                  Siparişi Onayla
                </button>
              )}
              {order.status === "CONFIRMED" &&
                order.shippingStatus === "PREPARING" && (
                  <button
                    className="order-detail-ship-btn"
                    onClick={() => handleUpdateStatus("SHIPPED")}
                  >
                    Kargoya Ver
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
