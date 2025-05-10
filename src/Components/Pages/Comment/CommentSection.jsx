// src/Components/Pages/Comment/CommentSection.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, List, Paper, ListItem, ListItemText,
  IconButton, Stack, Chip, Button, Container, TextField,
  Popover, Badge, Alert, Snackbar
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { getCommentsByPost, deleteComment, addComment } from "./CommentService";
import UpdateComment from "./UpdateComment";
import { useNavigate } from "react-router-dom";
import Picker from 'emoji-picker-react';

// Define theme colors
const themeColor = '#D5C8B6';
const themeColorDark = '#C3B6A4'; // Slightly darker version for hover effects

const CommentSection = () => {
  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState("");
  
  // For emoji picker
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // For validation and notifications
  const [errors, setErrors] = useState({
    commentText: false,
  });
  const [notification, setNotification] = useState({
    message: "",
    severity: "info", // "success", "error", "warning", "info"
    open: false
  });

  const fetchComments = useCallback(async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
      setCommentCount(res.data.length);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      setNotification({
        message: "Failed to load comments. Please try again.",
        severity: "error",
        open: true
      });
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]);

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      fetchComments();
      setNotification({
        message: "Comment deleted successfully!",
        severity: "success",
        open: true
      });
    } catch (error) {
      console.error("Failed to delete comment", error);
      setNotification({
        message: "Failed to delete comment. Please try again.",
        severity: "error",
        open: true
      });
    }
  };
  
  const validateComment = () => {
    const newErrors = {
      commentText: false,
    };
    
    // Check comment length
    if (commentText.trim().length < 3) {
      newErrors.commentText = true;
      setNotification({
        message: "Comment must be at least 3 characters long",
        severity: "error",
        open: true
      });
      setErrors(newErrors);
      return false;
    }
    
    // Check if comment is too long (optional)
    if (commentText.trim().length > 500) {
      newErrors.commentText = true;
      setNotification({
        message: "Comment cannot exceed 500 characters",
        severity: "error",
        open: true
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors(newErrors);
    return true;
  };
  
  const handleTagAdd = () => {
    if (!tagInput.trim()) {
      setNotification({
        message: "Tag cannot be empty",
        severity: "warning",
        open: true
      });
      return;
    }
    
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      if (tags.length >= 5) {
        setNotification({
          message: "Maximum 5 tags allowed",
          severity: "warning",
          open: true
        });
        return;
      }
      
      // Check if tag contains spaces
      if (tagInput.trim().includes(' ')) {
        setNotification({
          message: "Tags cannot contain spaces",
          severity: "warning",
          open: true
        });
        return;
      }
      
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    } else if (tags.includes(tagInput.trim())) {
      setNotification({
        message: "This tag already exists",
        severity: "warning",
        open: true
      });
    }
  };
  
  const handleEmojiClick = (emojiData) => {
    setMood(emojiData.emoji);
    setAnchorEl(null); // Close the emoji picker
  };
  
  const handleEmojiOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleEmojiClose = () => {
    setAnchorEl(null);
  };
  
  const handlePostComment = async () => {
    if (!validateComment()) return;
    
    try {
      const commentData = {
        postId,
        userId,
        commentText,
        tags,
        mood
      };
      
      await addComment(commentData);
      
      // Success notification
      setNotification({
        message: "Comment posted successfully!",
        severity: "success",
        open: true
      });
      
      // Reset form
      setCommentText("");
      setTags([]);
      setMood("");
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
      setNotification({
        message: "Failed to post comment. Please try again.",
        severity: "error",
        open: true
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  if (!postId) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No post selected. Please select a post first.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            backgroundColor: notification.severity === 'success' ? '#e8f5e9' : 
                            notification.severity === 'error' ? '#ffebee' :
                            notification.severity === 'warning' ? '#fff8e1' : '#e3f2fd',
            '& .MuiAlert-icon': {
              color: notification.severity === 'success' ? '#4caf50' : 
                    notification.severity === 'error' ? '#f44336' :
                    notification.severity === 'warning' ? '#ff9800' : '#2196f3',
            }
          }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        backgroundColor: themeColor,
        padding: 2,
        borderRadius: 2
      }}>
        <Typography variant="h4" sx={{ color: '#333' }}>Comments</Typography>
        <Badge 
          badgeContent={commentCount} 
          color="primary"
          showZero
          sx={{ 
            '& .MuiBadge-badge': { 
              fontSize: '1rem', 
              height: '24px', 
              minWidth: '24px' 
            } 
          }}
        >
          <CommentIcon fontSize="large" />
        </Badge>
      </Box>
      
      <Button
        variant="contained"
        sx={{ 
          mb: 4, 
          backgroundColor: themeColor,
          color: '#333',
          '&:hover': {
            backgroundColor: themeColorDark,
          }
        }}
        onClick={() => navigate(-1)}
      >
        CANCEL
      </Button>
      
      <Box sx={{ 
        mb: 5,
        p: 3,
        backgroundColor: '#f8f5f2',
        borderLeft: `5px solid ${themeColor}`,
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
          Add Comment
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write a comment (minimum 3 characters, maximum 500)"
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
            if (errors.commentText && e.target.value.trim().length >= 3 && e.target.value.trim().length <= 500) {
              setErrors({...errors, commentText: false});
            }
          }}
          error={errors.commentText}
          helperText={errors.commentText ? 
            (commentText.trim().length < 3 ? "Comment must be at least 3 characters long" : 
             commentText.trim().length > 500 ? "Comment cannot exceed 500 characters" : "") 
            : `${commentText.length}/500`}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: themeColor,
              }
            }
          }}
          inputProps={{
            maxLength: 500,
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            sx={{ 
              mr: 1, 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: themeColor,
                }
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleTagAdd}
            sx={{ 
              backgroundColor: themeColor,
              color: '#333',
              '&:hover': {
                backgroundColor: themeColorDark,
              }
            }}
          >
            ADD
          </Button>
        </Box>
        
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                onDelete={() => setTags(tags.filter((_, i) => i !== index))}
                sx={{ 
                  backgroundColor: themeColor,
                  color: '#333'
                }}
              />
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Add a mood emoji"
            value={mood}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={handleEmojiOpen}>
                  <EmojiEmotionsIcon />
                </IconButton>
              ),
            }}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: themeColor,
                }
              }
            }}
          />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleEmojiClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Picker onEmojiClick={handleEmojiClick} />
          </Popover>
        </Box>
        
        <Button
          variant="contained"
          onClick={handlePostComment}
          disabled={!commentText.trim()}
          sx={{ 
            backgroundColor: '#ccc', 
            color: '#333',
            '&:not(:disabled)': {
              backgroundColor: themeColor,
              '&:hover': {
                backgroundColor: themeColorDark,
              }
            }
          }}
        >
          POST COMMENT
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        backgroundColor: themeColor,
        padding: 2,
        borderRadius: 2 
      }}>
        <Typography variant="h5" sx={{ color: '#333' }}>
          All Comments ({commentCount})
        </Typography>
      </Box>

      <List sx={{ mt: 4 }}>
        {comments.length === 0 ? (
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            py: 4, 
            backgroundColor: '#f8f5f2',
            borderRadius: 2
          }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Paper 
              key={comment.id || comment._id} 
              sx={{ 
                mt: 2, 
                p: 2,
                borderLeft: `3px solid ${themeColor}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <ListItem
                secondaryAction={
                  comment.userId === userId ? (
                    <Stack direction="row" spacing={1}>
                      {editingId === (comment.id || comment._id) ? null : (
                        <IconButton 
                          onClick={() => setEditingId(comment.id || comment._id)}
                          sx={{ 
                            color: '#555',
                            '&:hover': { color: themeColorDark }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton 
                        onClick={() => handleDelete(comment.id || comment._id)}
                        sx={{ 
                          color: '#555',
                          '&:hover': { color: '#f44336' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ) : null
                }
              >
                <ListItemText
                  primary={
                    editingId === (comment.id || comment._id) ? (
                      <UpdateComment
                        comment={comment}
                        themeColor={themeColor}
                        themeColorDark={themeColorDark}
                        onUpdateDone={() => {
                          setEditingId(null);
                          fetchComments();
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{comment.commentText}</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                          {comment.tags && comment.tags.map((tag, idx) => (
                            <Chip 
                              key={idx} 
                              label={`#${tag}`} 
                              size="small"
                              sx={{ 
                                backgroundColor: themeColor,
                                color: '#333'
                              }}
                            />
                          ))}
                          {comment.mood && (
                            <Typography>{comment.mood}</Typography>
                          )}
                        </Stack>
                      </Box>
                    )
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ color: '#666', display: 'block', mt: 1 }}
                    >
                      Posted on {new Date(comment.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))
        )}
      </List>
    </Container>
  );
};

export default CommentSection;