import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/profile",
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
          bio: response.data.bio || "",
          phoneNumber: response.data.phoneNumber || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Profil bilgileri yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/api/v1/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ ...user, ...formData });
      setEditing(false);
    } catch (err) {
      setError("Profil güncellenirken bir hata oluştu.");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user?.profileImage || "/default-avatar.png"} alt="Profil" />
        </div>
        <h2>
          {user?.firstName} {user?.lastName}
        </h2>
        <p>{user?.userType === "SELLER" ? "Satıcı" : "Alıcı"}</p>
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
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="info-group">
            <label>E-posta:</label>
            <p>{user?.email}</p>
          </div>
          <div className="info-group">
            <label>Telefon:</label>
            <p>{user?.phoneNumber || "Belirtilmemiş"}</p>
          </div>
          <div className="info-group">
            <label>Biyografi:</label>
            <p>{user?.bio || "Biyografi eklenmemiş"}</p>
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
