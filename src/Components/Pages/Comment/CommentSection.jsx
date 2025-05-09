import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, List, Paper, ListItem, ListItemText,
  IconButton, Stack, Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCommentsByPost, deleteComment } from "./CommentService";
import AddComment from "./AddComment";
import UpdateComment from "./UpdateComment";

const CommentSection = () => {
  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ✅ useCallback-wrapped function to avoid ESLint warning
  const fetchComments = useCallback(async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch comments", error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]); // ✅ No more warning

  const handleDelete = async (id) => {
    try {
      await deleteComment(id, token);
      fetchComments();
    } catch (error) {
      console.error("❌ Failed to delete comment", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <AddComment
        postId={postId}
        userId={userId}
        token={token}
        onCommentAdded={fetchComments}
      />

      <List sx={{ mt: 4 }}>
        {comments.map((comment) => (
          <Paper key={comment.id || comment._id} sx={{ mt: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  {editingId === (comment.id || comment._id) ? null : (
                    <IconButton onClick={() => setEditingId(comment.id || comment._id)}>
                      <Typography fontSize={14}>Edit</Typography>
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(comment.id || comment._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  editingId === (comment.id || comment._id) ? (
                    <UpdateComment
                      comment={comment}
                      token={token}
                      onUpdateDone={() => {
                        setEditingId(null);
                        fetchComments();
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="subtitle1">{comment.commentText}</Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        {comment.tags && comment.tags.map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" />
                        ))}
                        {comment.mood && (
                          <Chip label={`Mood: ${comment.mood}`} size="small" />
                        )}
                      </Stack>
                    </Box>
                  )
                }
                secondary={`Posted on ${new Date(comment.timestamp).toLocaleString()}`}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default CommentSection;
