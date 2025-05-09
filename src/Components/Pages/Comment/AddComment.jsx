import React, { useState } from "react";
import {
  TextField, Button, Stack, Chip, Typography, Box
} from "@mui/material";
import Picker from "emoji-picker-react";
import { addComment } from "./CommentService";

const AddComment = ({ postId, userId, token, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mood, setMood] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

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
      onCommentAdded(); // Refresh comment list in parent
    } catch (error) {
      console.error("❌ Failed to post comment", error);
    }
  };

  return (
    <Box>
      <TextField
        label="Write a comment"
        fullWidth
        multiline
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

      <Button
        variant="contained"
        sx={{ backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
        onClick={handleSubmit}
        disabled={!commentText}
      >
        Post Comment
      </Button>
    </Box>
  );
};

export default AddComment;
