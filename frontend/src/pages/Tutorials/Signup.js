import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("API URL:", process.env.REACT_APP_API_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic client-side validation
      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const payload = isLogin
        ? { email, password }
        : { email, password, confirmPassword };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${endpoint}`,
        payload
      );
      // Store user data and token
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      localStorage.setItem("authToken", response.data.token);

      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="auth-heading">{isLogin ? "Log In" : "Sign Up"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength="6"
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "New user? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{ cursor: "pointer" }}
          >
            {isLogin ? "Create account" : "Log in instead"}
          </span>
        </p>
      </div>
    </div>
  );
}
