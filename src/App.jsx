import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import Login from "./Component/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import ProductList from "./Component/ProductList";
import Profile from "./Component/Profile";
import Admin from "./Component/Admin";
import CategoryPage from "./pages/CategoryPage";
import SellerProducts from "./pages/SellerProducts";
import AddProduct from "./pages/AddProduct";
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
      const response = await axios.get("http://localhost:8080/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error(
        "Kullanıcı profili yüklenirken hata:",
        error.response?.data || error.message
      );
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/v1/categories",
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          : {}
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };

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

        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user?.userType === "ADMIN" ? <Admin /> : <Navigate to="/" />}
        />
        <Route
          path="/my-products"
          element={
            user?.userType === "SELLER" ? (
              <SellerProducts />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/add-product"
          element={
            user?.userType === "SELLER" ? <AddProduct /> : <Navigate to="/" />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
