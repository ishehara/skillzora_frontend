// src/pages/PostDisplay.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardMedia, CardContent, Typography, Button, Grid, Container, Stack
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostDisplay = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(res.data);
      } catch (error) {
        console.error("❌ Error fetching posts", error);
      }
    };

    fetchPosts();
  }, [token]);

  const handleViewProgress = (postId) => {
    localStorage.setItem("selectedPostId", postId);
    navigate("/ProgressChecker");
  };

  const handleAddComment = (postId) => {
    localStorage.setItem("selectedPostId", postId);
    navigate("/CommentSection");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Available Cooking Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8081${post.imageUrl}`}
                alt={post.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.description.length > 100
                    ? post.description.substring(0, 100) + "..."
                    : post.description}
                </Typography>
              </CardContent>

              <Stack direction="column" spacing={1} sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FF8F00" } }}
                  onClick={() => handleViewProgress(post.id)}
                >
                  View Progress
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleAddComment(post.id)}
                >
                  ➕ Add Comment
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostDisplay;
