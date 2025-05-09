// src/Components/Pages/ProgressChecker/ProgressChecker.jsx

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
  IconButton,
  Checkbox
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  getProgressByPost,
  deleteProgress,
  updateProgress
} from "./ProgressCheckerService";
import { useNavigate } from "react-router-dom";

const ProgressChecker = () => {
  const navigate = useNavigate();
  const postId = localStorage.getItem("selectedPostId");
  const loggedUserId = localStorage.getItem("userId");
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!postId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await getProgressByPost(postId);
      // Only show user's own progress
      const filtered = res.data.filter(p => p.userId === loggedUserId);
      setProgressList(filtered);
    } catch (error) {
      console.error("Error fetching progress", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [postId, loggedUserId]);

  const handleEdit = (item) => {
    navigate("/UpdateProgress", { state: { editData: item } });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgress(id);
      fetchProgress();
    } catch (error) {
      console.error("Error deleting progress", error);
    }
  };

  const handleStepToggle = async (progressId, stepIndex) => {
    const target = progressList.find(p => p._id === progressId || p.id === progressId);
    if (!target) return;

    const updatedSteps = [...target.steps];
    updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;

    const updatedData = {
      ...target,
      steps: updatedSteps
    };

    try {
      await updateProgress(progressId, updatedData);
      fetchProgress();
    } catch (error) {
      console.error("Failed to update step completion", error);
    }
  };

  if (!postId) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No post selected. Please select a post first.</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/PostList")}
          sx={{ mt: 2 }}
        >
          Go to Posts
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Progress for This Post
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3, backgroundColor: "#FFB300", '&:hover': { backgroundColor: "#FFA000" } }}
        onClick={() => navigate("/AddProgress")}
      >
        Add New Progress Plan
      </Button>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Typography>Loading progress data...</Typography>
      ) : progressList.length === 0 ? (
        <Typography>No progress plans yet. Create one to start tracking your learning!</Typography>
      ) : (
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
                  <Box key={idx} sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
                    <Checkbox
                      checked={step.completed}
                      onChange={() => handleStepToggle(item._id || item.id, idx)}
                      sx={{ mt: -0.5 }}
                    />
                    <Box>
                      <Typography variant="subtitle2">
                        Step {idx + 1}: {step.stepTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {step.description}
                      </Typography>
                      {step.resourceUrl && (
                        <Typography variant="body2" color="primary">
                          <a href={step.resourceUrl} target="_blank" rel="noopener noreferrer">
                            {step.resourceUrl}
                          </a>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ProgressChecker;