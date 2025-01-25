import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Initialize with null
  const navigate = useNavigate();

  useEffect(() => {
    // Safely get and parse user data
    const rawUserData = localStorage.getItem("userData");

    try {
      const userData = rawUserData ? JSON.parse(rawUserData) : null;
      if (userData?.email) {
        setUserEmail(userData.email);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("userData"); // Clear invalid data
    }
  }, []);

  const getInitials = () => {
    if (!userEmail) return "GU";
    const usernamePart = userEmail.split("@")[0];
    return usernamePart[0].toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUserEmail(null); // Clear local state
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        <h2>PosturePerfect</h2>
      </Link>
      <div className="nav-links">
        <Link to="/start" className="nav-link">
          Yoga Poses
        </Link>
        <Link to="/howitworks" className="nav-link">
          How It Works
        </Link>

        {userEmail ? (
          <div className="user-menu">
            <div
              className="user-initials"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getInitials()}
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/reset-password"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Reset Password
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
