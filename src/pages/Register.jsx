import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // axios import et
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı için durum ekledik
  const navigate = useNavigate(); // Yönlendirme için useNavigate

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Şifreler eşleşiyor mu kontrol et
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Şifreler uyuşmuyor.");
      return;
    }

    const user = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      userType: "BUYER",
      phoneNumber: "2837487543",
    };

    try {
      console.log(user);
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register", // Kayıt API'nizi buraya yazın
        user
      );
      console.log(response);

      // Kayıt başarılı ise yönlendir
      if (response.status === 200) {
        setErrorMessage(
          "Kayıt işleminiz başarılı! E-posta adresinizi doğrulamak için lütfen e-posta kutunuzu kontrol edin."
        );

        // Anasayfaya yönlendirme
        setTimeout(() => {
          navigate("/login"); // Anasayfaya yönlendir
        }, 2000); // 2 san
        // Kayıt başarılıysa giriş sayfasına yönlendir
      }
    } catch (error) {
      setErrorMessage(
        "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Kayıt Ol</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {/* Hata mesajını göster */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ad"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Soyad"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifre"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Şifre Tekrar"
              required
            />
          </div>
          <div className="form-group terms">
            <label>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                Kullanım koşullarını ve gizlilik politikasını kabul ediyorum
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={!formData.agreeToTerms}
          >
            Kayıt Ol
          </button>
        </form>
        <div className="social-register">
          <p>veya şununla kayıt ol:</p>
          <div className="social-buttons">
            <button className="google-btn">Google ile Kayıt Ol</button>
            <button className="facebook-btn">Facebook ile Kayıt Ol</button>
          </div>
        </div>
        <div className="login-link">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
