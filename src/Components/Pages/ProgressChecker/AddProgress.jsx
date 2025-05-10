// src/pages/AddProgress.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Alert,
  alpha
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack,
  Link as LinkIcon,
  Description as DescriptionIcon,
  Title as TitleIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { addProgress } from "./ProgressCheckerService";

const AddProgress = () => {
  const userId = localStorage.getItem("userId");
  const postId = localStorage.getItem("selectedPostId");
  const navigate = useNavigate();

  // Theme colors
  const primaryColor = "#D5C8B6";
  const secondaryColor = "#8D7B68";
  const accentColor = "#A67C52";

  const [recipeTitle, setRecipeTitle] = useState("");
  const [steps, setSteps] = useState([
    { stepTitle: "", description: "", resourceUrl: "", completed: false }
  ]);
  
  // Form validation states
  const [errors, setErrors] = useState({
    recipeTitle: "",
    steps: [{ stepTitle: "", description: "" }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      recipeTitle: "",
      steps: steps.map(() => ({ stepTitle: "", description: "" }))
    };

    // Validate recipe title
    if (recipeTitle.trim() === "") {
      newErrors.recipeTitle = "Progress plan title is required";
      isValid = false;
    } else if (recipeTitle.length < 3) {
      newErrors.recipeTitle = "Title must be at least 3 characters";
      isValid = false;
    }

    // Validate steps
    steps.forEach((step, index) => {
      if (step.stepTitle.trim() === "") {
        newErrors.steps[index].stepTitle = "Step title is required";
        isValid = false;
      }
      
      if (step.description.trim() === "") {
        newErrors.steps[index].description = "Description is required";
        isValid = false;
      }

      // Validate URL format if provided
      if (step.resourceUrl && step.resourceUrl.trim() !== "") {
        try {
          new URL(step.resourceUrl);
        } catch (e) {
          newErrors.steps[index].resourceUrl = "Please enter a valid URL";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAddStep = () => {
    setSteps([...steps, { stepTitle: "", description: "", resourceUrl: "", completed: false }]);
    setErrors({
      ...errors,
      steps: [...errors.steps, { stepTitle: "", description: "", resourceUrl: "" }]
    });
  };

  const handleRemoveStep = (indexToRemove) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, index) => index !== indexToRemove));
      setErrors({
        ...errors,
        steps: errors.steps.filter((_, index) => index !== indexToRemove)
      });
    }
  };

  const handleChangeStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
    
    // Clear the error when user starts typing
    if (errors.steps[index] && errors.steps[index][field]) {
      const updatedErrors = { ...errors };
      updatedErrors.steps[index][field] = "";
      setErrors(updatedErrors);
    }
  };

// Modified Submit Handler with Enhanced Success Message
const handleSubmit = async () => {
  setSubmitError("");
  
  // Check if post is selected
  if (!postId) {
    setSubmitError("No post selected. Please select a post before creating a progress plan.");
    return;
  }

  // Check if user is logged in
  if (!userId) {
    setSubmitError("You must be logged in to create a progress plan.");
    return;
  }
  
  if (validateForm()) {
    setIsSubmitting(true);
    
    const data = { postId, userId, recipeTitle, steps };
    
    try {
      await addProgress(data);
      setSubmitSuccess(true);
      
      // Give user more time to see the success message
      setTimeout(() => {
        navigate("/ProgressChecker");
      }, 3000); // Increased from 2000 to 3000ms
    } catch (err) {
      console.error("❌ Failed to save progress", err);
      
      // More specific error message based on the error
      if (err.response) {
        if (err.response.status === 401) {
          setSubmitError("Authentication error. Please log in again and try once more.");
        } else if (err.response.status === 400) {
          setSubmitError("Invalid form data. Please check all fields and try again.");
        } else {
          setSubmitError(`Server error (${err.response.status}). Please try again later.`);
        }
      } else if (err.request) {
        setSubmitError("Network error. Please check your connection and try again.");
      } else {
        setSubmitError("Failed to save progress plan. Please try again.");
      }
      
      setIsSubmitting(false);
    }
  }
};

// Enhanced Success Alert Component (replace the existing success alert)
{submitSuccess && (
  <Fade in timeout={500}>
    <Alert 
      severity="success" 
      variant="filled"
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
        '& .MuiAlert-icon': { color: 'white' },
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)'
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
          }
        }
      }}
    >
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" fontWeight="bold">Success!</Typography>
        <Typography variant="body1">
          Your progress plan "{recipeTitle}" has been created successfully!
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          Redirecting to your plans in 3 seconds...
        </Typography>
      </Box>
    </Alert>
  </Fade>
)}

  return (
    <Fade in timeout={800}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 3,
            border: `1px solid ${alpha(primaryColor, 0.5)}`,
            backgroundColor: alpha(primaryColor, 0.05)
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
              Create Progress Plan
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/ProgressChecker")}
              sx={{ 
                borderColor: accentColor, 
                color: accentColor,
                '&:hover': { 
                  borderColor: secondaryColor, 
                  backgroundColor: alpha(primaryColor, 0.1)
                }
              }}
            >
              Back to Plans
            </Button>
          </Box>

          {submitError && (
            <Alert 
              severity="error" 
              variant="filled"
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(211, 47, 47, 0.2)',
                '& .MuiAlert-icon': { color: 'white' }
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Error</Typography>
                <Typography variant="body2">{submitError}</Typography>
              </Box>
            </Alert>
          )}

          {submitSuccess && (
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(76, 175, 80, 0.2)',
                '& .MuiAlert-icon': { color: 'white' }
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Success</Typography>
                <Typography variant="body2">Your progress plan has been created successfully! Redirecting to your plans...</Typography>
              </Box>
            </Alert>
          )}

          {!postId && (
            <Alert 
              severity="warning" 
              variant="filled"
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(255, 152, 0, 0.2)',
                '& .MuiAlert-icon': { color: 'white' }
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">No Post Selected</Typography>
                <Typography variant="body2">You need to select a post before creating a progress plan. Please go back and select a post first.</Typography>
              </Box>
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Progress Plan Title"
            value={recipeTitle}
            onChange={(e) => {
              setRecipeTitle(e.target.value);
              if (errors.recipeTitle) {
                setErrors({ ...errors, recipeTitle: "" });
              }
            }}
            error={!!errors.recipeTitle}
            helperText={errors.recipeTitle}
            InputProps={{
              startAdornment: <TitleIcon sx={{ mr: 1, color: alpha(accentColor, 0.7) }} />
            }}
            sx={{ 
              mb: 4,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: accentColor
                }
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: accentColor
              }
            }}
          />

          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: secondaryColor,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <DescriptionIcon sx={{ fontSize: 22 }} /> Steps
            </Typography>
            
            <Stepper 
              activeStep={-1} 
              orientation="vertical" 
              sx={{ 
                mb: 3,
                "& .MuiStepConnector-line": {
                  borderColor: alpha(primaryColor, 0.5)
                }
              }}
            >
              {steps.map((step, index) => (
                <Step key={index} active={true} expanded>
                  <StepLabel>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center', 
                        width: '100%'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Step {index + 1}
                      </Typography>
                      {steps.length > 1 && (
                        <Tooltip title="Remove step">
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveStep(index)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { 
                                backgroundColor: alpha('#d32f2f', 0.1)
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </StepLabel>
                  <Box sx={{ ml: 3, mt: 1 }}>
                    <Card 
                      variant="outlined" 
                      sx={{
                        borderColor: alpha(primaryColor, 0.5),
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: accentColor,
                          boxShadow: `0 0 0 1px ${alpha(accentColor, 0.3)}`
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <TextField
                          required
                          fullWidth
                          label="Step Title"
                          value={step.stepTitle}
                          onChange={(e) => handleChangeStep(index, "stepTitle", e.target.value)}
                          error={!!(errors.steps[index] && errors.steps[index].stepTitle)}
                          helperText={errors.steps[index]?.stepTitle}
                          sx={{ mb: 2 }}
                          InputProps={{
                            startAdornment: <TitleIcon sx={{ mr: 1, color: alpha(accentColor, 0.5) }} fontSize="small" />
                          }}
                        />
                        <TextField
                          required
                          fullWidth
                          label="Description"
                          value={step.description}
                          onChange={(e) => handleChangeStep(index, "description", e.target.value)}
                          error={!!(errors.steps[index] && errors.steps[index].description)}
                          helperText={errors.steps[index]?.description}
                          multiline
                          rows={2}
                          sx={{ mb: 2 }}
                          InputProps={{
                            startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: alpha(accentColor, 0.5) }} fontSize="small" />
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Resource URL (optional)"
                          value={step.resourceUrl}
                          onChange={(e) => handleChangeStep(index, "resourceUrl", e.target.value)}
                          error={!!(errors.steps[index] && errors.steps[index].resourceUrl)}
                          helperText={errors.steps[index]?.resourceUrl || "Optional: Add a link to helpful resources"}
                          InputProps={{
                            startAdornment: <LinkIcon sx={{ mr: 1, color: alpha(accentColor, 0.5) }} fontSize="small" />
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleAddStep}
                sx={{ 
                  borderColor: accentColor, 
                  color: accentColor,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: secondaryColor,
                    backgroundColor: alpha(primaryColor, 0.1)
                  }
                }}
              >
                Add Another Step
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: alpha(primaryColor, 0.3) }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting || submitSuccess}
              sx={{
                py: 1.5,
                px: 5,
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
              {isSubmitting ? "Saving..." : "Create Plan"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default AddProgress;