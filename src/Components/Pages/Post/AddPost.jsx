// src/Components/Pages/Post/AddPost.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress, 
  Paper,
  IconButton,
  Card,
  CardMedia,
  Divider,
  Chip
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define color theme constants
const THEME = {
  primary: '#D5C8B6',
  secondary: '#c0b3a1',
  darkAccent: '#8a7d6a',
  lightBg: '#f5f2ee',
  white: '#ffffff',
  error: '#d32f2f'
};

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

  // Create an array of hashtags from comma-separated string
  const hashtagArray = hashtags.split(',').filter(tag => tag.trim() !== '');

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: THEME.lightBg,
          borderTop: `5px solid ${THEME.primary}`
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          textAlign="center"
          fontWeight="500"
          color={THEME.darkAccent}
          sx={{ mb: 3 }}
        >
          Create New Post
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1.5
            }}
          >
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: THEME.secondary,
                },
                '&:hover fieldset': {
                  borderColor: THEME.darkAccent,
                },
                '&.Mui-focused fieldset': {
                  borderColor: THEME.darkAccent,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: THEME.darkAccent,
              },
              backgroundColor: THEME.white,
              borderRadius: 1
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: THEME.secondary,
                },
                '&:hover fieldset': {
                  borderColor: THEME.darkAccent,
                },
                '&.Mui-focused fieldset': {
                  borderColor: THEME.darkAccent,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: THEME.darkAccent,
              },
              backgroundColor: THEME.white,
              borderRadius: 1
            }}
          />

          <TextField
            label="Hashtags (comma-separated)"
            variant="outlined"
            fullWidth
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            helperText="E.g. cooking, italian, pasta"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: THEME.secondary,
                },
                '&:hover fieldset': {
                  borderColor: THEME.darkAccent,
                },
                '&.Mui-focused fieldset': {
                  borderColor: THEME.darkAccent,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: THEME.darkAccent,
              },
              '& .MuiFormHelperText-root': {
                color: THEME.darkAccent,
              },
              backgroundColor: THEME.white,
              borderRadius: 1
            }}
          />
          
          {hashtagArray.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: -1, mb: 1 }}>
              {hashtagArray.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={`#${tag.trim()}`} 
                  size="small"
                  sx={{ 
                    backgroundColor: THEME.primary,
                    color: THEME.darkAccent,
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          {!previewUrl ? (
            <Box 
              sx={{ 
                border: `2px dashed ${THEME.secondary}`,
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: THEME.white,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: THEME.lightBg,
                  borderColor: THEME.darkAccent
                }
              }}
              onClick={() => document.getElementById('upload-image').click()}
            >
              <input
                id="upload-image"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              <PhotoCamera sx={{ fontSize: 60, color: THEME.secondary, mb: 2 }} />
              <Typography variant="body1" color={THEME.darkAccent}>
                Click to upload an image
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Supports JPG, PNG, GIF
              </Typography>
            </Box>
          ) : (
            <Card 
              sx={{ 
                position: 'relative',
                mb: 2,
                borderRadius: 2,
                boxShadow: 2,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: THEME.white
              }}
            >
              <CardMedia
                component="img"
                image={previewUrl}
                alt="Post preview"
                sx={{ 
                  height: 'auto',
                  maxHeight: 400,
                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: 2,
                  p: 1
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: THEME.white,
                  '&:hover': {
                    backgroundColor: THEME.primary,
                  },
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                }}
                onClick={() => document.getElementById('change-image').click()}
              >
                <PhotoCamera sx={{ color: THEME.darkAccent }} />
                <input
                  id="change-image"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Card>
          )}
          
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !title || !description || !image}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ 
              mt: 2, 
              backgroundColor: THEME.primary,
              color: THEME.darkAccent,
              fontWeight: 'bold',
              '&:hover': { 
                backgroundColor: THEME.secondary,
              },
              '&.Mui-disabled': {
                backgroundColor: THEME.secondary,
                opacity: 0.6,
              },
              height: 56,
              fontSize: '1rem',
              borderRadius: 2,
              textTransform: 'none'
            }}
            onClick={handleSubmit}
          >
            {loading ? 'Creating Post...' : 'Create Post'}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            sx={{ 
              color: THEME.darkAccent,
              borderColor: THEME.darkAccent,
              '&:hover': { 
                borderColor: THEME.darkAccent,
                backgroundColor: 'rgba(213, 200, 182, 0.1)',
              },
              height: 46,
              borderRadius: 2,
              textTransform: 'none'
            }}
            onClick={() => navigate('/PostList')}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddPost;