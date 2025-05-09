// src/App.js (update with SignUp route)

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./Components/Pages/Home";
import Navbar from "./Components/Pages/Navbar";
import Footer from "./Components/Pages/Footer";
import Login from "./Components/Pages/Login";
import SignUp from "./Components/Pages/Auth/Signup";
import ProgressChecker from "./Components/Pages/ProgressChecker/ProgressChecker";
import AddProgress from "./Components/Pages/ProgressChecker/AddProgress";
import UpdateProgress from "./Components/Pages/ProgressChecker/UpdateProgress";
import PostList from "./Components/Pages/Post/PostList";
import CommentSection from "./Components/Pages/Comment/CommentSection";
import AddComment from "./Components/Pages/Comment/AddComment";
import Profile from "./Components/Pages/Profile";
import UpdatePost from "./Components/Pages/Post/UpdatePost";
import AddPost from "./Components/Pages/Post/AddPost";
import PostDetail from "./Components/Pages/Post/PostDetail";
import BookmarksList from "./Components/Pages/Bookmark/BookmarksList";
import OAuth2RedirectHandler from "./Components/Pages/Auth/OAuth2RedirectHandler";

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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/ProgressChecker" element={<ProgressChecker />} />
            <Route path="/AddProgress" element={<AddProgress />} />
            <Route path="/UpdateProgress" element={<UpdateProgress />} />
            <Route path="/PostList" element={<PostList />} />
            <Route path="/CommentSection" element={<CommentSection />} />
            <Route path="/add-comment" element={<AddComment />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/bookmarks" element={<BookmarksList />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;