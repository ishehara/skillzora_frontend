import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardMedia, CardContent, Typography, Button, Grid, Container, Stack, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

  const handleUpdate = (postId) => {
    navigate(`/update-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8081/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter((post) => post.id !== postId));
      alert("✅ Post deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting post", error);
      alert("❌ Failed to delete post");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Available Cooking Posts
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FF8F00" } }}
          onClick={() => navigate('/add-post')}
        >
          Add Post
        </Button>
      </Box>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`${process.env.PUBLIC_URL}${post.imageUrl}`}
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
                  variant="contained"
                  sx={{ backgroundColor: "#009688", '&:hover': { backgroundColor: "#607D8B" } }}
                  onClick={() => handleAddComment(post.id)}
                >
                  View Comments
                </Button>
                <IconButton color="info" onClick={() => handleUpdate(post.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(post.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostDisplay;
