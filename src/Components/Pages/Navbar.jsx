import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar>
        <img
          src="logo.png"
          alt="SkillZora Logo"
          style={{ height: 40, marginRight: 10 }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SkillZora
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        <Button color="inherit" onClick={() => navigate("/ProgressChecker")}>Explore Recipes</Button>
        <Button color="inherit" onClick={() => navigate("/PostList")}>Post</Button>
        <Button color="inherit" onClick={() => navigate("/CommentSection")}>Comments</Button>
        <Button color="inherit" onClick={() => navigate("/login")}>Login/Register</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
