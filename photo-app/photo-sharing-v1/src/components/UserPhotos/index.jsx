import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import fetchModel, { imageUrl, postJson } from "../../lib/fetchModelData";
import "./styles.css";

function formatDate(dateText) {
  return new Date(dateText).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PhotoCard({ onCommentAdded, photo }) {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  async function handleAddComment(e) {
    e.preventDefault();
    setError("");

    try {
      await postJson(`/commentsOfPhoto/${photo._id}`, { comment: commentText });
      setCommentText("");
      onCommentAdded();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <article className="photo-card">
      <img src={imageUrl(photo.file_name)} alt={photo.file_name} />
      <p className="photo-time">Ngày tạo: {formatDate(photo.date_time)}</p>

      <section className="comment-list">
        <h3>Bình luận</h3>
        {photo.comments && photo.comments.length > 0 ? (
          photo.comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <p className="comment-meta">
                {formatDate(comment.date_time)} by{" "}
                <Link to={`/users/${comment.user._id}`}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
              </p>
              <p>{comment.comment}</p>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận.</p>
        )}
      </section>

      <form className="add-comment-form" onSubmit={handleAddComment}>
        <label>
          <b>Comment</b>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </label>
        <button type="submit">Add Comment</button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </article>
  );
}

function UserPhotos({ advancedEnabled, onDataChanged = () => {} }) {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(advancedEnabled);

  useEffect(() => {
    setShowAdvanced(advancedEnabled);
  }, [advancedEnabled]);

  useEffect(() => {
    async function loadPhotos() {
      setError("");
      setIsLoading(true);
      setPhotos([]);

      try {
        const data = await fetchModel(`/photosOfUser/${userId}`);
          setPhotos(data);
      } catch (err) {
          setError("Không tải được ảnh của người dùng.");

      } finally {
          setIsLoading(false);
      }
    }

    loadPhotos();

  }, [userId]);

  async function reloadAfterComment() {
    try {
      const data = await fetchModel(`/photosOfUser/${userId}`);
      setPhotos(data);
      onDataChanged();
    } catch (err) {
      setError("Không tải lại được danh sách bình luận.");
    }
  }

  const currentIndex = useMemo(() => {
    if (!photoId) {
      return 0;
    }

    const foundIndex = photos.findIndex((photo) => photo._id === photoId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [photoId, photos]);

  useEffect(() => {
    if (photos.length === 0) {
      return;
    }

    if (showAdvanced && !photoId) {
      navigate(`/photos/${userId}/${photos[0]._id}`, { replace: true });
      return;
    }

    if (!showAdvanced && photoId) {
      navigate(`/photos/${userId}`, { replace: true });
    }
  }, [navigate, photoId, photos, showAdvanced, userId]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (photos.length === 0) {
    return <p>Người dùng này chưa đăng ảnh nào.</p>;
  }

  if (showAdvanced) {
    const currentPhoto = photos[currentIndex];
    const previousPhoto = photos[currentIndex - 1];
    const nextPhoto = photos[currentIndex + 1];

    return (
      <div className="photos-view">
        <div className="stepper">
          <button
            type="button"
            disabled={!previousPhoto}
            onClick={() => navigate(`/photos/${userId}/${previousPhoto._id}`)}
          >
            Trước
          </button>
          <span>
            Ảnh {currentIndex + 1} / {photos.length}
          </span>
          <button
            type="button"
            disabled={!nextPhoto}
            onClick={() => navigate(`/photos/${userId}/${nextPhoto._id}`)}
          >
            Sau
          </button>
        </div>

        <PhotoCard photo={currentPhoto} onCommentAdded={reloadAfterComment} />
      </div>
    );
  }

  return (
    <div className="photos-view">
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} onCommentAdded={reloadAfterComment} />
      ))}
    </div>
  );
}

export default UserPhotos;
