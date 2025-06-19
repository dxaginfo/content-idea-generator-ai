import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import store from './store';
import { loadUser } from './features/auth/authSlice';
import { setAuthToken } from './utils/setAuthToken';

// Layout
import MainLayout from './layouts/MainLayout';

// Components
import AlertComponent from './components/AlertComponent';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import GenerateIdeas from './pages/GenerateIdeas';
import SavedIdeas from './pages/SavedIdeas';
import NotFound from './pages/NotFound';

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
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
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;