import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', hashtags);
    formData.append('image', image);

    const token = localStorage.getItem('token'); // Get token from localStorage

    try {
      await axios.post('http://localhost:8081/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include token in header
        },
      });
      navigate('/PostList'); // ✅ Automatically navigate to PostList after successful submission
    } catch (err) {
      console.error('❌ Error creating post:', err.response?.data || err.message);
      setError('Failed to create post');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
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
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ backgroundColor: '#FFB300', '&:hover': { backgroundColor: '#FF8F00' } }}
        >
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: '#FFB300', '&:hover': { backgroundColor: '#FF8F00' } }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AddPost;
