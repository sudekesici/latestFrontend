import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaStar,
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBoxOpen,
  FaTag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

const API_URL = "http://localhost:8080";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const email = payload?.sub;
    setIsLoggedIn(!!token);
    setUserType(type || "");
    setUserEmail(email || "");

    const fetchProduct = async () => {
      if (!id) {
        setError("Ürün ID'si bulunamadı");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/api/v1/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProduct(response.data);
      } catch (error) {
        setError("Ürün yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/buyer/comments/product/${id}`
        );
        setComments(response.data);
      } catch (error) {}
    };

    fetchProduct();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Yorum yapabilmek için giriş yapmalısınız");
      return;
    }
    if (!newComment.trim()) {
      alert("Lütfen bir yorum yazın");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/buyer/comments`,
        {
          productId: id,
          content: newComment,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([response.data, ...comments]);
      setNewComment("");
      setRating(5);
    } catch (error) {
      alert(
        error.response?.data?.message || "Yorum eklenirken bir hata oluştu"
      );
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) {
      alert("Lütfen bir yanıt yazın");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/buyer/comments/${commentId}/reply`,
        { reply: replyText[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setReplyText({ ...replyText, [commentId]: "" });
      setEditingReply(null);
    } catch (error) {
      alert(
        error.response?.data?.message || "Yanıt eklenirken bir hata oluştu"
      );
    }
  };

  const handleEditReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) {
      alert("Lütfen bir yanıt yazın");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/v1/buyer/comments/${commentId}/reply`,
        { reply: replyText[commentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setReplyText({ ...replyText, [commentId]: "" });
      setEditingReply(null);
    } catch (error) {
      alert(
        error.response?.data?.message || "Yanıt güncellenirken bir hata oluştu"
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/buyer/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      alert(
        error.response?.data?.message || "Yorum silinirken bir hata oluştu"
      );
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Ürün bulunamadı</div>;

  const isSellerOfProduct = userType === "SELLER";
  const statusBadge = {
    AVAILABLE: { text: "Satışta", color: "#4caf50", icon: <FaCheckCircle /> },
    SOLD: { text: "Satıldı", color: "#e44d26", icon: <FaTimesCircle /> },
    PENDING_REVIEW: { text: "İncelemede", color: "#ff9800", icon: <FaClock /> },
    INACTIVE: { text: "Pasif", color: "#aaa", icon: <FaTimesCircle /> },
    REJECTED: { text: "Reddedildi", color: "#b71c1c", icon: <FaTimesCircle /> },
  }[product.status] || { text: product.status, color: "#666" };

  return (
    <div className="product-detail">
      <div className="product-header">
        <h1>{product.title || product.name}</h1>
        <div className="product-meta">
          <span className="price">{product.price} TL</span>
          <span className="category">
            <FaBoxOpen /> {product.category?.name}
          </span>
          <span className="stock">
            <FaBoxOpen /> Stok: {product.stock}
          </span>
          <span
            className="status-badge"
            style={{
              background: statusBadge.color,
              color: "#fff",
              borderRadius: 16,
              padding: "2px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            {statusBadge.icon} {statusBadge.text}
          </span>
        </div>
      </div>

      <div className="product-content">
        <div className="product-images">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={`${API_URL}${product.images[mainImageIdx]}`}
                alt={product.title}
                className="main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              {product.images.length > 1 && (
                <div className="image-thumbnails">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${API_URL}${img}`}
                      alt={`thumb-${idx}`}
                      className={`thumbnail${
                        mainImageIdx === idx ? " selected" : ""
                      }`}
                      onClick={() => setMainImageIdx(idx)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-image">Resim yok</div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag, idx) => (
                <span className="tag" key={idx}>
                  <FaTag /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-description">
            <h2>Ürün Açıklaması</h2>
            <p>{product.description}</p>
          </div>

          {product.shippingDetails && (
            <div className="product-shipping">
              <h2>Kargo Detayları</h2>
              <p>{product.shippingDetails}</p>
            </div>
          )}

          {product.ingredients && (
            <div className="product-ingredients">
              <h2>İçindekiler</h2>
              <p>{product.ingredients}</p>
            </div>
          )}

          {product.preparationTime && (
            <div className="product-preparation">
              <h2>Hazırlama Süresi</h2>
              <p>{product.preparationTime}</p>
            </div>
          )}

          <div className="seller-info">
            <h2>Satıcı Bilgileri</h2>
            <div className="seller-profile">
              <img
                src={
                  product.seller?.profilePicture
                    ? `http://localhost:8080/profiles/${product.seller.profilePicture}`
                    : "/default-avatar.png"
                }
                alt={`${product.seller?.firstName} ${product.seller?.lastName}`}
                className="seller-avatar"
                onClick={() => navigate(`/seller/${product.seller.id}`)}
                style={{ cursor: "pointer" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="seller-details">
                <h3
                  className="seller-name"
                  onClick={() => navigate(`/seller/${product.seller.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {product.seller?.firstName} {product.seller?.lastName}
                </h3>
                <p className="seller-bio">{product.seller?.bio}</p>
                <div className="seller-contact">
                  <span>
                    <FaPhone /> {product.seller?.phoneNumber}
                  </span>
                  <span>
                    <FaEnvelope /> {product.seller?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-extra-info">
        <h2>Ürün Detayları</h2>
        <ul>
          <li>
            <strong>Fiyat:</strong> {product.price} TL
          </li>
          <li>
            <strong>Stok:</strong> {product.stock}
          </li>
          <li>
            <strong>Kategori:</strong> {product.category?.name}
          </li>
          {product.shippingDetails && (
            <li>
              <strong>Kargo Detayları:</strong> {product.shippingDetails}
            </li>
          )}
          {product.ingredients && (
            <li>
              <strong>İçindekiler:</strong> {product.ingredients}
            </li>
          )}
          {product.preparationTime && (
            <li>
              <strong>Hazırlama Süresi:</strong> {product.preparationTime}
            </li>
          )}
          {product.rating !== undefined && (
            <li>
              <strong>Ortalama Puan:</strong> {product.rating}
            </li>
          )}
          {product.reviewCount !== undefined && (
            <li>
              <strong>Yorum Sayısı:</strong> {product.reviewCount}
            </li>
          )}
        </ul>
      </div>

      <div className="comments-section">
        <h2>Yorumlar</h2>
        {isLoggedIn && userType !== "SELLER" && (
          <form onSubmit={handleAddComment} className="comment-form">
            <div className="rating-input">
              <label>Puanınız:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star-icon ${star <= rating ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              required
            />
            <button type="submit">Yorum Yap</button>
          </form>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Henüz yorum yapılmamış</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {(isSellerOfProduct ||
                    (userEmail && comment.user.email === userEmail)) && (
                    <button
                      className="delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <FaTrash /> Sil
                    </button>
                  )}
                </div>
                <div className="comment-content">
                  <div className="comment-rating">
                    {[...Array(comment.rating)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <p>{comment.content}</p>
                  {comment.sellerReply && !editingReply && (
                    <div className="seller-reply">
                      <strong>Satıcı Yanıtı:</strong>
                      <p>{comment.sellerReply}</p>
                      {isSellerOfProduct && (
                        <button
                          className="edit-reply"
                          onClick={() => {
                            setEditingReply(comment.id);
                            setReplyText({
                              ...replyText,
                              [comment.id]: comment.sellerReply,
                            });
                          }}
                        >
                          Düzenle
                        </button>
                      )}
                    </div>
                  )}
                  {isSellerOfProduct && (
                    <div className="reply-section">
                      {editingReply === comment.id ? (
                        <>
                          <textarea
                            value={replyText[comment.id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [comment.id]: e.target.value,
                              })
                            }
                            placeholder="Yanıtınızı yazın..."
                          />
                          <div className="reply-buttons">
                            <button onClick={() => handleEditReply(comment.id)}>
                              Güncelle
                            </button>
                            <button
                              onClick={() => {
                                setEditingReply(null);
                                setReplyText({
                                  ...replyText,
                                  [comment.id]: "",
                                });
                              }}
                            >
                              İptal
                            </button>
                          </div>
                        </>
                      ) : !comment.sellerReply ? (
                        <>
                          <textarea
                            value={replyText[comment.id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [comment.id]: e.target.value,
                              })
                            }
                            placeholder="Yanıtınızı yazın..."
                          />
                          <button onClick={() => handleAddReply(comment.id)}>
                            Yanıtla
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
