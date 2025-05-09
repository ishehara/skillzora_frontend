// src/Components/Pages/Bookmark/BookmarkButton.jsx

import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button 
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';

const BookmarkButton = ({ postId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState('');
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
          setNote(response.data.note || '');
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

  const handleButtonClick = () => {
    if (!token) {
      alert("Please log in to bookmark posts");
      return;
    }
    
    if (isBookmarked) {
      // If already bookmarked, remove bookmark
      handleRemoveBookmark();
    } else {
      // Open dialog to add a new bookmark
      setDialogOpen(true);
    }
  };

  const handleAddBookmark = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8081/api/bookmarks', 
        { postId, note }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && response.data.id) {
        setIsBookmarked(true);
        setBookmarkId(response.data.id);
        console.log("Bookmark added successfully", response.data);
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert("Failed to add bookmark");
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleRemoveBookmark = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8081/api/bookmarks/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(false);
      setBookmarkId(null);
      setNote('');
      console.log("Bookmark removed successfully");
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert("Failed to remove bookmark");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNote('');
  };

  return (
    <>
      <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}>
        <IconButton 
          onClick={handleButtonClick} 
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

      {/* Dialog for adding notes when bookmarking */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Bookmark this post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add a note (optional)"
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why are you saving this post? Add your notes here..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleAddBookmark} 
            color="primary" 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#FFB300',
              '&:hover': { backgroundColor: '#FFA000' }
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Save Bookmark'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookmarkButton;