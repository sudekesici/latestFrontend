import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import Login from "./Component/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import ProductList from "./Component/ProductList";
import TestPage from "./pages/TestPage";
import Profile from "./Component/Profile";
import Admin from "./Component/Admin";
import CategoryPage from "./pages/CategoryPage";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    }
    fetchCategories();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Kullanıcı profili yüklenirken hata:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };

  // User state'ini güncelleyecek fonksiyon
  const updateUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetchUserProfile(token);
    }
  };

  return (
    <div className="App">
      <Header user={user} categories={categories} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login updateUser={updateUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user?.userType === "ADMIN" ? <Admin /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
