// src/Components/Pages/Login.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for the OAuth redirect with token parameter
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Save the token to localStorage
      localStorage.setItem('token', token);
      
      // Get user info with the token
      fetchUserInfo(token);
    }
  }, [location]);
  
  const fetchUserInfo = async (token) => {
    try {
      const res = await axios.get('http://localhost:8081/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Save user ID
      localStorage.setItem('userId', res.data.id);
      
      setSuccess('Successfully logged in with Google!');
      
      // Navigate to home page after a small delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setError('Failed to fetch user info after OAuth login');
      localStorage.removeItem('token');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };
  
  const handleGoogleLogin = () => {
    // Redirect to the backend OAuth2 endpoint
    window.location.href = 'http://localhost:8081/oauth2/authorize/google?redirect_uri=http://localhost:3000/login';
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 450,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login to SkillZora
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
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
            Continue with Google
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <TextField
          fullWidth
          label="Username or Email"
          margin="normal"
          name="usernameOrEmail"
          value={form.usernameOrEmail}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            py: 1.2,
            backgroundColor: '#FFB300',
            '&:hover': { backgroundColor: '#FFA000' }
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
        
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? {" "}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 'medium' }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Typography>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;