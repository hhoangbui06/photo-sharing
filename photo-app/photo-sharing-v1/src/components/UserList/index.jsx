import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList({ refresh = 0 }) {
  const hasLoadedRef = useRef(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setError("");
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      }

      try {
        const data = await fetchModel("/user/list");
        setUsers(data);
        hasLoadedRef.current = true;
      } catch (err) {
        setError("Không tải được danh sách người dùng.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [refresh]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="user-list">
      <h2>Userlist</h2>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <Link className="user-name-link" to={`/users/${user._id}`}>
                {user.first_name} {user.last_name}
              </Link>

              <div className="user-counts">
                <Link className="count-bubble photo-count" title="Số ảnh" to={`/photos/${user._id}`}>
                  {user.photo_count || 0} photos
                </Link>
                <Link className="count-bubble comment-count"
                  title="Số bình luận đã viết"
                  to={`/comments/${user._id}`}
                >
                  {user.comment_count || 0} comments
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
