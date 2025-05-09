import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("selectedPostId", post.id);
    navigate(`/posts/${post.id}`);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:8081${post.imageUrl}`}
        alt={post.title}
      />
      <CardContent>
        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
        <div style={{ marginTop: "8px" }}>
          {post.hashtags.map((tag, idx) => (
            <Chip key={idx} label={`#${tag.trim()}`} size="small" sx={{ mr: 1 }} />
          ))}
        </div>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleClick}>
          View Post
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;
