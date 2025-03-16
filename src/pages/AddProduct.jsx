import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    shippingDetails: "",
    images: [],
  });

  useEffect(() => {
    checkAuthorization();
    fetchCategories();
  }, []);

  const checkAuthorization = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    console.log("User Type:", userType); // Debug için

    if (!token) {
      setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      setTimeout(() => navigate("/login"), 2000);
      return false;
    }

    if (userType !== "SELLER") {
      setError(
        "Bu sayfaya erişim yetkiniz yok. Sadece satıcılar ürün ekleyebilir."
      );
      setTimeout(() => navigate("/"), 2000);
      return false;
    }

    return true;
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      if (error.response?.status === 403) {
        setError("Bu işlem için yetkiniz bulunmuyor.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError("Kategoriler yüklenirken bir hata oluştu.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!checkAuthorization()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Form verilerini hazırla
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        shippingDetails: formData.shippingDetails,
        status: "PENDING_REVIEW",
        type: "FOOD",
        tags: [],
        ingredients: "",
        preparationTime: "",
        images: [],
      };

      // Önce ürün bilgilerini gönder
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

      // Eğer ürün başarıyla eklendiyse ve resimler varsa
      if (response.data && formData.images.length > 0) {
        const productId = response.data.id;
        const imageFormData = new FormData();
        formData.images.forEach((image) => {
          imageFormData.append("images", image);
        });

        // Resimleri ayrı bir endpoint'e gönder
        await axios.post(
          `http://localhost:8080/api/v1/seller/products/${productId}/images`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      navigate("/my-products");
    } catch (error) {
      console.error("Ürün eklenirken hata:", error);
      if (error.response?.status === 403) {
        setError(
          "Bu işlem için yetkiniz bulunmuyor. Lütfen satıcı hesabı ile giriş yapın."
        );
        setTimeout(() => navigate("/"), 2000);
      } else if (error.response?.status === 401) {
        setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          error.response?.data?.message || "Ürün eklenirken bir hata oluştu."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="add-product-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      <h2>Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="title">Ürün Adı</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Ürün Açıklaması</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Fiyat (TL)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stok</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Kategori</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
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
          <label htmlFor="shippingDetails">Kargo Detayları</label>
          <textarea
            id="shippingDetails"
            name="shippingDetails"
            value={formData.shippingDetails}
            onChange={handleChange}
            required
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Ürün Görselleri</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/my-products")}
            className="cancel-button"
          >
            İptal
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Ekleniyor..." : "Ürün Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
