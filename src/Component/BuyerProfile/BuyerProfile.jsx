import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Profile/Profile.css"; // Aynı stilleri kullanabilirsin

const BuyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchBuyer();
    fetchFollowing();
  }, [id]);

  const fetchBuyer = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/users/${id}`
      );
      setBuyer(response.data);
      setLoading(false);
    } catch (error) {
      setError("Kullanıcı bilgileri yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    try {
      // Sadece ilgili buyer'ın takip ettiği satıcıları getir
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/v1/users/${id}/following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowing(response.data);
    } catch (error) {
      // Takip edilenler zorunlu değil, hata olursa boş bırak
      setFollowing([]);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!buyer) return <div className="error-message">Kullanıcı bulunamadı.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={
              buyer.profilePicture
                ? `http://localhost:8080/profiles/${buyer.profilePicture}`
                : "/default-avatar.png"
            }
            alt="Profil"
            className="profile-image"
          />
        </div>
        <h2>
          {buyer.firstName} {buyer.lastName}
        </h2>
        <p>Alıcı</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <i className="fas fa-user"></i> Profil
        </button>
        <button
          className={`tab-button ${activeTab === "following" ? "active" : ""}`}
          onClick={() => setActiveTab("following")}
        >
          <i className="fas fa-users"></i> Takip Edilenler ({following.length})
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="profile-info">
          <div className="info-group">
            <label>Ad Soyad:</label>
            <p>
              {buyer.firstName} {buyer.lastName}
            </p>
          </div>
          <div className="info-group">
            <label>E-posta:</label>
            <p>{buyer.email}</p>
          </div>
          <div className="info-group">
            <label>Biyografi:</label>
            <p>{buyer.bio || "Biyografi eklenmemiş"}</p>
          </div>
        </div>
      )}

      {activeTab === "following" && (
        <div className="following-grid">
          {following.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-friends"></i>
              <p>Henüz takip ettiği satıcı yok.</p>
            </div>
          ) : (
            following.map((seller) => (
              <div key={seller.id} className="seller-card">
                <div className="seller-header">
                  <img
                    src={
                      seller.profilePicture
                        ? `http://localhost:8080/profiles/${seller.profilePicture}`
                        : "/default-avatar.png"
                    }
                    alt={seller.firstName}
                  />
                  <div className="seller-stats">
                    <div className="stat">
                      <span className="value">{seller.productCount}</span>
                      <span className="label">Ürün</span>
                    </div>
                    <div className="stat">
                      <span className="value">{seller.followerCount}</span>
                      <span className="label">Takipçi</span>
                    </div>
                    <div className="stat">
                      <span className="value">
                        {seller.sellerRating || "0.0"}
                      </span>
                      <span className="label">Puan</span>
                    </div>
                  </div>
                </div>
                <div className="seller-info">
                  <h3>
                    {seller.firstName} {seller.lastName}
                  </h3>
                  <p className="seller-bio">{seller.bio || "Biyografi yok"}</p>
                  <div className="seller-actions">
                    <button
                      className="view-store-button"
                      onClick={() => navigate(`/seller/${seller.id}`)}
                    >
                      <i className="fas fa-store"></i> Mağazaya Git
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
