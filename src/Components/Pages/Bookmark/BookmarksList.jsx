// src/Components/Pages/Bookmark/BookmarksList.jsx

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, List, ListItem, ListItemText, 
  IconButton, Paper, Divider, TextField, Button 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8081/api/bookmarks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookmarks();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDeleteBookmark = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingId(bookmark.id);
    setNoteText(bookmark.note || '');
  };

  const handleSaveNote = async () => {
    try {
      await axios.put(`http://localhost:8081/api/bookmarks/${editingId}`, 
        { note: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.id === editingId ? { ...bookmark, note: noteText } : bookmark
      ));
      
      setEditingId(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleViewPost = (postId) => {
    localStorage.setItem('selectedPostId', postId);
    navigate('/PostList');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading bookmarks...</Typography>
      </Container>
    );
  }

return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Bookmarked Posts
      </Typography>
      
      {bookmarks.length === 0 ? (
        <Typography>You haven't bookmarked any posts yet.</Typography>
      ) : (
        <List>
          {bookmarks.map(bookmark => (
            <Paper key={bookmark.id} sx={{ mb: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEditBookmark(bookmark)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteBookmark(bookmark.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText 
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                      onClick={() => handleViewPost(bookmark.postId)}
                    >
                      Post ID: {bookmark.postId}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
              
              {editingId === bookmark.id ? (
                <Box sx={{ mt: 2, px: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Your Notes"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleSaveNote}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : bookmark.note ? (
                <Box sx={{ mt: 1, px: 2 }}>
                  <Typography variant="subtitle2">Your Notes:</Typography>
                  <Typography variant="body2">{bookmark.note}</Typography>
                </Box>
              ) : null}
              
              <Divider sx={{ mt: 2 }} />
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default BookmarksList;