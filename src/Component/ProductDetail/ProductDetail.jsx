// components/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTruck, FaComment } from "react-icons/fa";
import "./ProductDetail.css";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchComments();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Ürün detayları yüklenirken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/products/${id}/comments`);
      setComments(response.data || []); // Eğer data null ise boş array kullan
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
      setComments([]); // Hata durumunda boş array
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Ürün bulunamadı.</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-main">
        <div className="product-images">
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:8080/uploads/products/${
                    product.id
                  }/${product.images[0].split("/").pop()}`
                : "/default-product.png"
            }
            alt={product.name}
            className="product-main-image"
          />
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>

          <div className="seller-info">
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
              />
              <div className="seller-details">
                <h3
                  className="seller-name"
                  onClick={() => navigate(`/seller/${product.seller.id}`)}
                >
                  {product.seller?.firstName} {product.seller?.lastName}
                </h3>
              </div>
            </div>
          </div>

          <div className="product-price-section">
            <h2 className="price">{product.price} TL</h2>
          </div>

          <div className="stock-info">
            <h3>Stok Durumu</h3>
            {product.stock > 0 ? (
              <div className="in-stock">
                <span className="stock-status">Stokta</span>
                <span className="stock-quantity">
                  {product.stock} adet mevcut
                </span>
              </div>
            ) : (
              <div className="out-of-stock">
                <span className="stock-status">Stokta Yok</span>
                {product.restockDate && (
                  <span className="restock-info">
                    Tahmini stok tarihi:{" "}
                    {new Date(product.restockDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="product-details">
            <h3>Ürün Detayları</h3>
            <p>{product.description}</p>

            <div className="product-specs">
              <div className="spec-item">
                <strong>Kategori:</strong> {product.category?.name}
              </div>
              {product.type && (
                <div className="spec-item">
                  <strong>Tür:</strong> {product.type}
                </div>
              )}
            </div>
          </div>

          {product.shippingDetails && (
            <div className="shipping-info">
              <h3>
                <FaTruck /> Kargo Bilgileri
              </h3>
              <p>{product.shippingDetails}</p>
            </div>
          )}
        </div>
      </div>

      <div className="product-comments">
        <h3>
          <FaComment /> Ürün Yorumları ({comments.length})
        </h3>

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.user?.firstName} {comment.user?.lastName}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
                {comment.createdAt && (
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="no-comments">
              <p>Bu ürün için henüz yorum yapılmamış.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
