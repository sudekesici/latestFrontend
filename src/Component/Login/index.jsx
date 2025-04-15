// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ updateUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Giriş yapılıyor:", formData);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        formData
      );

      console.log("Login response:", response.data);

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

        console.log("Stored auth info:", {
          token: response.data.token,
          userType: response.data.userType,
        });

        updateUser();

        // Eğer kullanıcı SELLER ise my-products sayfasına yönlendir
        if (response.data.userType === "SELLER") {
          navigate("/my-products");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage("Giriş yaparken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
      <div className="login-box">
        <h2>Giriş Yap</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
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
          <div className="form-group remember-forgot">
            <label>
              <input type="checkbox" /> Beni hatırla
            </label>
            <Link to="/forgot-password">Şifremi Unuttum</Link>
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
        <div className="social-login">
          <p>veya şununla giriş yap:</p>
          <div className="social-buttons">
            <button className="google-btn">
              <img src="/google-icon.png" alt="Google" width="20" height="20" />
              Google ile Giriş Yap
            </button>
            <button className="facebook-btn">
              <img
                src="/facebook-icon.png"
                alt="Facebook"
                width="20"
                height="20"
              />
              Facebook ile Giriş Yap
            </button>
          </div>
        </div>
        <div className="register-link">
          Henüz üye değil misin? <Link to="/register">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
