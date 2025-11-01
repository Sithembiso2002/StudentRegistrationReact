import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  Avatar,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  TextField,
  useTheme,
  Tooltip as MuiTooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { motion } from 'framer-motion';

import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CakeIcon from '@mui/icons-material/Cake';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import StarIcon from '@mui/icons-material/Star';

// Recharts imports
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

// images
import cakeImage from './assets/1.png';
import bakeryImage from './assets/b1.png';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const DRAWER_WIDTH = 260;

export default function AdminPage() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('dashboard');

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res = await axios.get(`${API}/api/stats/overview`, {
        headers: { Authorization: 'Bearer ' + getToken() },
      });
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  const COLORS = ['#FF6F61', '#6B5B95', '#88B04B', '#FFA500'];

  const statCards = [
    { title: 'Total Orders', value: stats?.total ?? '—', icon: <LocalCafeIcon sx={{ fontSize: 36, color: '#FF6F61' }} /> },
    { title: 'Pending Orders', value: stats?.pending ?? '—', icon: <CakeIcon sx={{ fontSize: 36, color: '#6B5B95' }} /> },
    { title: 'Completed Orders', value: stats?.completed ?? '—', icon: <BakeryDiningIcon sx={{ fontSize: 36, color: '#88B04B' }} /> },
    { title: 'Top Product', value: stats?.topProduct ?? '—', icon: <EmojiFoodBeverageIcon sx={{ fontSize: 36, color: '#FFA500' }} /> },
  ];

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { key: 'orders', label: 'Orders', icon: <ListAltIcon /> },
    { key: 'products', label: 'Products', icon: <Inventory2Icon /> },
    { key: 'users', label: 'Users', icon: <PeopleIcon /> },
    { key: 'reports', label: 'Reports', icon: <BarChartIcon /> },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  function toggleDrawer() {
    setMobileOpen(!mobileOpen);
  }

  function handleProfileOpen(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleProfileClose() {
    setAnchorEl(null);
  }
  function handleNavClick(key) {
    setActive(key);
  }

  const SidebarContent = (
    <Box sx={{ width: DRAWER_WIDTH, p: 2, height: '100%', background: 'linear-gradient(180deg,#fff,#fff8f2)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ bgcolor: '#6b3e26' }}>SC</Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Sweet Crust</Typography>
          <Typography variant="caption" color="text.secondary">Admin Panel</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        {sidebarItems.map(item => (
          <ListItemButton
            key={item.key}
            component={Link}
            to={`/${item.key}`}
            selected={active === item.key}
            onClick={() => handleNavClick(item.key)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': { background: 'rgba(107,62,38,0.08)' }
            }}
          >
            <ListItemIcon sx={{ color: '#6b3e26' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">Quick links</Typography>
        <List>
          <ListItemButton component={Link} to="/create-order">
            <ListItemIcon><ListAltIcon /></ListItemIcon>
            <ListItemText primary="Create Order" />
          </ListItemButton>
          <ListItemButton component={Link} to="/view-reports">
            <ListItemIcon><BarChartIcon /></ListItemIcon>
            <ListItemText primary="View Reports" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fffaf6' }}>
      <Drawer
        variant="persistent"
        open={!mobileOpen}
        sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
      >
        {SidebarContent}
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <AppBar position="static" sx={{ background: '#6b3e26', boxShadow: 3 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Admin Dashboard</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search orders, customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, width: { xs: 120, sm: 220, md: 320 } }}
                InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
              />
            </Box>
            <MuiTooltip title="Notifications">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={0} color="error"><NotificationsNoneIcon /></Badge>
              </IconButton>
            </MuiTooltip>
            <IconButton color="inherit" onClick={handleProfileOpen}><AccountCircle /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
              <MenuItem onClick={() => { alert('Profile (placeholder)'); handleProfileClose(); }}>Profile</MenuItem>
              <MenuItem onClick={() => { alert('Logout (placeholder)'); handleProfileClose(); }}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* Welcome Section */}
          <Box sx={{ p: 4, borderRadius: 2, mb: 3, background: 'linear-gradient(135deg, #ffe0b2, #fff3e0)' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6b3e26' }}>Welcome to Sweet Crust Bakery Admin</Typography>
              <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                Manage orders, monitor performance, and keep everything running smoothly.
              </Typography>
            </motion.div>
          </Box>

          {/* Stat Cards */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#4E342E' }}>Overview</Typography>
          <Grid container spacing={3} mb={4}>
            {statCards.map((card, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, boxShadow: 4, background: 'linear-gradient(135deg,#fff7f0,#fff)' }}>
                    <Avatar sx={{ bgcolor: '#fff', color: '#6b3e26' }}>{card.icon}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">{card.title}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{card.value}</Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, borderRadius: 2, boxShadow: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Orders by Status</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={stats?.byStatus || []} dataKey="count" nameKey="order_status" outerRadius={100} label>
                      {(stats?.byStatus || []).map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, borderRadius: 2, boxShadow: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Top Products</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.topProducts || []}>
                    <XAxis dataKey="product_ordered" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6b3e26" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Images / Cards Section */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={6}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 4, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                  <img src={cakeImage} alt="Cake" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 250, marginBottom: 10 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>Boost your bakery sales by tracking orders efficiently!</Typography>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card sx={{ p: 2, borderRadius: 2, boxShadow: 4, textAlign: 'center', backgroundColor: '#e0f7fa' }}>
                  <img src={bakeryImage} alt="Bakery" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 250, marginBottom: 10 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>Visualize top-selling products and pending orders at a glance!</Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Customer Reviews */}
          <Box textAlign="center" sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ color: '#6b3e26', fontWeight: 700, mb: 2 }}>What Our Customers Say</Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                { name: 'Mpho', text: 'The cakes are heavenly, and service is amazing!' },
                { name: 'Lerato', text: 'Loved the delivery speed and quality of pastries.' },
                { name: 'Teboho', text: 'Best bakery in town — 5 stars!' },
              ].map((review, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>"{review.text}"</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#6b3e26' }}>
                      <StarIcon sx={{ color: '#FFA500', fontSize: 16, mr: 0.5 }} />
                      {review.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', py: 3, mt: 4, backgroundColor: '#6b3e26', color: 'white', borderRadius: 1 }}>
            <Typography variant="body2">© 2025 Sweet Crust Bakery. All rights reserved.</Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Made with ❤️ by Sweet Crust Dev Team</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
