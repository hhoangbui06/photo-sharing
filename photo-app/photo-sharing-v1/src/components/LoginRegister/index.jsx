import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { postJson } from "../../lib/fetchModelData";
import "./styles.css";

const emptyRegisterForm = {
  login_name: "",
  password: "",
  confirmPassword: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

export function LoginPage({ onLoginSuccess }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    try {
      const user = await postJson("/admin/login", {
        login_name: loginName,
        password,
      });
      onLoginSuccess(user);
    } catch (error) {
      setLoginError(error.message);
    }
  }

  return (
    <div className="login-register single-auth">
      <section className="auth-section">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label>
            Username
            <input value={loginName} onChange={(e) => setLoginName(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </form>
        {loginError && <p className="error-text">{loginError}</p>}
        <p className="hint-text">
        </p>
        <p>
          Chưa có tài khoản? <Link to="/register">Register</Link>
        </p>
      </section>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);

  function updateForm(field, value) {
    setRegisterForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Password nhập lại không khớp.");
      return;
    }

    try {
      await postJson("/user", {
        login_name: registerForm.login_name,
        password: registerForm.password,
        first_name: registerForm.first_name,
        last_name: registerForm.last_name,
        location: registerForm.location,
        description: registerForm.description,
        occupation: registerForm.occupation,
      });
      setMessage("Đăng ký thành công. Đang chuyển về trang đăng nhập...");
      setRegisterForm(emptyRegisterForm);
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="login-register single-auth">
      <section className="auth-section">
        <h1>Đăng ký</h1>
        <form onSubmit={handleRegister}>
          <label>
            Login name
            <input
              value={registerForm.login_name}
              onChange={(e) => updateForm("login_name", e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => updateForm("password", e.target.value)}
            />
          </label>
          <label>
            Nhập lại password
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => updateForm("confirmPassword", e.target.value)}
            />
          </label>
          <label>
            First name
            <input
              value={registerForm.first_name}
              onChange={(e) => updateForm("first_name", e.target.value)}
            />
          </label>
          <label>
            Last name
            <input
              value={registerForm.last_name}
              onChange={(e) => updateForm("last_name", e.target.value)}
            />
          </label>
          <label>
            Location
            <input
              value={registerForm.location}
              onChange={(e) => updateForm("location", e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              value={registerForm.description}
              onChange={(e) => updateForm("description", e.target.value)}
            />
          </label>
          <label>
            Occupation
            <input
              value={registerForm.occupation}
              onChange={(e) => updateForm("occupation", e.target.value)}
            />
          </label>
          <button type="submit">Register Me</button>
        </form>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <p>
          Đã có tài khoản? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
