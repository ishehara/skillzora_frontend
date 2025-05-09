// src/Components/Pages/Comment/AddComment.jsx

import React, { useState } from "react";
import {
  TextField, Button, Stack, Chip, Typography, Box, Container
} from "@mui/material";
import { addComment } from "./CommentService";
import { useNavigate } from "react-router-dom";

const AddComment = () => {
  const [commentText, setCommentText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState("");
  const navigate = useNavigate();

  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    try {
      const commentData = { 
        postId, 
        userId, 
        commentText, 
        tags, 
        mood 
      };
      
      await addComment(commentData);
      alert("Comment added successfully!");
      navigate("/CommentSection");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Comment
      </Typography>
      
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="Write a comment"
          fullWidth
          multiline
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            size="small"
          />
          <Button onClick={handleAddTag}>Add</Button>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              onDelete={() => setTags(tags.filter(t => t !== tag))}
              sx={{ backgroundColor: "#FFE082" }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Add a mood emoji"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            size="small"
          />
        </Stack>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
          onClick={handleSubmit}
          disabled={!commentText}
        >
          Post Comment
        </Button>
      </Box>
    </Container>
  );
};

export default AddComment;