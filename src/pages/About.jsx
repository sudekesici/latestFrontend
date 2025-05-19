import React, { useState, useEffect } from "react";
import "./About.css";
import kalpKolaj from "../assets/img/kalp-kolaj.png";

const About = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(".about-stats-row");
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
    const duration = 2000;
    const memberTarget = 35000;
    const trainingTarget = 750;
    const meetingTarget = 190;
    const projectTarget = 70;

    const memberIncrement = memberTarget / (duration / 16);
    const trainingIncrement = trainingTarget / (duration / 16);
    const meetingIncrement = meetingTarget / (duration / 16);
    const projectIncrement = projectTarget / (duration / 16);

    let memberCurrent = 0,
      trainingCurrent = 0,
      meetingCurrent = 0,
      projectCurrent = 0;

    const memberInterval = setInterval(() => {
      memberCurrent += memberIncrement;
      if (memberCurrent >= memberTarget) {
        setMemberCount(memberTarget);
        clearInterval(memberInterval);
      } else {
        setMemberCount(Math.floor(memberCurrent));
      }
    }, 16);

    const trainingInterval = setInterval(() => {
      trainingCurrent += trainingIncrement;
      if (trainingCurrent >= trainingTarget) {
        setTrainingCount(trainingTarget);
        clearInterval(trainingInterval);
      } else {
        setTrainingCount(Math.floor(trainingCurrent));
      }
    }, 16);

    const meetingInterval = setInterval(() => {
      meetingCurrent += meetingIncrement;
      if (meetingCurrent >= meetingTarget) {
        setMeetingCount(meetingTarget);
        clearInterval(meetingInterval);
      } else {
        setMeetingCount(Math.floor(meetingCurrent));
      }
    }, 16);

    const projectInterval = setInterval(() => {
      projectCurrent += projectIncrement;
      if (projectCurrent >= projectTarget) {
        setProjectCount(projectTarget);
        clearInterval(projectInterval);
      } else {
        setProjectCount(Math.floor(projectCurrent));
      }
    }, 16);
  };

  return (
    <section className="about-section">
      <div className="about-image-container">
        <img
          src={kalpKolaj}
          alt="EmekSepeti Kadınlar Kolaj"
          className="about-heart-collage"
        />
      </div>
      <div className="about-content-container">
        <div className="about-card">
          <h1>HAKKIMIZDA</h1>
          <h2>EmekSepeti – Kadının Emeği, Dijitalde Değer Buluyor</h2>
          <div className="about-text">
            <p>
              EmekSepeti, evden üretim yapan kadınların el emeği ürünlerini
              dijital ortamda satabilecekleri, aynı zamanda müşteri taleplerine
              yanıt verebilecekleri bir platformdur. Kadınların ekonomik hayatta
              daha aktif rol almasını desteklemek amacıyla kurulmuş gönüllü bir
              girişimdir.
            </p>
            <p>
              "Kendine İnan, Emeğine Güven" sloganıyla yola çıkan EmekSepeti;
              rehberlik, eğitim, yapay zeka destekli öneri sistemleri ve güçlü
              bir dijital altyapı ile kadın üreticilere destek olur.
            </p>
            <p>
              Bugün birçok kadın üretici, EmekSepeti aracılığıyla ürünlerini
              tanıtmakta ve emeğini kazanca dönüştürmektedir. Biz, kadın
              emeğinin dijitalde değer kazanması için çalışmaya devam ediyoruz.
            </p>
          </div>
          <div className="about-stats-row">
            <div className="about-stat">
              <span className="about-stat-number">
                {memberCount.toLocaleString()}+
              </span>
              <span className="about-stat-label">Üye Sayısı</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">{trainingCount}+</span>
              <span className="about-stat-label">Eğitim</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">{meetingCount}+</span>
              <span className="about-stat-label">Toplantı</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">{projectCount}+</span>
              <span className="about-stat-label">
                Sosyal Sorumluluk Projesi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
