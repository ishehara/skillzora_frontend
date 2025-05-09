// src/Components/Pages/Auth/OAuth2RedirectHandler.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';

const OAuth2RedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          setError(error);
          setLoading(false);
          return;
        }

        if (!token) {
          setError('No token received from OAuth provider');
          setLoading(false);
          return;
        }

        // Store token
        localStorage.setItem('token', token);

        // Get user info
        const userResponse = await axios.get('http://localhost:8081/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        localStorage.setItem('userId', userResponse.data.id);
        
        // Navigate to home page
        navigate('/');
      } catch (err) {
        console.error('OAuth redirect error:', err);
        setError('Failed to process OAuth login');
        setLoading(false);
      }
    };

    getToken();
  }, [location, navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Completing your login...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}. Please try again or use a different login method.
        </Alert>
      </Container>
    );
  }

  return null;
};

export default OAuth2RedirectHandler;