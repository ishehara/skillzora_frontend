import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#000", color: "white", py: 2 }}>
      <Container sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography>
          &copy; {new Date().getFullYear()} SkillZora. All rights reserved.
        </Typography>
        <Box>
          <Button color="inherit">About Us</Button>
          <Button color="inherit">Privacy Policy</Button>
          <Button color="inherit">Terms of Service</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
