import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, List, Paper, ListItem, ListItemText,
  IconButton, Stack, Chip, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCommentsByPost, deleteComment } from "./CommentService";
import UpdateComment from "./UpdateComment";
import { useNavigate } from "react-router-dom";

const CommentSection = () => {
  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
  }, [postId, fetchComments]);

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
        Comments for Post ID:
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        {postId}
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3, backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
        onClick={() => navigate(`/posts/${postId}/add-comment`)}
      >
        ➕ Add New Comment
      </Button>

      <List sx={{ mt: 2 }}>
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
