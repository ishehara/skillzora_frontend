// src/Components/Pages/Post/AddPost.jsx

import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || !description || !image) {
      setError('Please provide title, description, and an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', hashtags);
    formData.append('image', image);

    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      await axios.post('http://localhost:8081/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setLoading(false);
      navigate('/PostList');
    } catch (err) {
      setLoading(false);
      console.error('Error creating post:', err.response?.data || err.message);
      setError('Failed to create post: ' + (err.response?.data || err.message));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Create New Post
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Hashtags (comma-separated)"
          variant="outlined"
          fullWidth
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          helperText="E.g. cooking, italian, pasta"
        />
        
        {previewUrl && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img 
              src={previewUrl} 
              alt="Upload preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                borderRadius: '4px'
              }} 
            />
          </Box>
        )}
        
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ backgroundColor: '#FFB300', '&:hover': { backgroundColor: '#FF8F00' } }}
        >
          {image ? 'Change Image' : 'Upload Image (Required)'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        
        <Button
          variant="contained"
          fullWidth
          disabled={loading || !title || !description || !image}
          sx={{ 
            mt: 2, 
            backgroundColor: '#FFB300', 
            '&:hover': { backgroundColor: '#FF8F00' },
            height: 56
          }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Post'}
        </Button>
      </Box>
    </Container>
  );
};

export default AddPost;