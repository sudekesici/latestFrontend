import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Giriş yapılıyor:", formData);
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
