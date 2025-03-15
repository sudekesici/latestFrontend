import axios from "axios";
import { useEffect, useState } from "react";
import "./ProductList.css";

// Axios instance oluştur
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
  (error) => {
    return Promise.reject(error);
  }
);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ürünleri ve kategorileri paralel olarak çekelim
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setProducts(productsResponse.data.content);
        setCategories(categoriesResponse.data);

        // Kullanıcı bilgisini kontrol edelim
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userResponse = await api.get("/users/profile");
            setUser(userResponse.data);
          } catch (userError) {
            console.error("Kullanıcı bilgileri alınamadı:", userError);
            // Token geçersizse localStorage'dan kaldır
            if (userError.response?.status === 403) {
              localStorage.removeItem("token");
            }
          }
        }
      } catch (err) {
        console.error("Veri alınırken hata oluştu:", err);
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Token değiştiğinde useEffect'i tekrar çalıştır
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
          <ProductGrid products={products} user={user} />
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products, user }) {
  const handleAddToCart = async (productId) => {
    try {
      if (!user) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        window.location.href = "/login";
        return;
      }

      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });

      alert("Ürün sepete eklendi!");
    } catch (error) {
      console.error("Sepete eklenirken hata:", error);
      alert("Ürün sepete eklenemedi.");
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
