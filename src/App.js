import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Navbar from "./Components/Pages/Navbar";
import Footer from "./Components/Pages/Footer";
import Login from "./Components/Pages/Login";
import ProgressChecker from "./Components/Pages/ProgressChecker/ProgressChecker";
import AddProgress from "./Components/Pages/ProgressChecker/AddProgress";
import UpdateProgress from "./Components/Pages/ProgressChecker/UpdateProgress";
import PostList from "./Components/Pages/Post/PostList";
import CommentSection from "./Components/Pages/Comment/CommentSection";
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
        <Route path="/login" element={<Login />} />
        <Route path="/ProgressChecker" element={<ProgressChecker />} />
        <Route path="/AddProgress" element={<AddProgress />} />
        <Route path="/UpdateProgress" element={<UpdateProgress />} />
        <Route path="/PostList" element={<PostList />} />
        <Route path="/CommentSection" element={<CommentSection />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
