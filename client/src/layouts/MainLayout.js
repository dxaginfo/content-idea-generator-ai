import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../features/auth/authSlice';

// Navigation items
const navItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Generate Ideas', path: '/generate', icon: <LightbulbIcon /> },
  { text: 'Saved Ideas', path: '/saved', icon: <BookmarkIcon /> },
];

// User menu items
const userMenuItems = [
  { text: 'Profile', path: '/profile', icon: <AccountCircleIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const drawerWidth = 240;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  // Drawer state (mobile)
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // User menu state
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };

  // Drawer content
  const drawer = (
    <Box onClick={isMobile ? handleDrawerToggle : undefined} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main' }}>
        <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Content Idea Generator
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Button */}
            {isAuthenticated && isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <LightbulbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Content Idea Generator
            </Typography>

            {/* Mobile Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <LightbulbIcon sx={{ mr: 1, display: { xs: 'flex', md: 'none' } }} />
              Ideas
            </Typography>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{ 
                      my: 2, 
                      color: 'white', 
                      display: 'flex',
                      alignItems: 'center',
                      textTransform: 'none',
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      },
                      px: 2
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Auth Buttons or User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={user ? user.name : ''}
                        src={user && user.avatar ? user.avatar : ''}
                        sx={{ bgcolor: 'secondary.main' }}
                      >
                        {user && user.name ? user.name.charAt(0) : '?'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {user && (
                      <MenuItem disabled sx={{ opacity: 1 }}>
                        <Typography textAlign="center">Hi, {user.name}</Typography>
                      </MenuItem>
                    )}
                    <Divider />
                    {userMenuItems.map((item) => (
                      <MenuItem 
                        key={item.text} 
                        component={RouterLink} 
                        to={item.path}
                        onClick={handleCloseUserMenu}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <Typography textAlign="center">{item.text}</Typography>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><LogoutIcon /></ListItemIcon>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                !loading && (
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{ color: 'white', mr: 1 }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="secondary"
                    >
                      Register
                    </Button>
                  </Box>
                )
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for mobile */}
      {isAuthenticated && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={isMobile ? handleDrawerToggle : undefined}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: isMobile ? 'none' : 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              marginTop: '64px', // AppBar height
              height: 'calc(100% - 64px)'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, 
          p: 3,
          width: { md: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: isAuthenticated ? `${drawerWidth}px` : 0 },
          mt: '64px' // AppBar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;