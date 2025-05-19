import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./Register.css";
import hizlabuyu from "../../assets/img/hizlaBuyuu.png";
import odeme from "../../assets/img/odeme.png";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "BUYER",
    agreeToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Şifreler uyuşmuyor.");
      return;
    }

    const user = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
      phoneNumber: "2837487543",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        user
      );

      if (response.status === 200) {
        setErrorMessage(
          "Kayıt işleminiz başarılı! E-posta adresinizi doğrulamak için lütfen e-posta kutunuzu kontrol edin."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(
        "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-main-content">
        <div className="register-form-section">
          <div className="register-box">
            <h2>Kayıt Ol</h2>
            {errorMessage && (
              <div className="register-error-message">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="register-form-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ad"
                  required
                />
              </div>
              <div className="register-form-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Soyad"
                  required
                />
              </div>
              <div className="register-form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta"
                  required
                />
              </div>
              <div className="register-form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifre"
                  required
                />
              </div>
              <div className="register-form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifre Tekrar"
                  required
                />
              </div>
              <div className="register-form-group">
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  className="register-user-type-select"
                >
                  <option value="BUYER">Alıcı</option>
                  <option value="SELLER">Satıcı</option>
                </select>
              </div>
              <div className="register-form-group register-terms">
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
            <div className="register-social">
              <div className="register-divider">veya şununla kayıt ol:</div>
              <div className="register-social-buttons">
                <button className="register-google-btn">
                  <FaGoogle className="register-social-icon" />
                  Google ile Kayıt Ol
                </button>
                <button className="register-facebook-btn">
                  <FaFacebookF className="register-social-icon" />
                  Facebook ile Kayıt Ol
                </button>
              </div>
            </div>
            <div className="register-login-link">
              Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
            </div>
          </div>
        </div>
        <div className="register-image-section">
          <img src={hizlabuyu} alt="Hızla Büyü" className="hizlabuyu-image" />
        </div>
      </div>
      <div className="register-bottom-image">
        <img src={odeme} alt="Ödeme" className="odeme-image" />
      </div>
    </div>
  );
};

export default Register;
