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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
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
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
