import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./Components/Pages/Home";
import Navbar from "./Components/Pages/Navbar";
import Footer from "./Components/Pages/Footer";
import Login from "./Components/Pages/Login";
import ProgressChecker from "./Components/Pages/ProgressChecker/ProgressChecker";
import AddProgress from "./Components/Pages/ProgressChecker/AddProgress";
import UpdateProgress from "./Components/Pages/ProgressChecker/UpdateProgress";
import PostList from "./Components/Pages/Post/PostList";
import CommentSection from "./Components/Pages/Comment/CommentSection";
import Profile from "./Components/Pages/Profile";

import "./App.css";

function App() {
  return (
    <Router>
      {/* Wrapper for full height layout */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Navbar />

        {/* Main content flexes to fill space */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ProgressChecker" element={<ProgressChecker />} />
            <Route path="/AddProgress" element={<AddProgress />} />
            <Route path="/UpdateProgress" element={<UpdateProgress />} />
            <Route path="/PostList" element={<PostList />} />
            <Route path="/CommentSection" element={<CommentSection />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;
