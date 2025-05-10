// src/Components/Pages/Post/PostDetail.jsx

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, Divider,
  Card, CardActions, Grid
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import TimerIcon from '@mui/icons-material/Timer';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import BookmarkButton from '../Bookmark/BookmarkButton';
import LikeButton from './LikeButton'; // Import the new component

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams(); // From URL if using router param
  const selectedPostId = postId || localStorage.getItem('selectedPostId');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPost = async () => {
      if (!selectedPostId) {
        setError('No post selected');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8081/api/posts/${selectedPostId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setPost(response.data);
      } catch (err) {
        setError('Error loading post details');
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [selectedPostId, token]);

  const handleViewProgress = () => {
    navigate('/ProgressChecker');
  };

  const handleViewComments = () => {
    navigate('/CommentSection');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading post details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/PostList')}
          sx={{ mt: 2 }}
        >
          Go to Post List
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Post not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
            }}
            src={`http://localhost:8081${post.imageUrl}`}
            alt={post.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              p: 0.5
            }}
          >
            <BookmarkButton postId={selectedPostId} />
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          
          {post.hashtags && post.hashtags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {post.hashtags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={`#${tag}`} 
                  size="small" 
                  sx={{ backgroundColor: '#e0f2f1', color: '#009688' }}
                />
              ))}
            </Box>
          )}
          
          <Typography variant="body1" paragraph>
            {post.description}
          </Typography>
          
          {/* Social interactions section */}
          <Card variant="outlined" sx={{ mb: 3, mt: 3, borderRadius: 2 }}>
            <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {/* New Like Button component */}
                  <LikeButton postId={selectedPostId} />
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      startIcon={<CommentIcon />} 
                      onClick={handleViewComments}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      Comments
                    </Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Date not available'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleViewProgress}
              sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FF8F00" } }}
            >
              View Progress
            </Button>
            <Button
              variant="contained"
              onClick={handleViewComments}
              sx={{ backgroundColor: "#009688", '&:hover': { backgroundColor: "#00796B" } }}
            >
              View Comments
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/PostList')}
            >
              Back to Posts
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail;