import { Routes, Route } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./pages/Home";
import Login from "./Component/Login";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenge" element={<Challenge />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
