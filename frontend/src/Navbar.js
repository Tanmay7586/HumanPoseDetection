import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsDropdownOpen((prev) => !prev);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.email) return "GU";
    const usernamePart = user.email.split("@")[0];
    return usernamePart[0].toUpperCase();
  };

  return (
    <div className="navbar1">
      <div className="navbar" >
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
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <div className="user-initials" onMouseDown={(e) => toggleDropdown(e)}>
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
                <div
                  className="dropdown-item"
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                    navigate("/");
                  }}
                >
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
    </div>
  );
};

export default Navbar;
