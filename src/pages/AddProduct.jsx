import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
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
    // eslint-disable-next-line
  }, []);

  const checkAuthorization = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
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
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      setError("Kategoriler yüklenirken bir hata oluştu.");
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

  const handleSuggestPrice = async () => {
    if (!formData.title || !formData.description || !formData.categoryId) {
      setError(
        "Fiyat önerisi için ürün adı, açıklaması ve kategorisi gereklidir."
      );
      return;
    }

    setSuggesting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/v1/seller/suggest-price",
        {
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.suggestedPrice) {
        setSuggestedPrice(response.data.suggestedPrice);
      }
    } catch (error) {
      setError("Fiyat önerisi alınırken bir hata oluştu.");
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.description.length < 10) {
      setError("Ürün açıklaması en az 10 karakter olmalıdır!");
      setLoading(false);
      return;
    }
    if (!checkAuthorization()) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        shippingDetails: formData.shippingDetails.trim(),
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
      if (response.data && formData.images.length > 0) {
        const productId = response.data.id;
        const imageFormData = new FormData();
        formData.images.forEach((image) => {
          imageFormData.append("images", image);
        });
        try {
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
        } catch {}
      }
      navigate("/my-products");
    } catch (error) {
      if (error.response?.status === 403) {
        setError(
          "Bu işlem için yetkiniz bulunmuyor. Lütfen satıcı hesabı ile giriş yapın."
        );
        localStorage.clear();
        setTimeout(() => navigate("/login"), 2000);
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
  const handleCancel = () => {
    console.log("Ürün ekleme iptal edildi.");
    setSuggestedPrice(null);
    setSuggesting(false);
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      shippingDetails: "",
      images: [],
    });
    navigate("/my-products");
  };

  if (error) {
    return (
      <div className="add-product-container">
        <div className="add-product-error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="add-product-form-group">
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
        <div className="add-product-form-group">
          <label htmlFor="description">
            Ürün Açıklaması ({formData.description.length} karakter - minimum 10
            karakter)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className={
              formData.description.length > 0 &&
              formData.description.length < 10
                ? "add-product-invalid"
                : ""
            }
          />
          {formData.description.length > 0 &&
            formData.description.length < 10 && (
              <small className="add-product-error-text">
                Ürün açıklaması en az 10 karakter olmalıdır.{" "}
                {10 - formData.description.length} karakter daha yazmalısınız.
              </small>
            )}
        </div>
        {/* Fiyat ve fiyat önerisi */}
        <div className="add-product-form-group">
          <label htmlFor="price">Fiyat (TL)</label>
          <div className="price-input-container">
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
            <button
              type="button"
              className="suggest-price-button"
              onClick={handleSuggestPrice}
              disabled={
                suggesting ||
                !formData.title ||
                !formData.description ||
                !formData.categoryId
              }
            >
              <i className="fas fa-magic"></i>
              {suggesting ? "Öneriliyor..." : "Fiyat Öner"}
            </button>
          </div>
          {suggestedPrice && (
            <div className="suggested-price">
              <strong>Yapay Zeka Fiyat Önerisi:</strong> {suggestedPrice} TL
              <button
                type="button"
                className="apply-price-button"
                onClick={() =>
                  setFormData({ ...formData, price: suggestedPrice })
                }
              >
                <i className="fas fa-check"></i> Uygula
              </button>
            </div>
          )}
        </div>
        <div className="add-product-form-group">
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
        <div className="add-product-form-group">
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
        <div className="add-product-form-group">
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
        <div className="add-product-form-group">
          <label htmlFor="images">Ürün Görselleri (Opsiyonel)</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
        </div>
        <div className="add-product-form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="add-product-cancel-button"
          >
            İptal
          </button>
          <button
            type="submit"
            className="add-product-submit-button"
            disabled={loading}
          >
            {loading ? "Ekleniyor..." : "Ürün Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
