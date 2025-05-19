import "./HeroSection.css";
import girisimciVideo from "../../assets/img/girisimci-kadinlar.mp4";

function HeroSection() {
  return (
    <div className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src={girisimciVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Kadın Girişimini Destekliyoruz!</h1>
        <p>
          Kadınların emeğiyle güçleniyoruz.
          <br />
          EmekSepeti, evden üretim yapan kadınları destekler, emeklerini görünür
          kılar.
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
