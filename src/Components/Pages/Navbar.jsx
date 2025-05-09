// src/Components/Pages/Navbar.jsx

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate("/")}>
          SkillZora
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        <Button color="inherit" onClick={() => navigate("/PostList")}>Recipes</Button>
        
        {isLoggedIn ? (
          <>
            <Button color="inherit" onClick={() => navigate("/Profile")}>Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;