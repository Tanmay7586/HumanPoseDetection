import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <h2>PosturePerfect</h2>
      </div>
      <div className="nav-links">
        <Link to="/start" className="nav-link">
          Yoga Poses
        </Link>
        <Link to="/about" className="nav-link">
          How It Works
        </Link>
        <Link to="/tutorials" className="nav-link">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
