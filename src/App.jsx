import { useState } from "react";
import "./App.css";
import Header from "./Component/Header";
import HeroSection from "./Component/HeroSection";
import Footer from "./Component/Footer";
import Challenge from "./Component/Challenge";
import About from "./Component/About";
function App() {
  return (
    <>
      <Header></Header>
      <HeroSection></HeroSection>
      <Challenge />
      <About />
      <Footer></Footer>
    </>
  );
}

export default App;
