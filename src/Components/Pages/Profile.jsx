import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8081/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          @{user.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Email: {user.email}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Bio: {user.bio}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Followers: {user.followersCount} | Following: {user.followingCount}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Joined on: {new Date(user.dateJoined).toLocaleDateString()}
        </Typography>

        <Box mt={3}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FF3B30',
              '&:hover': {
                backgroundColor: '#E53935',
              },
              px: 5,
              py: 1,
              borderRadius: 2,
              boxShadow: '0px 5px 0px #b71c1c',
            }}
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
