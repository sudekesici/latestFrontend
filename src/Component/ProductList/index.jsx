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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  // Filtreleme ve sıralama fonksiyonları
  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Kategori filtresi
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category.id.toString() === selectedCategory
      );
    }

    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.name.toLowerCase().includes(searchLower)
      );
    }

    // Fiyat aralığı filtresi
    if (priceRange.min !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }

    // Sıralama
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("default");
    setPriceRange({ min: "", max: "" });
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );

  if (error) return <div className="error">{error}</div>;

  const filteredProducts = filteredAndSortedProducts();

  return (
    <div>
      <div className="products-container">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Ürün Ara..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-options">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Varsayılan Sıralama</option>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="name-asc">İsim (A-Z)</option>
              <option value="name-desc">İsim (Z-A)</option>
            </select>

            <div className="price-range">
              <input
                type="number"
                name="min"
                placeholder="Min Fiyat"
                value={priceRange.min}
                onChange={handlePriceRangeChange}
                className="price-input"
              />
              <input
                type="number"
                name="max"
                placeholder="Max Fiyat"
                value={priceRange.max}
                onChange={handlePriceRangeChange}
                className="price-input"
              />
            </div>

            <button onClick={resetFilters} className="reset-filters">
              Filtreleri Sıfırla
            </button>
          </div>
        </div>

        <h2 className="product-list-title">
          {filteredProducts.length > 0
            ? `${filteredProducts.length} Ürün Bulundu`
            : "Ürün Bulunamadı"}
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            Arama kriterlerinize uygun ürün bulunamadı.
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
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
            <p className="product-description">
              {product.description?.substring(0, 100)}
              {product.description?.length > 100 ? "..." : ""}
            </p>
            <p className="product-category">{product.category?.name}</p>
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
