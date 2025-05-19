import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./Login.css";
import hizlabuyu from "../../assets/img/hizlaBuyuu.png";
import odeme from "../../assets/img/odeme.png";

const Login = ({ updateUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            email: response.data.email,
            userType: response.data.userType,
            name: response.data.name,
          })
        );

        updateUser();

        if (response.data.userType === "SELLER") {
          navigate("/seller-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage("Giriş yaparken bir sorun oluştu.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin."
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
      <div className="login-main-content">
        <div className="login-form-section">
          <div className="login-box">
            <h2>Giriş Yap</h2>
            {errorMessage && (
              <div className="login-error-message">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta adresiniz"
                  required
                />
              </div>
              <div className="login-form-group">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifreniz"
                  required
                />
              </div>
              <div className="login-form-group login-remember-forgot">
                <label>
                  <input type="checkbox" /> Beni hatırla
                </label>
                <Link to="/forgot-password">Şifremi Unuttum</Link>
              </div>
              <button type="submit" className="login-button">
                Giriş Yap
              </button>
            </form>
            <div className="login-social">
              <div className="login-divider">veya şununla giriş yap:</div>
              <div className="login-social-buttons">
                <button className="login-google-btn">
                  <FaGoogle className="login-social-icon" />
                  Google ile Giriş Yap
                </button>
                <button className="login-facebook-btn">
                  <FaFacebookF className="login-social-icon" />
                  Facebook ile Giriş Yap
                </button>
              </div>
            </div>
            <div className="login-register-link">
              Henüz üye değil misin? <Link to="/register">Kayıt Ol</Link>
            </div>
          </div>
        </div>
        <div className="login-image-section">
          <img src={hizlabuyu} alt="Hızla Büyü" className="hizlabuyu-image" />
        </div>
      </div>
      <div className="login-bottom-image">
        <img src={odeme} alt="Ödeme" className="odeme-image" />
      </div>
    </div>
  );
};

export default Login;
