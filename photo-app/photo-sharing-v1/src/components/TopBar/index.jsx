import React, { useEffect, useRef, useState } from "react";
import { matchPath, useLocation } from "react-router-dom";

import fetchModel, { postForm } from "../../lib/fetchModelData";
import "./styles.css";

function TopBar({
  advancedEnabled,
  currentUser,
  onAdvancedChange,
  onLogout,
  onPhotoUploaded,
}) {
  const fileInputRef = useRef(null);
  const location = useLocation();
  const [title, setTitle] = useState("Chia sẻ ảnh");
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    async function loadTitle() {
      if (!currentUser) {
        setTitle("");
        return;
      }

      const photoMatch =
        matchPath("/photos/:userId/:photoId", location.pathname) ||
        matchPath("/photos/:userId", location.pathname);
      const commentMatch = matchPath("/comments/:userId", location.pathname);
      const userMatch = matchPath("/users/:userId", location.pathname);
      const userId =
        photoMatch?.params.userId ||
        commentMatch?.params.userId ||
        userMatch?.params.userId;

      if (!userId) {
        setTitle("Người dùng");
        return;
      }

      try {
        const user = await fetchModel(`/user/${userId}`);
        if (!user) {
          return;
        }

        const fullName = `${user.first_name} ${user.last_name}`;
        if (photoMatch) {
          setTitle(`Photos of ${fullName}`);
        } else if (commentMatch) {
          setTitle(`Comments of ${fullName}`);
        } else {
          setTitle(fullName);
        }
      } catch (error) {
        console.log(error)
      }
    }

    loadTitle();

  }, [currentUser, location.pathname]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const photo = await postForm("/photos/new", formData);
      setUploadMessage("Upload ảnh thành công.");
      onPhotoUploaded(photo);
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-name">{currentUser ? "Bùi Huy Hoàng - B23DCKH043" : "B23DCKH043"}</div>

      <div className="topbar-right">
        {currentUser && (
          <>
            <span>Hi {currentUser.first_name}</span>
            <button type="button" onClick={() => fileInputRef.current.click()}>
              Add Photo
            </button>
            <input
              ref={fileInputRef}
              className="hidden-file-input"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
            <button type="button" onClick={onLogout}>
              Logout
            </button>
            <label className="advanced-toggle">
              <input
                type="checkbox"
                checked={advancedEnabled}
                onChange={(e) => onAdvancedChange(e.target.checked)}
              />
              Advanced Feature
            </label>
          </>
        )}
        {title && <div className="topbar-title">{title}</div>}
        {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
      </div>
    </header>
  );
}

export default TopBar;
