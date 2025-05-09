// src/Components/Pages/Comment/CommentSection.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, List, Paper, ListItem, ListItemText,
  IconButton, Stack, Chip, Button, Container, TextField,
  Popover
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getCommentsByPost, deleteComment, addComment } from "./CommentService";
import UpdateComment from "./UpdateComment";
import { useNavigate } from "react-router-dom";
import Picker from 'emoji-picker-react';

const CommentSection = () => {
  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState("");
  
  // For emoji picker
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]);

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
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
    if (!commentText.trim()) return;
    
    try {
      const commentData = {
        postId,
        userId,
        commentText,
        tags,
        mood
      };
      
      await addComment(commentData);
      
      // Reset form
      setCommentText("");
      setTags([]);
      setMood("");
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
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
      <Typography variant="h4" gutterBottom>
        Comments
      </Typography>
      
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        CANCEL
      </Button>
      
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Add Comment
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleTagAdd}
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
                color="primary"
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
            sx={{ flexGrow: 1 }}
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
            color: 'black',
            '&:not(:disabled)': {
              backgroundColor: '#FFB300',
              '&:hover': {
                backgroundColor: '#FFA000',
              }
            }
          }}
        >
          POST COMMENT
        </Button>
      </Box>

      <List sx={{ mt: 4 }}>
        {comments.length === 0 ? (
          <Typography variant="h6">No comments yet. Be the first to comment!</Typography>
        ) : (
          comments.map((comment) => (
            <Paper key={comment.id || comment._id} sx={{ mt: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  comment.userId === userId ? (
                    <Stack direction="row" spacing={1}>
                      {editingId === (comment.id || comment._id) ? null : (
                        <IconButton onClick={() => setEditingId(comment.id || comment._id)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(comment.id || comment._id)}>
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
                        onUpdateDone={() => {
                          setEditingId(null);
                          fetchComments();
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="body1">{comment.commentText}</Typography>
                        <Stack direction="row" spacing={1} mt={1}>
                          {comment.tags && comment.tags.map((tag, idx) => (
                            <Chip key={idx} label={`#${tag}`} size="small" />
                          ))}
                          {comment.mood && (
                            <Typography>{comment.mood}</Typography>
                          )}
                        </Stack>
                      </Box>
                    )
                  }
                  secondary={`Posted on ${new Date(comment.timestamp).toLocaleString()}`}
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