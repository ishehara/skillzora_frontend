// src/Components/Pages/Bookmark/BookmarkButton.jsx

import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';

const BookmarkButton = ({ postId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if the post is already bookmarked
    const checkBookmarkStatus = async () => {
      if (!token || !postId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8081/api/bookmarks/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.id) {
          setIsBookmarked(true);
          setBookmarkId(response.data.id);
        }
      } catch (error) {
        // 404 means not bookmarked, which is normal
        if (error.response && error.response.status !== 404) {
          console.error("Error checking bookmark status:", error);
        }
        setIsBookmarked(false);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [postId, token]);

  const handleToggleBookmark = async () => {
    if (!token) {
      alert("Please log in to bookmark posts");
      return;
    }
    
    setLoading(true);
    
    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        await axios.delete(`http://localhost:8081/api/bookmarks/${bookmarkId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsBookmarked(false);
        setBookmarkId(null);
        console.log("Bookmark removed successfully");
      } else {
        // Add bookmark
        const response = await axios.post(
          'http://localhost:8081/api/bookmarks', 
          { postId, note: '' }, // Empty note by default
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data && response.data.id) {
          setIsBookmarked(true);
          setBookmarkId(response.data.id);
          console.log("Bookmark added successfully", response.data);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert("Failed to " + (isBookmarked ? "remove" : "add") + " bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}>
      <IconButton 
        onClick={handleToggleBookmark} 
        color={isBookmarked ? 'primary' : 'default'}
        disabled={loading}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : isBookmarked ? (
          <BookmarkIcon />
        ) : (
          <BookmarkBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default BookmarkButton;