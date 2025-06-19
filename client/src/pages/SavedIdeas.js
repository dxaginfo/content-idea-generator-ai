import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SortIcon from '@mui/icons-material/Sort';
import { getIdeas, deleteIdea } from '../features/ideas/ideaSlice';

const SavedIdeas = () => {
  const dispatch = useDispatch();
  const { ideas, loading } = useSelector(state => state.ideas);
  
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filterOpen = Boolean(filterAnchorEl);
  const sortOpen = Boolean(sortAnchorEl);

  useEffect(() => {
    dispatch(getIdeas());
  }, [dispatch]);

  useEffect(() => {
    // Get only saved ideas
    const savedIdeas = ideas.filter(idea => idea.isSaved);
    
    // Apply filters
    let result = savedIdeas;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        idea => 
          idea.title.toLowerCase().includes(term) ||
          idea.content.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(idea => idea.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredIdeas(result);
  }, [ideas, searchTerm, selectedCategory, sortBy]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleFilterClose();
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    handleSortClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteIdea = (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      dispatch(deleteIdea(id));
    }
  };

  // Get unique categories for filter menu
  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];

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
      <Typography variant="h4" gutterBottom>
        Saved Ideas
      </Typography>
      <Typography variant="body1" paragraph>
        Browse and manage your saved content ideas.
      </Typography>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search ideas..."
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        
        <Box>
          <IconButton 
            aria-label="filter" 
            onClick={handleFilterClick}
            color={selectedCategory !== 'all' ? 'primary' : 'default'}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={filterOpen}
            onClose={handleFilterClose}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Filter by Category
            </Typography>
            <Divider />
            {categories.map((category) => (
              <MenuItem 
                key={category} 
                onClick={() => handleCategorySelect(category)}
                selected={selectedCategory === category}
              >
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Menu>

          <IconButton 
            aria-label="sort" 
            onClick={handleSortClick}
            color={sortBy !== 'newest' ? 'primary' : 'default'}
          >
            <SortIcon />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={sortOpen}
            onClose={handleSortClose}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Sort by
            </Typography>
            <Divider />
            <MenuItem onClick={() => handleSortSelect('newest')} selected={sortBy === 'newest'}>
              Newest First
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('oldest')} selected={sortBy === 'oldest'}>
              Oldest First
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('title')} selected={sortBy === 'title'}>
              Title (A-Z)
            </MenuItem>
          </Menu>
        </Box>
      </Paper>

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <Grid container spacing={3}>
          {filteredIdeas.map(idea => (
            <Grid item xs={12} sm={6} md={4} key={idea._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {idea.title}
                  </Typography>
                  <Chip 
                    label={idea.category} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {idea.content.substring(0, 150)}...
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    component={RouterLink} 
                    to={`/ideas/${idea._id}`}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteIdea(idea._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No saved ideas found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try changing your search or filter settings.'
              : 'You haven\'t saved any ideas yet. Generate and save ideas to see them here.'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={RouterLink}
            to="/generate"
          >
            Generate Ideas
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default SavedIdeas;