// src/Components/Pages/Post/LikeButton.jsx

import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Typography, 
  Box, 
  Tooltip, 
  Snackbar,
  Paper
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const LikeButton = ({ postId, postTitle }) => {
  // In a real implementation, this would come from the backend
  // For demo purposes, we'll use localStorage to persist state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // For demo, load previous state from localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem('postLikes') ? 
      JSON.parse(localStorage.getItem('postLikes')) : {};
      
    if (storedLikes[postId]) {
      setLiked(storedLikes[postId].liked);
      setLikeCount(storedLikes[postId].count);
    } else {
      // Initialize with random number for demo
      setLikeCount(Math.floor(Math.random() * 50) + 1);
    }
  }, [postId]);

  const handleLike = () => {
    // Toggle like state
    const newLiked = !liked;
    setLiked(newLiked);
    
    // Update count
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount);
    
    // Animate heart
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    
    // Store in localStorage for persistence
    const storedLikes = localStorage.getItem('postLikes') ? 
      JSON.parse(localStorage.getItem('postLikes')) : {};
      
    storedLikes[postId] = {
      liked: newLiked,
      count: newCount
    };
    
    localStorage.setItem('postLikes', JSON.stringify(storedLikes));
    
    // Show notification when liking (not when unliking)
    if (newLiked) {
      setShowNotification(true);
    }
  };

  // Custom notification for likes
  const LikeNotification = () => (
    <Paper 
      elevation={6} 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderRadius: 2,
        bgcolor: '#f8f8f8',
        border: '1px solid #eeeeee',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Favorite sx={{ color: '#f44336', mr: 1.5 }} />
      <Typography variant="body2">
        You liked this post!
      </Typography>
    </Paper>
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={liked ? "Unlike" : "Like"}>
          <IconButton 
            onClick={handleLike}
            sx={{
              color: liked ? '#f44336' : 'action.disabled',
              transition: 'transform 0.2s',
              transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
              '&:hover': {
                color: liked ? '#e57373' : '#f44336'
              }
            }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        <Typography 
          variant="body2" 
          color="text.secondary"
          fontWeight={liked ? 'medium' : 'normal'}
        >
          {likeCount}
        </Typography>
      </Box>
      
      {/* Like notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showNotification}
        autoHideDuration={2000}
        onClose={() => setShowNotification(false)}
        message={<LikeNotification />}
        ContentProps={{
          sx: { 
            p: 0,
            bgcolor: 'transparent',
            boxShadow: 'none'
          }
        }}
      />
    </>
  );
};

export default LikeButton;