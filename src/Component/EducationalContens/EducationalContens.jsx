import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EducationalContents.css";

const EducationalContents = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchContents();
  }, [page]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/educational-contents?page=${page}&size=10`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.content) {
        if (page === 0) {
          setContents(response.data.content);
        } else {
          setContents((prev) => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
      } else {
        setContents(response.data);
        setHasMore(false);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching contents:", err);
      let errorMessage = "İçerikler yüklenirken bir hata oluştu.";

      if (err.response) {
        switch (err.response.status) {
          case 403:
            errorMessage = "Bu içeriklere erişim izniniz yok.";
            break;
          case 404:
            errorMessage = "İçerikler bulunamadı.";
            break;
          case 500:
            errorMessage = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
            break;
          default:
            errorMessage = err.response.data || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...new Set(contents.map((content) => content.category).filter(Boolean)),
  ];

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button
          className="retry-button"
          onClick={() => {
            setError(null);
            setPage(0);
            fetchContents();
          }}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="educational-contents">
      <div className="contents-header">
        <h1>Eğitim İçerikleri</h1>
        <div className="search-filter">
          <input
            type="text"
            placeholder="İçerik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "Tüm Kategoriler" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {contents.length === 0 && !loading ? (
        <div className="no-content">Henüz içerik bulunmuyor.</div>
      ) : (
        <>
          <div className="contents-grid">
            {filteredContents.map((content) => (
              <div
                key={content.id}
                className="content-card"
                onClick={() => setSelectedContent(content)}
              >
                <img
                  src={
                    content.imageUrl || "https://via.placeholder.com/300x200"
                  }
                  alt={content.title}
                  className="content-image"
                />
                <div className="content-info">
                  <h3>{content.title}</h3>
                  <p>{content.description?.substring(0, 100)}...</p>
                  <span className="category-tag">{content.category}</span>
                </div>
              </div>
            ))}
          </div>

          {loading && <div className="loading">Yükleniyor...</div>}

          {hasMore && !loading && (
            <button className="load-more-button" onClick={loadMore}>
              Daha Fazla Yükle
            </button>
          )}
        </>
      )}

      {selectedContent && (
        <div className="content-modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setSelectedContent(null)}
            >
              ×
            </button>
            <img
              src={
                selectedContent.imageUrl ||
                "https://via.placeholder.com/800x400"
              }
              alt={selectedContent.title}
            />
            <h2>{selectedContent.title}</h2>
            <p>{selectedContent.description}</p>
            <div className="content-details">
              <span className="category-tag">{selectedContent.category}</span>
              <span className="duration">
                {selectedContent.duration} dakika
              </span>
            </div>
            <div className="content-actions">
              <button className="watch-button">İzle</button>
              <button className="save-button">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalContents;
