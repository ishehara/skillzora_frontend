// Modified ProgressChecker.jsx with feedback messages

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
  Checkbox,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Fade,
  Grow,
  alpha,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  CheckCircle, 
  AddCircleOutline,
  ArrowBack,
  LinkOutlined
} from "@mui/icons-material";
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
  
  // State for feedback messages
  const [feedbackMessage, setFeedbackMessage] = useState({
    open: false,
    message: "",
    severity: "success" // success, error, warning, info
  });

  const primaryColor = "#D5C8B6";
  const secondaryColor = "#8D7B68";
  const accentColor = "#A67C52";

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
      showFeedback("Failed to load progress plans. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [postId, loggedUserId]);

  // Helper function to show feedback messages
  const showFeedback = (message, severity = "success") => {
    setFeedbackMessage({
      open: true,
      message,
      severity
    });
  };

  // Handle closing the feedback message
  const handleCloseFeedback = () => {
    setFeedbackMessage(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleEdit = (item) => {
    navigate("/UpdateProgress", { state: { editData: item } });
  };

  const handleDelete = async (id, title) => {
    try {
      await deleteProgress(id);
      showFeedback(`"${title}" has been deleted successfully!`);
      fetchProgress();
    } catch (error) {
      console.error("Error deleting progress", error);
      showFeedback("Failed to delete progress plan. Please try again.", "error");
    }
  };

  const handleStepToggle = async (progressId, stepIndex, progressTitle) => {
    const target = progressList.find(p => p._id === progressId || p.id === progressId);
    if (!target) return;

    const updatedSteps = [...target.steps];
    const newCompletedStatus = !updatedSteps[stepIndex].completed;
    updatedSteps[stepIndex].completed = newCompletedStatus;

    const updatedData = {
      ...target,
      steps: updatedSteps
    };

    try {
      await updateProgress(progressId, updatedData);
      
      // Calculate completion percentage after update
      const steps = updatedSteps;
      const completedCount = steps.filter(step => step.completed).length;
      const totalSteps = steps.length;
      const completionPercentage = Math.round((completedCount / totalSteps) * 100);
      
      // Show appropriate feedback message
      if (newCompletedStatus) {
        if (completionPercentage === 100) {
          showFeedback(`Congratulations! You've completed all steps in "${progressTitle}"!`, "success");
        } else {
          showFeedback(`Step marked as completed! ${completedCount} of ${totalSteps} steps done.`, "success");
        }
      } else {
        showFeedback(`Step marked as incomplete.`, "info");
      }
      
      fetchProgress();
    } catch (error) {
      console.error("Failed to update step completion", error);
      showFeedback("Failed to update step status. Please try again.", "error");
    }
  };

  const calculateCompletion = (steps) => {
    if (!steps || steps.length === 0) return 0;
    const completed = steps.filter(step => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  if (!postId) {
    return (
      <Fade in timeout={800}>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3, 
              backgroundColor: alpha(primaryColor, 0.3),
              border: `1px solid ${primaryColor}`
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, color: secondaryColor, fontWeight: 500 }}>
              No post selected
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Please select a post first to view or create progress plans.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate("/PostList")}
              startIcon={<ArrowBack />}
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                backgroundColor: accentColor,
                '&:hover': { backgroundColor: secondaryColor }
              }}
            >
              Go to Posts
            </Button>
          </Paper>
        </Container>
      </Fade>
    );
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* Feedback Message Snackbar */}
        <Snackbar 
          open={feedbackMessage.open} 
          autoHideDuration={4000} 
          onClose={handleCloseFeedback}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            elevation={6} 
            variant="filled" 
            onClose={handleCloseFeedback} 
            severity={feedbackMessage.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              '& .MuiAlert-icon': { 
                color: 'white',
                alignItems: 'center'
              }
            }}
          >
            {feedbackMessage.message}
          </Alert>
        </Snackbar>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: secondaryColor,
              borderBottom: `3px solid ${primaryColor}`,
              pb: 1,
              display: 'inline-block'
            }}
          >
            Your Progress Plans
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={() => navigate("/AddProgress")}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              backgroundColor: accentColor,
              boxShadow: '0px 4px 12px rgba(166, 124, 82, 0.3)',
              fontWeight: 500,
              '&:hover': { 
                backgroundColor: secondaryColor,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Create New Progress Plan
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: accentColor }} />
          </Box>
        ) : progressList.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: alpha(primaryColor, 0.15),
              border: `1px dashed ${primaryColor}`
            }}
          >
            <Box sx={{ mb: 3 }}>
              <AddCircleOutline sx={{ fontSize: 60, color: alpha(accentColor, 0.7) }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, color: secondaryColor }}>
              No progress plans yet
            </Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              Create your first progress plan to start tracking your learning journey!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => navigate("/AddProgress")}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                backgroundColor: accentColor,
                fontWeight: 500,
                '&:hover': { backgroundColor: secondaryColor }
              }}
            >
              Create First Plan
            </Button>
          </Paper>
        ) : (
          <List sx={{ p: 0 }}>
            {progressList.map((item, index) => {
              const completionPercentage = calculateCompletion(item.steps);
              
              return (
                <Grow 
                  in 
                  key={item._id || item.id} 
                  timeout={(index + 1) * 300}
                  style={{ transformOrigin: '0 0 0' }}
                >
                  <Card 
                    elevation={3} 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      overflow: 'visible',
                      position: 'relative',
                      border: `1px solid ${alpha(primaryColor, 0.5)}`,
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16, 
                        zIndex: 2,
                        display: 'flex',
                        gap: 1
                      }}
                    >
                      <Chip 
                        label={`${completionPercentage}% Complete`}
                        size="small"
                        color={completionPercentage === 100 ? "success" : "default"}
                        icon={completionPercentage === 100 ? <CheckCircle fontSize="small" /> : null}
                        sx={{ 
                          backgroundColor: completionPercentage === 100 
                            ? alpha('#4caf50', 0.15) 
                            : alpha(primaryColor, 0.3),
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ pt: 4, pb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1.5, 
                          color: secondaryColor,
                          pr: 16 // Make room for the completion chip
                        }}
                      >
                        {item.recipeTitle}
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        {item.steps.map((step, idx) => (
                          <Paper 
                            key={idx} 
                            elevation={0} 
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              borderRadius: 2,
                              backgroundColor: step.completed 
                                ? alpha('#4caf50', 0.05) 
                                : alpha(primaryColor, 0.1),
                              border: `1px solid ${step.completed 
                                ? alpha('#4caf50', 0.3) 
                                : alpha(primaryColor, 0.3)}`,
                              display: "flex", 
                              alignItems: "flex-start",
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Checkbox
                              checked={step.completed}
                              onChange={() => handleStepToggle(item._id || item.id, idx, item.recipeTitle)}
                              sx={{ 
                                mt: -0.5,
                                color: accentColor,
                                '&.Mui-checked': {
                                  color: step.completed ? '#4caf50' : accentColor,
                                }
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: step.completed ? '#4caf50' : secondaryColor,
                                  textDecoration: step.completed ? 'line-through' : 'none',
                                  opacity: step.completed ? 0.8 : 1
                                }}
                              >
                                {step.stepTitle}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  mb: 0.5, 
                                  color: 'text.secondary',
                                  opacity: step.completed ? 0.7 : 0.9
                                }}
                              >
                                {step.description}
                              </Typography>
                              {step.resourceUrl && (
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<LinkOutlined fontSize="small" />}
                                  href={step.resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ 
                                    mt: 0.5, 
                                    textTransform: 'none',
                                    color: accentColor,
                                    p: 0,
                                    '&:hover': {
                                      backgroundColor: 'transparent',
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  View Resource
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        p: 2,
                        pt: 0
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(item)}
                        sx={{ 
                          color: secondaryColor,
                          mr: 1,
                          '&:hover': {
                            backgroundColor: alpha(primaryColor, 0.2)
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(item._id || item.id, item.recipeTitle)}
                        sx={{ 
                          color: '#d32f2f',
                          '&:hover': {
                            backgroundColor: alpha('#d32f2f', 0.1)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grow>
              );
            })}
          </List>
        )}
      </Container>
    </Fade>
  );
};

export default ProgressChecker;