// SellerProfile.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import "./SellerProfile.css";

// API instance oluştur
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Request interceptor ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem("userRole"));
    }
  }, []);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // API çağrılarını ayrı ayrı yapalım ve hata yönetimini geliştirelim
        let sellerData, productsData;

        try {
          const sellerRes = await api.get(`/users/${id}`);
          sellerData = sellerRes.data;
        } catch (error) {
          console.error("Satıcı bilgileri alınamadı:", error);
          throw new Error("Satıcı bilgileri alınamadı");
        }

        try {
          const productsRes = await api.get(`/products/seller/${id}`);
          productsData = productsRes.data;
        } catch (error) {
          console.error("Ürün bilgileri alınamadı:", error);
          throw new Error("Ürün bilgileri alınamadı");
        }

        setSeller(sellerData);
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Eğer kullanıcı giriş yapmış ve alıcıysa, takip durumunu kontrol et
        if (isLoggedIn && userRole === "BUYER") {
          try {
            const followingRes = await api.get("/buyer/following");
            setIsFollowing(
              followingRes.data.some((f) => f.id === parseInt(id))
            );
          } catch (error) {
            console.error("Takip durumu kontrol edilemedi:", error);
            // Takip durumu alınamazsa, varsayılan olarak false kabul edelim
            setIsFollowing(false);
          }
        }
      } catch (err) {
        console.error("Veri yükleme hatası:", err);
        setError(err.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSellerData();
    }
  }, [id, isLoggedIn, userRole]);

  const handleToggleFollow = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        await api.delete(`/buyer/unfollow/${id}`);
        setIsFollowing(false);
      } else {
        await api.post(`/buyer/follow/${id}`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Takip işlemi başarısız:", error);
      alert("Takip işlemi gerçekleştirilemedi.");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );

  if (error) return <div className="error-message">{error}</div>;
  if (!seller) return <div className="error-message">Satıcı bulunamadı.</div>;

  return (
    <div className="seller-profile-container">
      <div className="seller-header">
        <div className="seller-info">
          <img
            src={seller.profilePicture || "/default-avatar.png"}
            alt={seller.firstName}
            className="seller-avatar"
          />
          <div className="seller-details">
            <h1>
              {seller.firstName} {seller.lastName}
            </h1>
            <p className="seller-bio">
              {seller.bio || "Henüz biyografi eklenmemiş."}
            </p>
            <div className="seller-stats">
              <div className="stat">
                <span className="stat-value">{products.length}</span>
                <span className="stat-label">Ürün</span>
              </div>
              <div className="stat">
                <span className="stat-value">{seller.followerCount || 0}</span>
                <span className="stat-label">Takipçi</span>
              </div>
              <div className="stat">
                <span className="stat-value">{seller.rating || "0.0"}</span>
                <span className="stat-label">Puan</span>
              </div>
            </div>
            {isLoggedIn && userRole === "BUYER" && seller.role === "SELLER" && (
              <button
                className={`follow-button ${isFollowing ? "following" : ""}`}
                onClick={handleToggleFollow}
              >
                {isFollowing ? (
                  <>
                    <FaUserCheck /> Takipte
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Takip Et
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="seller-products">
        <h2>Satıcının Ürünleri</h2>
        {products.length === 0 ? (
          <div className="no-products">
            <p>Henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={`http://localhost:8080/images/${product.images[0]}`}
                    alt={product.title}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, 100)}
                    {product.description?.length > 100 ? "..." : ""}
                  </p>
                  <p className="product-category">{product.category?.name}</p>
                  <p className="product-price">{product.price} TL</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfile;
