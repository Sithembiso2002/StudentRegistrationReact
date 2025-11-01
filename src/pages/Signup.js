import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (!form.username.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      return setErr('All fields are required.');
    }

    if (form.password !== form.confirmPassword) {
      return setErr('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        username: form.username.trim(),
        password: form.password.trim(),
        role: 'staff' // optional: default role
      });

      if (res.data?.user) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => nav('/login'), 2000);
      } else {
        setErr('Unexpected response from server.');
      }
    } catch (e) {
      if (e.response) {
        setErr(e.response.data?.error || 'Failed to create account.');
      } else if (e.request) {
        setErr('Network error: unable to reach the server.');
      } else {
        setErr('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={420} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Sign Up</Typography>
        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(prev => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            margin="normal"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm(prev => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          <Box sx={{ position: 'relative', mt: 2 }}>
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.main',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Button size="small" onClick={() => nav('/login')}>Login here</Button>
        </Typography>
      </Paper>
    </Box>
  );
}
