import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getIdeas } from '../features/ideas/ideaSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { ideas, loading } = useSelector(state => state.ideas);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getIdeas());
  }, [dispatch]);

  // Get recent and saved ideas
  const recentIdeas = ideas.slice(0, 3);
  const savedIdeas = ideas.filter(idea => idea.isSaved).slice(0, 3);

  // Calculate statistics
  const totalIdeas = ideas.length;
  const savedCount = ideas.filter(idea => idea.isSaved).length;
  const publishedCount = ideas.filter(idea => idea.isPublished).length;

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back, {user && user.name}
        </Typography>
        <Typography variant="body1">
          Generate creative content ideas for your next project
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/generate"
          sx={{ px: 3 }}
        >
          Generate New Ideas
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<BookmarkIcon />}
          component={RouterLink}
          to="/saved"
        >
          View Saved Ideas
        </Button>
      </Box>

      {/* Statistics */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Your Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LightbulbIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Ideas</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {totalIdeas}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'secondary.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BookmarkIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Saved Ideas</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {savedCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'info.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Published</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {publishedCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Ideas */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Recently Generated Ideas
      </Typography>
      {recentIdeas.length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {recentIdeas.map(idea => (
            <Grid item xs={12} md={4} key={idea._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {idea.title}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={idea.category} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {idea.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/ideas/${idea._id}`}>
                    View
                  </Button>
                  <Button size="small" color="secondary">
                    Save
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You haven't generated any ideas yet. Get started by creating your first idea!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/generate"
            sx={{ mt: 2 }}
          >
            Generate Ideas
          </Button>
        </Paper>
      )}

      {/* Saved Ideas */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Saved Ideas
      </Typography>
      {savedIdeas.length > 0 ? (
        <Grid container spacing={3}>
          {savedIdeas.map(idea => (
            <Grid item xs={12} md={4} key={idea._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {idea.title}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={idea.category} 
                    color="secondary" 
                    variant="outlined" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {idea.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/ideas/${idea._id}`}>
                    View
                  </Button>
                  <Button size="small" color="error">
                    Unsave
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            You don't have any saved ideas yet. Save ideas to access them quickly later.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BookmarkIcon />}
            sx={{ mt: 2 }}
            disabled={recentIdeas.length === 0}
          >
            Save an Idea
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;