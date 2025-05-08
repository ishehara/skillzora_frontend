import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  Chip 
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "#D5C8B6" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Master Your Cooking Skills In One Place!
          </Typography>
          <Button
            variant="contained"
            sx={{
                backgroundColor: '#FFB300',
                '&:hover': {
                  backgroundColor: '#FF8F00'  // deeper hover shade
                }
              }}
           
            onClick={() => navigate("/explore")}
          >
            Explore Recipes
          </Button>
        </Box>
      </Box>

      {/* How It Works */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          How SkillZora Works
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              title: "Step-by-Step Cooking Plans",
              desc: "Break down your recipes into clear steps others can follow with ease.",
            },
            {
              title: "Track Your Progress",
              desc: "Tick off each step as you cook and track your skill-building journey.",
            },
            {
              title: "Accessible Anywhere",
              desc: "Use SkillZora on any device to learn, share, and grow your cooking skills.",
            },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Cooking Tips Section */}
      <Box sx={{ backgroundColor: "#6b5e3f", color: "white", py: 4, px: 2 }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Typography>
                Not sure what to cook next? Check out our curated cooking guides and tips
                to boost your skills and confidence in the kitchen.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                sx={{
                    backgroundColor: '#FFB300',
                    '&:hover': {
                      backgroundColor: '#FF8F00'  // deeper hover shade
                    }
                  }}
                onClick={() => navigate("/guides")}
              >
                Read the Guide
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trusted Contributors */}
      <Container sx={{ py: 8 }}>
  <Box sx={{ mb: 6, textAlign: "center" }}>
    <Typography 
      variant="h4" 
      component="h2" 
      sx={{ 
        fontWeight: 700, 
        position: "relative",
        display: "inline-block",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 3,
          backgroundColor: "#FFB300",
          borderRadius: 1
        }
      }}
    >
      Learn More About SkillZora
    </Typography>
    <Typography 
      variant="subtitle1" 
      color="text.secondary" 
      sx={{ mt: 3, maxWidth: 700, mx: "auto" }}
    >
      SkillZora is a platform for cooking lovers to explore, share, and grow their culinary knowledge with expert guidance.
    </Typography>
  </Box>
  
  <Box
    sx={{
      backgroundColor: "white",
      borderRadius: 4,
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.12)"
      }
    }}
  >
    {/* Left side - image */}
    <Box 
      sx={{ 
        flex: { xs: "1 1 100%", md: "0 0 45%" },
        position: "relative",
        overflow: "hidden",
        height: { xs: 250, sm: 300, md: "auto" }
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1528712306091-ed0763094c98"
        alt="Professional chefs teaching cooking techniques"
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          objectPosition: "center",
          display: "block"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: 40, md: 80 },
          background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
          display: { xs: "block", md: "none" }
        }}
      />
    </Box>
    
    {/* Right side - content */}
    <Box 
      sx={{ 
        flex: { xs: "1 1 100%", md: "0 0 55%" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: { xs: 3, sm: 4, md: 5 }
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: "#263238",
          mb: 2
        }}
      >
        Learn from world-class culinary experts
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="body1" 
          sx={{ mb: 2, color: "text.secondary", lineHeight: 1.7 }}
        >
          Our mentors bring decades of professional experience from Michelin-starred 
          restaurants, culinary schools, and food media. They'll help you master:
        </Typography>
        
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {["Knife Skills", "Flavor Pairing", "Global Cuisines", "Plating Techniques"].map((skill) => (
            <Chip 
              key={skill}
              label={skill}
              size="small"
              sx={{ 
                backgroundColor: "#FFF3E0", 
                color: "#E65100",
                fontWeight: 500,
                borderRadius: 1
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<PersonIcon />}
          sx={{
            backgroundColor: "#FF9800",
            color: "white",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            '&:hover': { 
              backgroundColor: "#F57C00",
              boxShadow: "0 4px 12px rgba(255,152,0,0.4)" 
            },
          }}
          onClick={() => navigate("/mentors")}
        >
          Meet the Mentors
        </Button>
        
        <Button
          variant="outlined"
          sx={{
            color: "#FF9800",
            borderColor: "#FF9800",
            fontWeight: 500,
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            '&:hover': { 
              borderColor: "#F57C00",
              backgroundColor: "rgba(255,152,0,0.04)" 
            },
          }}
          onClick={() => navigate("/classes")}
        >
          Browse Classes
        </Button>
      </Box>
    </Box>
  </Box>
  
  {/* Stats/trust indicators */}
  <Box 
    sx={{ 
      display: "flex", 
      flexWrap: "wrap", 
      justifyContent: "center", 
      gap: { xs: 3, md: 6 },
      mt: 5,
      textAlign: "center"
    }}
  >
   
  </Box>
</Container>

    </Box>
  );
};

export default Home;
