import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PoseDetail.css";

const PoseDetail = () => {
  const location = useLocation();
  const pose = location.state.pose;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="pose-detail-container">
      <button className="back-button" onClick={handleBackClick}>
        Back to Exercises
      </button>
      <h1>{pose.name}</h1>
      <p>{pose.description}</p>

      <div className="advantages-section">
        <h2>Advantages</h2>
        <ul>
          {pose.advantages.map((advantage, index) => (
            <li key={index}>{advantage}</li>
          ))}
        </ul>
      </div>

      <div className="steps-section">
        <h2>How to Perform</h2>
        <ol>
          {pose.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <button className="start-exercise-button">Start Exercise</button>
    </div>
  );
};

export default PoseDetail;
