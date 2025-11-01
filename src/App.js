import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { getToken, logout } from './utils/auth';
import { Box } from '@mui/material';


import ManageOrders from './pages/ManageOrders';
import CompletedOrders from './pages/CompletedOrders';
import logo from './pages/assets/logo2.png';

export default function App() {
  const navigate = useNavigate();
  const token = getToken(); 

  return (
    <div>
      <AppBar
  position="static"
  style={{ backgroundColor: '#a79d3fff' }}
>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={logo} 
              alt="Sweet Crust Bakery"
              style={{ height: 50 }}
            />
          </Box>
          {!token ? (
            
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                Orders
              </Button>

              
              
              <Button color="inherit" component={Link} to="/manage-orders">
                Manage Orders
              </Button>
              <Button color="inherit" component={Link} to="/completed-orders">
                Completed
              </Button>

              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          
          {!token && (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}

          
          {token && (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />

             
              <Route path="/manage-orders" element={<ManageOrders />} />
              <Route path="/completed-orders" element={<CompletedOrders />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Container>
    </div>
  );
}
