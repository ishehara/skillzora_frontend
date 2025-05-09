// src/Components/Pages/Bookmark/BookmarksList.jsx

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, List, ListItem, ListItemText, 
  IconButton, Paper, Divider, Card, CardContent, Grid,
  Button, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkViewEditDialog from './BookmarkViewEditDialog';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(response.data);
      
      // Fetch post details for each bookmark
      await fetchPostDetails(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async (bookmarksList) => {
    try {
      const postsData = {};
      
      for (const bookmark of bookmarksList) {
        try {
          const response = await axios.get(`http://localhost:8081/api/posts/${bookmark.postId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          postsData[bookmark.postId] = response.data;
        } catch (err) {
          console.error(`Error fetching post for bookmark ${bookmark.id}:`, err);
          postsData[bookmark.postId] = { title: 'Post not available', description: '' };
        }
      }
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDeleteBookmark = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleViewBookmark = (bookmark) => {
    setSelectedBookmark(bookmark);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setSelectedBookmark(bookmark);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBookmark(null);
  };

  const handleUpdateBookmark = (updatedBookmark) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark
    ));
  };

  const handleViewPost = (postId) => {
    localStorage.setItem('selectedPostId', postId);
    navigate('/posts/' + postId);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Bookmarked Posts
      </Typography>
      
      {bookmarks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            You haven't bookmarked any posts yet.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/PostList')}
            sx={{ 
              backgroundColor: '#FFB300', 
              '&:hover': { backgroundColor: '#FFA000' } 
            }}
          >
            Explore Posts
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookmarks.map(bookmark => {
            const post = posts[bookmark.postId] || {};
            
            return (
              <Grid item xs={12} sm={6} md={4} key={bookmark.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {post.title || 'Post Title'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.description
                        ? (post.description.length > 100
                            ? post.description.substring(0, 100) + '...'
                            : post.description)
                        : 'No description available'}
                    </Typography>
                    
                    {bookmark.note && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: '#FFF8E1', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Your Note:
                        </Typography>
                        <Typography variant="body2">
                          {bookmark.note.length > 80
                            ? bookmark.note.substring(0, 80) + '...'
                            : bookmark.note}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <IconButton 
                      onClick={() => handleViewBookmark(bookmark)}
                      color="info"
                      size="small"
                      title="View note"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => handleEditBookmark(bookmark)}
                      color="primary"
                      size="small"
                      title="Edit note"
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton 
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      color="error"
                      size="small"
                      title="Remove bookmark"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewPost(bookmark.postId)}
                    sx={{ 
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      backgroundColor: '#FFB300',
                      '&:hover': { backgroundColor: '#FFA000' }
                    }}
                  >
                    View Post
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {selectedBookmark && (
        <BookmarkViewEditDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          bookmark={selectedBookmark}
          onUpdate={handleUpdateBookmark}
          isEditing={isEditing}
        />
      )}
    </Container>
  );
};

export default BookmarksList;