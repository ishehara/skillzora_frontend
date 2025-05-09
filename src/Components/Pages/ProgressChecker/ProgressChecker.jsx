// src/pages/ProgressChecker.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  getProgressByPost,
  deleteProgress
} from "./ProgressCheckerService";
import { useNavigate } from "react-router-dom";

const ProgressChecker = () => {
  const navigate = useNavigate();
  const postId = localStorage.getItem("selectedPostId"); // ✅ Post ID for filter
  const [progressList, setProgressList] = useState([]);

  const fetchProgress = async () => {
    try {
      const res = await getProgressByPost(postId);
      setProgressList(res.data);
    } catch (error) {
      console.error("❌ Error fetching progress", error);
    }
  };

  useEffect(() => {
    if (postId) fetchProgress();
  }, [postId]);

  const handleEdit = (item) => {
    navigate("/UpdateProgress", { state: { editData: item } });
  };

  const handleDelete = async (id) => {
    await deleteProgress(id);
    fetchProgress();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Progress Plans for This Post
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3, backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
        onClick={() => navigate("/AddProgress")}
      >
        ➕ Add New Progress Plan
      </Button>

      <Divider sx={{ mb: 3 }} />

      <List>
        {progressList.map((item) => (
          <Paper key={item._id || item.id} sx={{ mt: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(item._id || item.id)}>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={<strong>{item.recipeTitle}</strong>}
                secondary={`${item.steps.length} steps`}
              />
            </ListItem>
            <Box sx={{ pl: 2, pt: 1 }}>
              {item.steps.map((step, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Step {idx + 1}: {step.stepTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {step.description}
                  </Typography>
                  {step.resourceUrl && (
                    <Typography variant="body2" color="primary">
                      🔗 <a href={step.resourceUrl} target="_blank" rel="noopener noreferrer">
                        {step.resourceUrl}
                      </a>
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default ProgressChecker;
