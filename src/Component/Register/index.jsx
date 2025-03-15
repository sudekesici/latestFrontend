import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = ({ updateUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: "user",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        await updateUser(); // User state'ini güncelle
        navigate("/"); // Ana sayfaya yönlendir
      } else {
        setErrorMessage("Kayıt olurken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Kayıt başarısız:", error);
      setErrorMessage(
        error.response?.data?.message || "Kayıt işlemi başarısız oldu."
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Kayıt Ol</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Adınız"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Soyadınız"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta adresiniz"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifreniz"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Telefon numaranız"
              required
            />
          </div>
          <div className="form-group">
            <select
              id="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="user">Kullanıcı</option>
              <option value="company">Şirket</option>
            </select>
          </div>
          <button type="submit" className="login-button">
            Kayıt Ol
          </button>
        </form>
        <div className="social-login">
          <p>veya şununla kayıt ol:</p>
          <div className="social-buttons">
            <button className="google-btn">
              <img src="/google-icon.png" alt="Google" width="20" height="20" />
              Google ile Kayıt Ol
            </button>
            <button className="facebook-btn">
              <img
                src="/facebook-icon.png"
                alt="Facebook"
                width="20"
                height="20"
              />
              Facebook ile Kayıt Ol
            </button>
          </div>
        </div>
        <div className="register-link">
          Zaten üye misin? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
