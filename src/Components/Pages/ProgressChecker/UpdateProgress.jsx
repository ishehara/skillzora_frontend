import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProgress } from "./ProgressCheckerService";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UpdateProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

  const [recipeTitle, setRecipeTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (editData) {
      setRecipeTitle(editData.recipeTitle);
      setSteps(editData.steps);
      setEditId(editData._id || editData.id);
    }
  }, [editData]);

  const handleChangeStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { stepTitle: "", description: "", resourceUrl: "", completed: false }
    ]);
  };

  const handleRemoveStep = (index) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  const handleSubmit = async () => {
    if (!recipeTitle.trim()) {
      setSnackbarMessage("Recipe title is required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsLoading(true);
      await updateProgress(editId, {
        userId: editData.userId,
        recipeTitle,
        steps
      });
      setSnackbarMessage("Progress plan updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
      // Delay navigation to allow user to see the success message
      setTimeout(() => {
        navigate("/ProgressChecker");
      }, 1500);
    } catch (err) {
      console.error("❌ Failed to update progress", err);
      setSnackbarMessage("Failed to update progress plan");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => navigate("/ProgressChecker")} 
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Update Cooking Progress Plan
          </Typography>
        </Box>

        {isLoading && <LinearProgress sx={{ mb: 3 }} />}

        <TextField
          fullWidth
          label="Recipe Title"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
          sx={{ mb: 4 }}
          required
          variant="outlined"
        />

        <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
          Cooking Steps
        </Typography>

        {steps.map((step, index) => (
          <Card key={index} sx={{ mb: 3, position: "relative" }} variant="outlined">
            <CardContent>
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveStep(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Step {index + 1}
              </Typography>
              
              <TextField
                fullWidth
                label="Step Title"
                value={step.stepTitle}
                onChange={(e) =>
                  handleChangeStep(index, "stepTitle", e.target.value)
                }
                sx={{ mb: 2 }}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={step.description}
                onChange={(e) =>
                  handleChangeStep(index, "description", e.target.value)
                }
                sx={{ mb: 2 }}
                multiline
                rows={2}
                variant="outlined"
              />
              
              <TextField
                fullWidth
                label="Resource URL (optional)"
                value={step.resourceUrl}
                onChange={(e) =>
                  handleChangeStep(index, "resourceUrl", e.target.value)
                }
                placeholder="https://example.com/recipe-resource"
                variant="outlined"
              />
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handleAddStep} 
            startIcon={<AddCircleIcon />}
            size="large"
          >
            Add Step
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate("/ProgressChecker")}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={isLoading}
            color="primary"
            size="large"
          >
            Update Plan
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateProgress;