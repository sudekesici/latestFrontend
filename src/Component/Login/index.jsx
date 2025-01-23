import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giriş işlemleri buraya gelecek
    console.log("Giriş yapılıyor:", { email, password });
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Giriş Yap</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <button className="google-btn">Google ile Giriş Yap</button>
              <button className="facebook-btn">Facebook ile Giriş Yap</button>
            </div>
          </div>
          <div className="register-link">
            Henüz üye değil misin? <Link to="/register">Kayıt Ol</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
