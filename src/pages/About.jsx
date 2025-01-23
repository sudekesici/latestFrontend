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
    const memberDuration = 2000; // 2 saniye
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
          Türkiye'nin ilk ve tek dijital network ağı olan Girişimci Kadınlar
          Grubu, 2017 yılında Ülkü Hür tarafından kurulmuştur.
        </p>
        <p>
          "Kendine İnan Hayallerine Sahip Çık" sloganıyla birleşen Girişimci
          Kadınlar Grubu; gönüllülük esasına dayalıdır ve kadınlarımızın çalışma
          hayatında güçlenmesini hedefler. Her geçen gün büyüyen, kadınların
          ticarette aktif bir şekilde yer alabilmesi için çalışan, kadın
          girişimcilerin güçlenmesi için eğitim, rehberlik, koçluk ve network
          desteği sağlayan ve organizasyonlar düzenleyen bir kadın topluluğudur.
        </p>
        <p>
          Kuruluşundan bu yana GKG misyonu ve vizyonu doğrultusunda, Türkiye
          başta olmak üzere tüm dünya genelinde 35.000'e yakın kadın girişimci
          üyeyi aynı çatı altında buluşturmuş; kadın girişimcilerin karar verici
          ve ekonomik hayatta daha güçlü pozisyonlarda yer almasını sağlamak ve
          desteklemek için durmaksızın çalışmıştır.
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
