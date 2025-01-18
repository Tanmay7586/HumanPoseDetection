import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Yoga from "./pages/Yoga/Yoga";
import About from "./pages/About/About";
import Tutorials from "./pages/Tutorials/Tutorials";
import YogaPoses from "./pages/Yoga/YogaPoses"; // Import YogaPoses component
import PoseDetail from "./pages/Yoga/PoseDetail"; // Import PoseDetail component
import Navbar from "./Navbar";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar is placed outside Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Yoga />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutorials" element={<Tutorials />} />
        {/* Add routes for YogaPoses and PoseDetail */}
        <Route path="/yoga-poses" element={<YogaPoses />} />
        <Route path="/pose/:poseName" element={<PoseDetail />} />
      </Routes>
    </Router>
  );
}
