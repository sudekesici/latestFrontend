import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 403 hatası için özel işlem
    if (error.response?.status === 403) {
      // Eğer ürün güncelleme isteği ise, sadece hata mesajını göster
      if (
        error.config.method === "put" &&
        error.config.url.includes("/seller/products/")
      ) {
        return Promise.reject(error);
      }

      // Diğer 403 hataları için login sayfasına yönlendir
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
