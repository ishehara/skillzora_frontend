// src/Components/Pages/Post/PostList.jsx

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Grid, Container, 
  Card, CardContent, CardActions, 
  IconButton, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookmarkButton from '../Bookmark/BookmarkButton';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8081/api/posts", {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        console.log("Fetched posts:", res.data); // Debugging log
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleViewProgress = (postId) => {
    localStorage.setItem("selectedPostId", postId);
    navigate("/ProgressChecker");
  };

  const handleViewComments = (postId) => {
    localStorage.setItem("selectedPostId", postId);
    navigate("/CommentSection");
  };

  const handleUpdate = (postId) => {
    navigate(`/update-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(posts.filter((post) => (post.id || post._id) !== postId));
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Available Cooking Posts
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            bgcolor: '#FFB300', 
            '&:hover': { bgcolor: '#F57C00' },
            fontWeight: 'bold'
          }}
          onClick={() => navigate('/add-post')}
        >
          ADD POST
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <Typography>Loading posts...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => {
            const postId = post.id || post._id;
            // Default placeholder image
            const placeholder = 'https://via.placeholder.com/300x200?text=No+Image';
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={postId}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    border: '1px solid #eee',
                    borderRadius: 1,
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 250,
                      width: '100%',
                      bgcolor: '#f5f5f5',
                      backgroundImage: post.imageUrl ? 
                        `url(${post.imageUrl.startsWith('http') ? 
                          post.imageUrl : 
                          `http://localhost:8081${post.imageUrl}`})` : 
                        `url(${placeholder})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    >
                      <BookmarkButton postId={postId} />
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {post.description && post.description.length > 80
                        ? post.description.substring(0, 80) + "..."
                        : post.description}
                    </Typography>
                    
                    {post.hashtags && post.hashtags.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {post.hashtags.map((tag, index) => (
                          <Typography 
                            key={index} 
                            variant="body2" 
                            sx={{ 
                              color: '#009688', 
                              fontWeight: 'medium'
                            }}
                          >
                            #{tag}{' '}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        mb: 1, 
                        bgcolor: '#FFB300', 
                        '&:hover': { bgcolor: '#F57C00' } 
                      }}
                      onClick={() => handleViewProgress(postId)}
                    >
                      VIEW PROGRESS
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        bgcolor: '#009688', 
                        '&:hover': { bgcolor: '#00796B' } 
                      }}
                      onClick={() => handleViewComments(postId)}
                    >
                      VIEW COMMENTS
                    </Button>
                  </Box>
                  
                  {token && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        p: 1,
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      <IconButton 
                        color="primary" 
                        onClick={() => handleUpdate(postId)}
                        sx={{ mx: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(postId)}
                        sx={{ mx: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default PostList;