import React from "react";
import Navbar from "../../Navbar";
import "./Home.css";
import yogaImage from "../../assets/gtea-tea.gif";
import YogaPoses from "../Yoga/YogaPoses";

const Home = () => {
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
            <a href="#" className="poses-link">
              Yoga & Gym Poses
              <span className="arrow">→</span>
            </a>
          </div>

          <h1 className="main-heading">
            Perfect Your Poses with AI-Powered Posture Detection
          </h1>

          <p className="description">
            Get instant feedback on your yoga & gym posture and improve
            alignment. With real-time feedback, you will receive immediate
            insights on your posture during practice. Our AI-powered posture
            analysis utilizes advanced technology to analyze and enhance your
            alignment, making it suitable for all levels of experience—from
            beginners to advanced practitioners.
          </p>

          <div className="cta-container">
            <a href="#" className="signup-button">
              Sign Up
            </a>
            <a href="#" className="how-it-works">
              How it Works →
            </a>
          </div>
        </div>
      </div>

      <div className="background-gradient"></div>
      <YogaPoses/>
    </div>
  );
};

export default Home;