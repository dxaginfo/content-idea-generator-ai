import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import GenerateIdeas from './pages/GenerateIdeas';
import SavedIdeas from './pages/SavedIdeas';
import NotFound from './pages/NotFound';

// Components
import AlertComponent from './components/AlertComponent';
import PrivateRoute from './components/PrivateRoute';

// Redux actions
import { loadUser } from './features/auth/authSlice';
import { setAuthToken } from './utils/setAuthToken';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c',
    },
    secondary: {
      main: '#ff6d00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
});

// Check if token is in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertComponent />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PrivateRoute component={Dashboard} />} />
          <Route path="generate" element={<PrivateRoute component={GenerateIdeas} />} />
          <Route path="saved" element={<PrivateRoute component={SavedIdeas} />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;