import axios from "axios";
import { useEffect, useState } from "react";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

// Public API instance for product listing
const publicApi = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Authenticated API instance for user actions
const authApi = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Request interceptor for authenticated API
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for authenticated API
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Sadece korumalı rotalarda token hatası olduğunda çıkış yap
      const protectedRoutes = [
        "/cart",
        "/orders",
        "/my-products",
        "/add-product",
        "/admin",
      ];
      if (protectedRoutes.some((route) => error.config.url.includes(route))) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ürünleri ve kategorileri paralel olarak çekelim (public API)
        const [productsResponse, categoriesResponse] = await Promise.all([
          publicApi.get("/products"),
          publicApi.get("/categories"),
        ]);

        setProducts(productsResponse.data.content);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Veri alınırken hata oluştu:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="products-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Ürün Ara..."
            className="search-input"
          />
        </div>
        <h2 className="product-list-title">Tüm Ürünler</h2>
        {products.length === 0 ? (
          <div className="error">Ürün bulunamadı.</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products }) {
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await authApi.post("/cart/add", {
        productId,
        quantity: 1,
      });

      alert("Ürün sepete eklendi!");
    } catch (error) {
      console.error("Sepete eklenirken hata:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
      } else {
        alert("Ürün sepete eklenemedi.");
      }
    }
  };

  return (
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
            <h4>{product.title}</h4>
            <p className="product-price">{product.price} TL</p>
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart(product.id)}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
