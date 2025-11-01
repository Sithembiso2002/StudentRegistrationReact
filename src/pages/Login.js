import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');

    if (!form.username.trim() || !form.password.trim()) {
      return setErr('Please fill in both username and password.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        username: form.username.trim(),
        password: form.password.trim(),
      });

      if (res.data?.token) {
        saveToken(res.data.token, form.remember);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => nav('/'), 1200);
      } else {
        setErr('Unexpected response from server.');
      }
    } catch (e) {
      if (e.response) {
        setErr(e.response.data?.error || 'Invalid username or password.');
      } else if (e.request) {
        setErr('Network error: unable to reach the server.');
      } else {
        setErr('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box maxWidth={420} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Login
        </Typography>
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
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />

          {err && (
            <Typography color="error" sx={{ mt: 1 }}>
              {err}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}

          <Box sx={{ position: 'relative', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
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
          Don't have an account?{' '}
          <Button size="small" onClick={() => nav('/Signup')}>
            Sign up here
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
