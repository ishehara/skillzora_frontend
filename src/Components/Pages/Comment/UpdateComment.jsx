import React, { useState } from "react";
import { TextField, IconButton, Typography } from "@mui/material";
import { updateComment } from "./CommentService";

const UpdateComment = ({ comment, token, onUpdateDone }) => {
  const [editingText, setEditingText] = useState(comment.commentText);

  const handleUpdate = async () => {
    try {
      await updateComment(comment.id || comment._id, { commentText: editingText }, token);
      onUpdateDone();
    } catch (error) {
      console.error("❌ Failed to update comment", error);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        multiline
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        sx={{ mb: 1 }}
      />
      <IconButton onClick={handleUpdate}>
        <Typography fontSize={14}>Save</Typography>
      </IconButton>
    </>
  );
};

export default UpdateComment;
