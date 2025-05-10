import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";
import { head } from "framer-motion/client";

const SellerDashboard = () => {
  const navigate = useNavigate();
  // Profil state'leri
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  // Ürün state'leri
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    status: "",
    categoryId: "",
    type: "FOOD",
    shippingDetails: "",
  });

  // Yeni ürün ekleme state'leri
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    shippingDetails: "",
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "SELLER") {
      setError("Bu sayfaya erişim yetkiniz yok");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await Promise.all([fetchProfile(), fetchProducts(), fetchCategories()]);
    } catch (error) {
      console.error("Veri yüklenirken hata:", error);
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const meResponse = await axios.get(
        "http://localhost:8080/api/v1/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await axios.get(
        `http://localhost:8080/api/v1/users/${meResponse.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || "",
        bio: response.data.bio || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Profil bilgileri yüklenirken hata:", error);
      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Profil bilgileri yüklenirken bir hata oluştu.");
      }
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
      setShowProfileEditModal(false);
    } catch (err) {
      console.error("Profil güncellenirken hata:", err);
      setError("Profil güncellenirken bir hata oluştu.");
    }
  };

  const [sortOrder, setSortOrder] = useState("newest");

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/seller/products?sortBy=${sortOrder}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(response.data);
    } catch (err) {
      setError("Ürünler yüklenirken hata oluştu: " + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Categories fetch error:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8080/api/v1/seller/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(products.filter((product) => product.id !== productId));
        alert("Ürün başarıyla silindi");
      } catch (error) {
        alert("Ürün silinirken bir hata oluştu");
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      categoryId: product.category.id,
      type: product.type || "FOOD",
      shippingDetails: product.shippingDetails,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        categoryId: parseInt(editFormData.categoryId),
      };

      await axios.put(
        `http://localhost:8080/api/v1/seller/products/${selectedProduct.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowEditModal(false);
      setSelectedProduct(null);
      await fetchProducts();
    } catch (error) {
      alert("Ürün güncellenirken bir hata oluştu");
    }
  };

  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Açıklama kontrolü
    if (newProduct.description.length < 10) {
      setError("Ürün açıklaması en az 10 karakter olmalıdır!");
      return;
    }

    // Token ve yetki kontrolü
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "SELLER") {
      setError(
        "Oturum süreniz dolmuş veya yetkiniz yok. Lütfen tekrar giriş yapın."
      );
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      // Önce ürün verilerini gönder
      const productData = {
        title: newProduct.title.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        categoryId: parseInt(newProduct.categoryId),
        type: "FOOD",
        images: [],
        tags: [],
        ingredients: "",
        preparationTime: "",
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/seller/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Eğer resimler varsa, ayrı bir istekle resimleri yükle
      if (response.data && newProduct.images.length > 0) {
        const productId = response.data.id;
        const imageFormData = new FormData();

        // Her bir resmi FormData'ya ekle
        newProduct.images.forEach((image) => {
          imageFormData.append("images", image);
        });

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Oturum bilgisi bulunamadı");
          }
          console.log("Resim yükleme isteği gönderiliyor...");
          console.log("Ürün ID:", productId);
          console.log("Resim sayısı:", newProduct.images.length);
          console.log("Token:", token.substring(0, 20) + "...");
          console.log("FormData içeriği:", imageFormData);
          const uploadResponse = await axios.post(
            `http://localhost:8080/api/v1/seller/products/${productId}/images`,
            imageFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          console.log("Resim yükleme başarılı:", uploadResponse.data);
        } catch (imageError) {
          console.error("Hata detayları:", {
            message: imageError.message,
            response: imageError.response?.data,
            status: imageError.response?.status,
            headers: imageError.response?.headers,
          });
          setError(
            "Ürün oluşturuldu fakat resimler yüklenirken bir hata oluştu: " +
              (imageError.response?.data || imageError.message)
          );
        }
      }

      // Başarılı ekleme sonrası
      await fetchProducts(); // Ürün listesini yenile
      setShowAddProductModal(false); // Modalı kapat
      setNewProduct({
        // Form verilerini sıfırla
        title: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        images: [],
      });
    } catch (error) {
      console.error("Hata detayları:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 403) {
        setError(
          "Bu işlem için yetkiniz bulunmuyor. Lütfen tekrar giriş yapın."
        );
        localStorage.clear();
        navigate("/login");
      } else if (error.response?.status === 401) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message || "Ürün eklenirken bir hata oluştu."
        );
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">Kullanıcı bulunamadı.</div>;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(productSearchTerm.toLowerCase());
    const matchesCategory =
      productCategoryFilter === "ALL" ||
      product.category.id.toString() === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="seller-dashboard">
      {/* Profil Başlık Bölümü */}
      <div className="profile-header">
        <div className="profile-info-container">
          <div className="profile-image-wrapper">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt="Profil"
              className="profile-image"
            />
          </div>
          <div className="profile-details">
            <div className="profile-name-container">
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <span className="seller-badge">Satıcı</span>
            </div>
            {user.bio && <div className="profile-bio">{user.bio}</div>}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{products.length}</span>
                <span className="stat-label">Ürün</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.followerCount || 0}</span>
                <span className="stat-label">Takipçi</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {user.sellerRating ? user.sellerRating.toFixed(1) : "0.0"}
                </span>
                <span className="stat-label">Puan</span>
              </div>
            </div>
            <button
              className="edit-profile-button"
              onClick={() => setShowProfileEditModal(true)}
            >
              <i className="fas fa-edit"></i> Profili Düzenle
            </button>
          </div>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="profile-tabs">
        <div className="tab active">Ürünlerim ({products.length})</div>
        <div className="tab">Satışlarım (0)</div>
        <div className="tab">Favoriler (0)</div>
      </div>

      {/* Filtreler */}
      <div className="filters-container">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Ürünlerimde ara..."
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="category-select"
          >
            <option value="ALL">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-filter">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">En Yeniler</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
          </select>
        </div>
      </div>

      {/* Ürün Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={
                  product.images[0]
                    ? `http://localhost:8080${product.images[0]}`
                    : "/placeholder.png"
                }
                alt={product.title}
                className="product-image"
              />
              <div className="product-status-badge">
                {product.status === "AVAILABLE" && "Satışta"}
                {product.status === "SOLD" && "Satıldı"}
                {product.status === "PENDING_REVIEW" && "İncelemede"}
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <div className="product-category">{product.category.name}</div>
              <div className="product-price">{product.price} TL</div>
              <div className="product-stock">Stok: {product.stock}</div>
            </div>
            <div className="product-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(product)}
              >
                Düzenle
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sabit Ürün Ekleme Butonu */}
      <button
        className="add-product-button"
        onClick={() => setShowAddProductModal(true)}
      >
        <i className="fas fa-plus"></i> Yeni Ürün Ekle
      </button>

      {/* Profil Düzenleme Modal */}
      {showProfileEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Profili Düzenle</h3>
              <button
                className="close-button"
                onClick={() => setShowProfileEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Ad:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Soyad:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>E-posta:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Telefon:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Biyografi:</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Kaydet
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowProfileEditModal(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ürün Ekleme Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Yeni Ürün Ekle</h2>
            <form onSubmit={handleNewProductSubmit}>
              <div className="form-group">
                <label>Ürün Adı</label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Ürün Açıklaması ({newProduct.description.length} karakter -
                  minimum 10 karakter)
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                  minLength={10}
                  className={
                    newProduct.description.length > 0 &&
                    newProduct.description.length < 10
                      ? "invalid"
                      : ""
                  }
                />
                {newProduct.description.length > 0 &&
                  newProduct.description.length < 10 && (
                    <small className="error-text">
                      Ürün açıklaması en az 10 karakter olmalıdır.
                      {10 - newProduct.description.length} karakter daha
                      yazmalısınız.
                    </small>
                  )}
              </div>

              <div className="form-group">
                <label>Fiyat (TL)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: e.target.value,
                    })
                  }
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Stok</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: e.target.value,
                    })
                  }
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ürün Görselleri</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    // Dosya boyutu kontrolü (5MB)
                    const validFiles = files.filter(
                      (file) => file.size <= 5 * 1024 * 1024
                    );
                    if (validFiles.length !== files.length) {
                      setError(
                        "Bazı dosyalar 5MB boyut sınırını aşıyor ve yüklenmeyecek."
                      );
                    }
                    setNewProduct({
                      ...newProduct,
                      images: validFiles,
                    });
                  }}
                />
                <small className="help-text">
                  Desteklenen formatlar: JPG, JPEG, PNG, GIF. Maksimum dosya
                  boyutu: 5MB
                </small>
                {newProduct.images.length > 0 && (
                  <div className="image-preview">
                    {newProduct.images.map((file, index) => (
                      <div key={index} className="preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                        <span className="file-name">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Ekle
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setError(null);
                    setNewProduct({
                      title: "",
                      description: "",
                      price: "",
                      stock: "",
                      categoryId: "",
                      images: [],
                    });
                  }}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ürün Düzenleme Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ürün Düzenle</h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Ürün Adı:</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Açıklama:</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  required
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fiyat (TL):</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Stok:</label>
                  <input
                    type="number"
                    value={editFormData.stock}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        stock: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Durum:</label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      status: e.target.value,
                    })
                  }
                  required
                >
                  <option value="AVAILABLE">Aktif</option>
                  <option value="INACTIVE">Pasif</option>
                  <option value="PENDING_REVIEW">Onay Bekliyor</option>
                  <option value="REJECTED">Reddedildi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Kategori:</label>
                <select
                  value={editFormData.categoryId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      categoryId: e.target.value,
                    })
                  }
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Kargo Detayları:</label>
                <textarea
                  value={editFormData.shippingDetails}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      shippingDetails: e.target.value,
                    })
                  }
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Kaydet
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
