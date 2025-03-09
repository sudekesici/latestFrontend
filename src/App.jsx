import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer"; // Footer import ediliyor
import Home from "./pages/Home";
import Login from "./Component/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import ProductList from "./Component/ProductList";
import TestPage from "./pages/TestPage";
import CategoryPage from "./pages/CategoryPage"; // Yeni sayfa import ediliyor
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [categories, setCategories] = useState([]); // Kategorileri saklayacak state
  const navigate = useNavigate(); // useNavigate hook'u

  const data = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data); // Kategorileri state'e kaydediyoruz
    } catch (error) {
      console.error("API'den veri alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    data(); // component mount olduğunda veriyi çekiyoruz
  }, []);

  // Dropdown seçiminde yönlendirme fonksiyonu
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    if (categoryId) {
      navigate(`/categories/${categoryId}`); // Seçilen kategoriye yönlendiriyoruz
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />{" "}
        {/* Kategori sayfasına yönlendiren rota */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route
                  path="/categories"
                  element={
                    <div>
                      <h2>Kategoriler:</h2>
                      {/* Dropdown menüsü */}
                      <select
                        onChange={handleCategoryChange}
                        style={{ padding: "10px", fontSize: "16px" }}
                      >
                        <option value="">Bir kategori seçin</option>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option>Yükleniyor...</option>
                        )}
                      </select>
                    </div>
                  }
                />
              </Routes>
              <Footer /> {/* Footer'a kategori verisi geçiyoruz */}
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
