import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      setError("");
      setUser(null);

      try {
        const data = await fetchModel(`/user/${userId}`);
          setUser(data);
      } catch (err) {
          setError("Không tải được thông tin người dùng.");
      }
    }

    loadUser();

  }, [userId]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <article className="user-detail">
      <h1>
        {user.first_name} {user.last_name}
      </h1>
      <p>
        <strong>Location:</strong> {user.location}
      </p>
      <p>
        <strong>Occupation:</strong> {user.occupation}
      </p>
      <p>
        <strong>Description:</strong> {user.description}
      </p>

      <Link className="button-link" to={`/photos/${user._id}`}>
        See Photos
      </Link>
    </article>
  );
}

export default UserDetail;
