import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Yetkisiz erişim. Lütfen giriş yapın.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/v1/users/${id}`,
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
      setError("Profil bilgileri yüklenirken bir hata oluştu.");
      console.error("Profil verisi alınamadı:", error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Dosyayı base64'e çevir
        const base64 = await convertToBase64(file);
        setFormData((prev) => ({
          ...prev,
          profilePicture: base64,
        }));

        // Önizleme için
        setUser((prev) => ({
          ...prev,
          profilePicture: base64,
        }));
      } catch (error) {
        console.error("Dosya dönüştürme hatası:", error);
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Profil bilgilerini güncelle (profil fotoğrafı dahil)
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data);
      setEditing(false);
    } catch (err) {
      console.error("Profil güncellenirken hata:", err);
      if (err.response?.status === 403) {
        setError("Bu profili düzenleme yetkiniz yok.");
      } else {
        setError("Profil güncellenirken bir hata oluştu.");
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">Kullanıcı bulunamadı.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt="Profil"
            className="profile-image"
          />
          {editing && (
            <div className="profile-image-upload">
              <label htmlFor="profile-picture" className="upload-label">
                <i className="fas fa-camera"></i> Fotoğraf Değiştir
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          )}
        </div>
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>
          {user.userType === "SELLER"
            ? "Satıcı"
            : user.userType === "ADMIN"
            ? "Admin"
            : "Alıcı"}
        </p>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Ad:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Soyad:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>E-posta:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Telefon:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Biyografi:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="save-button">
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="cancel-button"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <label>Ad Soyad:</label>
            <p>
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="info-group">
            <label>E-posta:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-group">
            <label>Telefon:</label>
            <p>{user.phoneNumber || "Belirtilmemiş"}</p>
          </div>
          <div className="info-group">
            <label>Biyografi:</label>
            <p>{user.bio || "Biyografi eklenmemiş"}</p>
          </div>
          <button onClick={handleEdit} className="edit-button">
            Profili Düzenle
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
