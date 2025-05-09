import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { title, description, hashtags, imageUrl } = res.data;
        setTitle(title);
        setDescription(description);
        setHashtags(hashtags.join(", "));
        setImage(imageUrl);
      } catch (err) {
        setError('❌ Failed to fetch post data');
      }
    };

    fetchPost();
  }, [postId, token]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', hashtags);
    if (image instanceof File) formData.append('image', image);

    try {
      await axios.put(`http://localhost:8081/api/posts/${postId}`, {
        title,
        description,
        hashtags: hashtags.split(',').map(tag => tag.trim()),
        imageUrl: image instanceof File ? `/uploads/${image.name}` : image
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('✅ Post updated successfully');
      navigate('/PostList'); // Navigate back to the post list
    } catch (err) {
      setError('❌ Failed to update post');
    }
  };

  const handleCancel = () => {
    navigate('/PostList'); // Navigate back to the post list
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Update Post
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Hashtags (comma separated)"
        fullWidth
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Update Image
        <input
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FF8F00" } }}
          onClick={handleUpdate}
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default UpdatePost;
