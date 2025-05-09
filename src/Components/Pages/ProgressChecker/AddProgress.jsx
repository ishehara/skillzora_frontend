// ✅ AddProgress.jsx - Page to Add/Update Progress
import React, { useState } from "react";
import {
  Box, Button, Container, TextField, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addProgress } from "./ProgressCheckerService";

const AddProgress = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [steps, setSteps] = useState([
    { stepTitle: "", description: "", resourceUrl: "", completed: false }
  ]);

  const handleAddStep = () => {
    setSteps([...steps, { stepTitle: "", description: "", resourceUrl: "", completed: false }]);
  };

  const handleChangeStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleSubmit = async () => {
    const data = { userId, recipeTitle, steps };
    try {
      await addProgress(data);
      navigate("/progress");
    } catch (err) {
      console.error("❌ Failed to save progress", err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Cooking Progress
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
            onChange={(e) => handleChangeStep(index, "stepTitle", e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={step.description}
            onChange={(e) => handleChangeStep(index, "description", e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Resource URL (optional)"
            value={step.resourceUrl}
            onChange={(e) => handleChangeStep(index, "resourceUrl", e.target.value)}
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddStep} sx={{ mb: 2 }}>
        Add Another Step
      </Button>
      <br />
      <Button variant="contained" onClick={handleSubmit}>Create Plan</Button>
    </Container>
  );
};

export default AddProgress;
