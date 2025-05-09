// src/Components/Pages/Bookmark/BookmarkViewEditDialog.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const BookmarkViewEditDialog = ({ 
  open, 
  onClose, 
  bookmark, 
  onUpdate,
  isEditing = false 
}) => {
  const [note, setNote] = useState(bookmark?.note || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleUpdate = async () => {
    if (!bookmark || !bookmark.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      await axios.put(
        `http://localhost:8081/api/bookmarks/${bookmark.id}`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (onUpdate) {
        onUpdate({ ...bookmark, note });
      }
      
      onClose();
    } catch (err) {
      setError('Failed to update bookmark note');
      console.error('Error updating bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Bookmark Note' : 'Bookmark Details'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {bookmark && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
        
        <TextField
          autoFocus={isEditing}
          margin="dense"
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your notes about this bookmark..."
          variant="outlined"
          disabled={!isEditing}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {isEditing ? 'Cancel' : 'Close'}
        </Button>
        
        {isEditing && (
          <Button 
            onClick={handleUpdate} 
            color="primary" 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#FFB300',
              '&:hover': { backgroundColor: '#FFA000' }
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookmarkViewEditDialog;