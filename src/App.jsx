import { Routes, Route } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import Login from "./Component/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import ProductList from "./Component/ProductList";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/test" element={<TestPage />} />
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
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
