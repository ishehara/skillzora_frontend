import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Navbar from "./Components/Pages/Navbar";
import Footer from "./Components/Pages/Footer";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes below as needed */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/explore" element={<Explore />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
