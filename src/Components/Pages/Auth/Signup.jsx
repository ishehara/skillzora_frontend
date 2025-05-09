// src/Components/Pages/Auth/SignUp.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('http://localhost:8081/api/auth/signup', form);
      
      // Auto-login after successful signup
      const loginRes = await axios.post('http://localhost:8081/api/auth/login', {
        usernameOrEmail: form.email,
        password: form.password
      });
      
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('userId', loginRes.data.id);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = () => {
    // Redirect to the backend OAuth2 endpoint
    window.location.href = 'http://localhost:8081/oauth2/authorize/google?redirect_uri=http://localhost:3000/login';
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 500
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create a SkillZora Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignUp}
            sx={{ 
              py: 1.2,
              borderColor: '#4285F4',
              color: '#4285F4',
              '&:hover': {
                borderColor: '#2b67c6',
                backgroundColor: 'rgba(66, 133, 244, 0.04)'
              }
            }}
          >
            Sign up with Google
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              required
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              margin="normal"
            />
          </Box>

          <TextField
            fullWidth
            required
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            helperText="Password must be at least 6 characters"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              backgroundColor: '#FFB300',
              '&:hover': { backgroundColor: '#FFA000' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? {" "}
            <Typography
              component="span"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 'medium' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;