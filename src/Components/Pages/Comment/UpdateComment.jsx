// src/Components/Pages/Comment/UpdateComment.jsx

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { updateComment } from "./CommentService";

const UpdateComment = ({ comment, onUpdateDone }) => {
  const [editingText, setEditingText] = useState(comment.commentText);

  const handleUpdate = async () => {
    try {
      await updateComment(comment.id || comment._id, { commentText: editingText });
      onUpdateDone();
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" size="small" onClick={handleUpdate}>
        Save
      </Button>
      <Button variant="text" size="small" onClick={onUpdateDone} sx={{ ml: 1 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default UpdateComment;