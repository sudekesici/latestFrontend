import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SuccessStories.css";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line
  }, [page]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/success-stories?page=${page}&size=5`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.content) {
        if (page === 0) {
          setStories(response.data.content);
        } else {
          setStories((prev) => [...prev, ...response.data.content]);
        }
        setHasMore(!response.data.last);
      } else {
        setStories(response.data);
        setHasMore(false);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Başarı hikayeleri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (storyId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/success-stories/${storyId}/comments`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleStoryClick = async (story) => {
    setSelectedStory(story);
    await fetchComments(story.id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/success-stories/${selectedStory.id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button
          className="retry-button"
          onClick={() => {
            setError(null);
            setPage(0);
            fetchStories();
          }}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // Profil fotoğrafı için yardımcı fonksiyon
  const getProfilePic = (author) =>
    author?.profilePicture
      ? `http://localhost:8080/profiles/${author.profilePicture}`
      : "/default-avatar.png";

  return (
    <div className="success-stories">
      <div className="stories-header">
        <h1>Başarı Hikayeleri</h1>
        <p>Diğer kullanıcıların deneyimlerini keşfedin</p>
      </div>

      <div className="stories-container">
        {stories.map((story) => (
          <div
            key={story.id}
            className="story-card"
            onClick={() => handleStoryClick(story)}
          >
            <img
              src={story.imageUrl || "https://via.placeholder.com/400x250"}
              alt={story.title}
              className="story-image"
            />
            <div className="story-content">
              <h2>{story.title}</h2>
              <p className="story-excerpt">
                {story.content.substring(0, 150)}...
              </p>
              <div className="story-meta">
                <img
                  className="story-author-avatar"
                  src={getProfilePic(story.author)}
                  alt="Profil"
                />
                <span className="author">
                  {story.author?.firstName} {story.author?.lastName}
                </span>
                <span className="date">
                  {new Date(story.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && <div className="loading">Yükleniyor...</div>}

        {hasMore && !loading && (
          <button className="load-more-button" onClick={loadMore}>
            Daha Fazla Yükle
          </button>
        )}
      </div>

      {selectedStory && (
        <div className="story-detail-overlay">
          <div className="story-detail">
            <button
              className="close-button"
              onClick={() => setSelectedStory(null)}
            >
              ×
            </button>
            <img
              src={
                selectedStory.imageUrl || "https://via.placeholder.com/800x400"
              }
              alt={selectedStory.title}
              className="story-detail-image"
            />
            <h2>{selectedStory.title}</h2>
            <div className="story-meta">
              <img
                className="story-author-avatar"
                src={getProfilePic(selectedStory.author)}
                alt="Profil"
              />
              <span className="author">
                {selectedStory.author?.firstName}{" "}
                {selectedStory.author?.lastName}
              </span>
              <span className="date">
                {new Date(selectedStory.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div className="story-content-full">{selectedStory.content}</div>

            <div className="comments-section">
              <h3>Yorumlar</h3>
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="comment-input"
                />
                <button type="submit" className="comment-submit">
                  Yorum Yap
                </button>
              </form>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <img
                        className="comment-author-avatar"
                        src={getProfilePic(comment.author)}
                        alt="Profil"
                      />
                      <span className="comment-author">
                        {comment.author?.firstName} {comment.author?.lastName}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
