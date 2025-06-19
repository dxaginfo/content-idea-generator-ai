import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DRAWER_WIDTH = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar drawerWidth={DRAWER_WIDTH} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
        }}
      >
        <Toolbar /> {/* This adds space below the app bar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;