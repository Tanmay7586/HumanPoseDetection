import React from "react";
import "./HowItWorks.css";
import Image1 from "./image.png";

export default function HowItWorks() {
  return (
    <div className="about-container">
      <h1 className="about-heading">How It Works</h1>
      <div className="about-main">
        <div className="workflow-diagram">
          <img src={Image1} alt="Workflow Diagram" className="workflow-image" />
        </div>
        <div className="text-info">
          <h2>Perfect Your Yoga Poses with AI-Powered Posture Detection</h2>
          <p>
            Our AI-powered posture analysis utilizes advanced technology to
            analyze and enhance your alignment, making it suitable for all
            levels of experience - from beginners to advanced practitioners.
          </p>
          <div className="feature-card">
            <h3>Real-Time Feedback</h3>
            <p>
              Get immediate insights on your posture during practice with our
              AI-powered analysis.
            </p>
          </div>
          <div className="feature-card">
            <h3>All Skill Levels</h3>
            <p>
              Our system is designed to provide valuable feedback for yogis of
              all experience levels.
            </p>
          </div>
          <div className="feature-card">
            <h3>Pose Library</h3>
            <p>
              Explore and master a variety of yoga poses with our comprehensive
              pose library and guided instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
