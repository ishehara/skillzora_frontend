// src/pages/UpdateProgress.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Divider
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProgress } from "./ProgressCheckerService";

const UpdateProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;

  const [recipeTitle, setRecipeTitle] = useState("");
  const [steps, setSteps] = useState([]);
  const [editId, setEditId] = useState(null);

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

  const handleSubmit = async () => {
    try {
      await updateProgress(editId, {
        userId: editData.userId,
        recipeTitle,
        steps
      });
      navigate("/ProgressChecker");
    } catch (err) {
      console.error("❌ Failed to update progress", err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Update Cooking Progress Plan
      </Typography>

      <TextField
        fullWidth
        label="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      {steps.map((step, index) => (
        <Box key={index} mb={2}>
          <TextField
            fullWidth
            label={`Step ${index + 1} Title`}
            value={step.stepTitle}
            onChange={(e) =>
              handleChangeStep(index, "stepTitle", e.target.value)
            }
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={step.description}
            onChange={(e) =>
              handleChangeStep(index, "description", e.target.value)
            }
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Resource URL"
            value={step.resourceUrl}
            onChange={(e) =>
              handleChangeStep(index, "resourceUrl", e.target.value)
            }
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddStep} sx={{ mb: 2 }}>
        Add Another Step
      </Button>
      <br />
      <Button variant="contained" onClick={handleSubmit}>
        Update Plan
      </Button>

      <Divider sx={{ mt: 4 }} />
    </Container>
  );
};

export default UpdateProgress;
