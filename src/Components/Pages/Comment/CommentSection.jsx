import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Picker from "emoji-picker-react";
import {
  addComment,
  getCommentsByPost,
  deleteComment
} from "./CommentService";

const CommentSection = () => {
  const postId = localStorage.getItem("selectedPostId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMood(emojiData.emoji);
    setShowEmoji(false);
  };

  const handleSubmit = async () => {
    try {
      const commentData = { postId, userId, commentText, tags, mood };
      await addComment(commentData, token);
      setCommentText("");
      setTags([]);
      setMood("");
      fetchComments();
    } catch (error) {
      console.error("❌ Failed to post comment", error);
    }
  };

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

      {/* Comment Input */}
      <TextField
        label="Write a comment"
        fullWidth
        multiline
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Tags */}
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

      {/* Emoji Mood Picker */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button onClick={() => setShowEmoji(!showEmoji)}>
          {mood ? `Mood: ${mood}` : "Pick Mood"}
        </Button>
        {mood && <Typography>{mood}</Typography>}
      </Stack>
      {showEmoji && (
        <Box sx={{ mb: 2 }}>
          <Picker onEmojiClick={handleEmojiClick} />
        </Box>
      )}

      {/* Submit Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
        onClick={handleSubmit}
        disabled={!commentText}
      >
        Post Comment
      </Button>

      {/* Display Comments */}
      <List sx={{ mt: 4 }}>
        {comments.map((comment) => (
          <Paper key={comment.id || comment._id} sx={{ mt: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => handleDelete(comment.id || comment._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="subtitle1">
                      {comment.commentText}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      {comment.tags && comment.tags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" />
                      ))}
                      {comment.mood && (
                        <Chip label={`Mood: ${comment.mood}`} size="small" />
                      )}
                    </Stack>
                  </Box>
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
