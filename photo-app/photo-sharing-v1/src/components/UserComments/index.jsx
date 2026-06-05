import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import fetchModel, { imageUrl } from "../../lib/fetchModelData";
import "./styles.css";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadComments() {
      setError("");
      setIsLoading(true);
      setComments([]);

      try {
        const data = await fetchModel(`/commentsOfUser/${userId}`);
        setComments(data);
      } catch (err) {
          setError("Không tải được bình luận của người dùng.");
      } finally {
          setIsLoading(false);
      }
    }

    loadComments();

  }, [userId]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (comments.length === 0) {
    return <p>Người dùng này chưa viết bình luận nào.</p>;
  }

  return (
    <div className="user-comments">
      <h1>Bình luận đã viết</h1>

      {comments.map((item) => (
        <Link
          className="comment-preview"
          key={item._id}
          to={`/photos/${item.photo.user_id}/${item.photo._id}`}
        >
          <img src={imageUrl(item.photo.file_name)} alt={item.photo.file_name} />
          <p>{item.comment}</p>
        </Link>
      ))}
    </div>
  );
}

export default UserComments;
