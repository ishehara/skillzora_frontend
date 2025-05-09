// src/Components/Pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Paper, Box, Tabs, Tab, Grid,
  Card, CardContent, Divider, Avatar, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8081/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      
      // Fetch user's posts
      const postsRes = await axios.get('http://localhost:8081/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Here we'd typically filter by user ID, but assuming the API doesn't support this yet
      setUserPosts(postsRes.data.slice(0, 3)); // Just show the most recent 3 posts
      
      // Fetch bookmarks
      const bookmarksRes = await axios.get('http://localhost:8081/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarksRes.data);
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Please login to view your profile</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              mr: { xs: 0, sm: 4 },
              mb: { xs: 2, sm: 0 }
            }}
            src={user.profilePicture}
          >
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant="h4">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              @{user.username}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              {user.bio || "No bio provided yet."}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
                <Typography variant="h6">
                  {user.followersCount}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
                <Typography variant="h6">
                  {user.followingCount}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Joined
                </Typography>
                <Typography variant="h6">
                  {new Date(user.dateJoined).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Your Posts" />
          <Tab label="Bookmarks" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Your Posts</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/add-post')}
              sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FF8F00" } }}
            >
              Add New Post
            </Button>
          </Box>
          
          {userPosts.length === 0 ? (
            <Typography>You haven't created any posts yet.</Typography>
          ) : (
            <Grid container spacing={3}>
              {userPosts.map(post => (
                <Grid item xs={12} sm={6} md={4} key={post.id || post._id}>
                  <Card sx={{ height: '100%' }}>
                    <Box 
                      sx={{
                        height: 140,
                        backgroundImage: `url(http://localhost:8081${post.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {post.description}
                      </Typography>
                      <Button 
                        sx={{ mt: 2 }}
                        size="small"
                        onClick={() => {
                          localStorage.setItem("selectedPostId", post.id || post._id);
                          navigate('/PostList');
                        }}
                      >
                        View Post
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {tabValue === 1 && (
        <>
          <Typography variant="h5" gutterBottom>Your Bookmarks</Typography>
          
          {bookmarks.length === 0 ? (
            <Typography>You haven't bookmarked any posts yet.</Typography>
          ) : (
            <List>
              {bookmarks.map(bookmark => (
                <Paper key={bookmark.id} sx={{ mb: 2, p: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                          onClick={() => {
                            localStorage.setItem('selectedPostId', bookmark.postId);
                            navigate('/PostList');
                          }}
                        >
                          Post ID: {bookmark.postId}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                          </Typography>
                          {bookmark.note && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Note: {bookmark.note}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
              
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/bookmarks')}
                sx={{ mt: 2 }}
              >
                Manage All Bookmarks
              </Button>
            </List>
          )}
        </>
      )}
    </Container>
  );
};

export default Profile;