import React, { useState, useEffect } from "react";
import "./About.css";

const About = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(".stats-section");
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && !isVisible) {
          setIsVisible(true);
          startCounting();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const startCounting = () => {
    const memberDuration = 2000;
    const trainingDuration = 2000;
    const memberIncrement = 35000 / (memberDuration / 16);
    const trainingIncrement = 750 / (trainingDuration / 16);

    let memberCurrent = 0;
    let trainingCurrent = 0;

    const memberInterval = setInterval(() => {
      memberCurrent += memberIncrement;
      if (memberCurrent >= 35000) {
        setMemberCount(35000);
        clearInterval(memberInterval);
      } else {
        setMemberCount(Math.floor(memberCurrent));
      }
    }, 16);

    const trainingInterval = setInterval(() => {
      trainingCurrent += trainingIncrement;
      if (trainingCurrent >= 750) {
        setTrainingCount(750);
        clearInterval(trainingInterval);
      } else {
        setTrainingCount(Math.floor(trainingCurrent));
      }
    }, 16);
  };

  return (
    <div className="about-section">
      <h1>HAKKIMIZDA</h1>
      <h2>EmekSepeti</h2>

      <div className="about-content">
        <p>
          {" "}
          EmekSepeti, evden üretim yapmak isteyen kadınları destekleyen, onların
          el emeği ürünlerini daha geniş kitlelere ulaştırmasını sağlayan bir
          dijital platformdur. Kadınların ekonomik hayatta daha güçlü yer
          alabilmesi için tasarlanan EmekSepeti, girişimci ruhu teşvik eden ve
          dayanışma odaklı bir topluluk oluşturmayı amaçlamaktadır.{" "}
        </p>
        <p>
          {" "}
          “Emeğini Değere Dönüştür” mottosuyla yola çıkan EmekSepeti, kadınların
          yeteneklerini kazanca çevirebileceği bir ekosistem sunar.
          Kullanıcılar, el yapımı yiyeceklerden sanatsal tasarımlara kadar
          birçok ürünü platform üzerinden paylaşabilir, talepler doğrultusunda
          sipariş alabilir ve işlerini büyütebilirler.{" "}
        </p>
        <p>
          {" "}
          Kurulduğu günden bu yana EmekSepeti, üretici kadınları desteklemek
          adına rehberlik, eğitim ve pazarlama desteği sunarak onların ekonomik
          bağımsızlıklarını güçlendirmeye katkı sağlamaktadır. Bugün, yüzlerce
          kadın girişimciyi aynı çatı altında buluşturan bu platform, onların iş
          hayatında daha görünür olmasını sağlamak için çalışmalarına devam
          etmektedir.{" "}
        </p>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">{memberCount.toLocaleString()}</span>
          <span className="stat-label">Üye Sayısı</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{trainingCount.toLocaleString()}</span>
          <span className="stat-label">Eğitim Sayısı</span>
        </div>
      </div>
    </div>
  );
};

export default About;
