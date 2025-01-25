import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Yoga from "./pages/Yoga/Yoga";
import HowItWorks from "./pages/About/HowItWorks";
import Signup from "./pages/Tutorials/Signup";
import Navbar from "./Navbar";
import ResetPassword from "./pages/Tutorials/ResetPassword";
import { AuthProvider } from "./AuthContext";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Navbar is placed outside Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Yoga />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
