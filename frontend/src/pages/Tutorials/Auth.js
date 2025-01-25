import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const payload = {
        email,
        password,
        ...(!isLogin && { confirmPassword }),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${endpoint}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        navigate("/");
      }
    } catch (err) {
      // Enhanced error handling
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Authentication failed. Please try again.";
      setError(errorMessage);

      // Clear invalid credentials
      if (err.response?.status === 401) {
        localStorage.removeItem("userData");
      }
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
                minLength="6"
              />
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "New user? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="toggle-link"
          >
            {isLogin ? "Create account" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
