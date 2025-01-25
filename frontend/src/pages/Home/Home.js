import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Corrected import path
import "./Home.css";
import yogaImage from "../../assets/gtea-tea.gif";

const Home = () => {
  const { user, logout } = useAuth(); // Get logout function
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="illustration-container">
          <div className="illustration-wrapper">
            <img
              src={yogaImage}
              alt="Yoga pose illustration"
              className="illustration-image"
            />
          </div>
        </div>

        <div className="content-container">
          <div className="explore-link">
            Explore different poses.{" "}
            <Link to="/start" className="poses-link">
              Yoga Poses
              <span className="arrow">→</span>
            </Link>
          </div>

          <h1 className="main-heading">
            Perfect Your Yoga Poses with AI-Powered Posture Detection
          </h1>

          <p className="description">
            Get instant feedback on your yoga posture and improve alignment.
            With real-time feedback, you'll receive immediate insights on your
            posture during practice. Our AI-powered posture analysis utilizes
            advanced technology to analyze and enhance your alignment, making it
            suitable for all levels of experience - from beginners to advanced
            practitioners.
          </p>

          <div className="cta-container">
            {!user ? (
              <Link to="/signup" className="signup-button">
                Sign Up
              </Link>
            ) : (
              <button
                className="logout-button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            )}
            <Link to="/howitworks" className="how-it-works">
              How it Works →
            </Link>
          </div>
        </div>
      </div>

      <div className="background-gradient"></div>
    </div>
  );
};

export default Home;
