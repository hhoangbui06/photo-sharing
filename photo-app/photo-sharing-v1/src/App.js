import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import fetchModel, { postJson } from "./lib/fetchModelData";
import { LoginPage, RegisterPage } from "./components/LoginRegister";
import TopBar from "./components/TopBar";
import UserComments from "./components/UserComments";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

function ProtectedRoute({ checkingLogin, currentUser, children }) {
  if (checkingLogin) {
    return <p>Đang kiểm tra đăng nhập...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ checkingLogin, currentUser, children }) {
  if (checkingLogin) {
    return <p>Đang kiểm tra đăng nhập...</p>;
  }

  if (currentUser) {
    return <Navigate to={`/users/${currentUser._id}`} replace />;
  }

  return children;
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [userListRefreshKey, setUserListRefreshKey] = useState(0);
  const navigate = useNavigate();

  function refreshUserCounts() {
    // Tăng key để UserList tự fetch lại số ảnh và số bình luận.
    setUserListRefreshKey((current) => current + 1);
  }

  useEffect(() => {

    async function loadCurrentUser() {
      try {
        const user = await fetchModel("/admin/currentUser");
          setCurrentUser(user);
      } catch (error) {
          setCurrentUser(null);
      } finally {
          setCheckingLogin(false);
      }
    }

    loadCurrentUser();
  }, []);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    refreshUserCounts();
    navigate(`/users/${user._id}`);
  }

  async function handleLogout() {
    try {
      await postJson("/admin/logout", {});
    } catch (error) {
      // Nếu session đã hết hạn, frontend vẫn quay về login.
    }
    setCurrentUser(null);
    navigate("/login");
  }

  function handlePhotoUploaded(photo) {
    refreshUserCounts();
    navigate(`/photos/${photo.user_id}/${photo._id}`);
  }

  return (
    <div className="app">
      <TopBar
        advancedEnabled={advancedEnabled}
        currentUser={currentUser}
        onAdvancedChange={setAdvancedEnabled}
        onLogout={handleLogout}
        onPhotoUploaded={handlePhotoUploaded}
      />

      <main className={currentUser ? "main-layout" : "main-layout login-layout"}>
        {currentUser && (
          <aside className="sidebar">
            <UserList refresh={userListRefreshKey} />
          </aside>
        )}

        <section className="content">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/"
              element={
                checkingLogin ? (
                  <p>Đang kiểm tra đăng nhập...</p>
                ) : (
                  <Navigate to={currentUser ? `/users/${currentUser._id}` : "/login"} replace />
                )
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <UserList refresh={userListRefreshKey} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId"
              element={
                <ProtectedRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comments/:userId"
              element={
                <ProtectedRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <UserComments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photos/:userId"
              element={
                <ProtectedRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <UserPhotos
                    advancedEnabled={advancedEnabled}
                    onDataChanged={refreshUserCounts}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/photos/:userId/:photoId"
              element={
                <ProtectedRoute checkingLogin={checkingLogin} currentUser={currentUser}>
                  <UserPhotos
                    advancedEnabled={advancedEnabled}
                    onDataChanged={refreshUserCounts}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
