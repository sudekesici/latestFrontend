import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OfferDetail.css";

const API_URL = "http://localhost:8080";

const OfferDetail = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type || "");
    const fetchOffer = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = "";
        if (type === "SELLER") {
          url = `${API_URL}/api/v1/seller/offers/${offerId}`;
        } else {
          url = `${API_URL}/api/v1/buyer/offers/${offerId}`;
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffer(res.data);
      } catch (e) {
        setError("Teklif bulunamadı veya yetkiniz yok.");
      }
      setLoading(false);
    };
    fetchOffer();
  }, [offerId]);

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/seller/offers/${offerId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Teklif onaylandı!");
      navigate(`/products/${offer.product.id}`);
    } catch (e) {
      alert("Onaylanamadı!");
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/v1/seller/offers/${offerId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Teklif reddedildi!");
      navigate(`/products/${offer.product.id}`);
    } catch (e) {
      alert("Reddedilemedi!");
    }
  };

  if (loading) return <div className="offer-detail-loading">Yükleniyor...</div>;
  if (error) return <div className="offer-detail-error">{error}</div>;
  if (!offer)
    return <div className="offer-detail-error">Teklif bulunamadı</div>;

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Beklemede";
      case "ACCEPTED":
        return "Kabul Edildi";
      case "REJECTED":
        return "Reddedildi";
      case "CANCELLED":
        return "İptal Edildi";
      default:
        return status;
    }
  };
  return (
    <div className="offer-detail-container">
      <h2>Teklif Detayı</h2>
      <div className="offer-detail-row">
        <span className="offer-detail-label">Ürün:</span>
        <span>{offer.product?.title || "-"}</span>
      </div>
      <div className="offer-detail-row">
        <span className="offer-detail-label">Teklif Tutarı:</span>
        <span>{offer.offerAmount} TL</span>
      </div>
      <div className="offer-detail-row">
        <span className="offer-detail-label">Mesaj:</span>
        <span>{offer.message || "-"}</span>
      </div>
      <div className="offer-detail-row">
        <span className="offer-detail-label">Durum:</span>
        <span className={`offer-detail-status offer-status-${offer.status}`}>
          {getStatusText(offer.status)}
        </span>
      </div>
      {/* Sadece satıcıya onay/reddet butonları göster */}
      {userType === "SELLER" && offer.status === "PENDING" && (
        <div className="offer-detail-actions">
          <button className="offer-detail-accept" onClick={handleAccept}>
            Onayla
          </button>
          <button className="offer-detail-reject" onClick={handleReject}>
            Reddet
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferDetail;
