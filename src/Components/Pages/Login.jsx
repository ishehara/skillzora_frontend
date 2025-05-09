import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.id); // ✅ Save userId
      console.log("Token:", res.data.token);
      console.log("UserID:", res.data.id);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };
  

  return (
    <Container
      maxWidth="xs"
      sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}
    >
      <Box
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 5,
          borderBottom: '6px solid #FFB300',
          width: '100%',
          bgcolor: 'white'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login to SkillZora
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Username or Email"
          margin="normal"
          name="usernameOrEmail"
          value={form.usernameOrEmail}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#FFB300',
            '&:hover': { backgroundColor: '#FFA000' }
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
