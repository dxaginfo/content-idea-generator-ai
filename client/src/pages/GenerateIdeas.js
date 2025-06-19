import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { generateIdea, createIdea, clearGeneratedIdea } from '../features/ideas/ideaSlice';

// Content types
const contentTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'video', label: 'Video Content' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'podcast', label: 'Podcast Episode' }
];

const GenerateIdeas = () => {
  const dispatch = useDispatch();
  const { generatedIdea, loading } = useSelector(state => state.ideas);

  const [formData, setFormData] = useState({
    topic: '',
    type: 'blog',
    keywords: ''
  });

  const [savedToDb, setSavedToDb] = useState(false);

  const { topic, type, keywords } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    dispatch(generateIdea({ topic, type, keywords }));
    setSavedToDb(false);
  };

  const handleSave = () => {
    if (generatedIdea) {
      dispatch(createIdea({
        title: generatedIdea.title,
        category: type,
        content: generatedIdea.content,
        isPublished: false
      }));
      setSavedToDb(true);
    }
  };

  const handleClear = () => {
    dispatch(clearGeneratedIdea());
    setSavedToDb(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generate Content Ideas
      </Typography>
      <Typography variant="body1" paragraph>
        Enter a topic, select the content type, and add optional keywords to generate creative content ideas.
      </Typography>

      {/* Generation Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <TextField
                label="Topic"
                name="topic"
                value={topic}
                onChange={onChange}
                fullWidth
                required
                placeholder="E.g., Digital Marketing, Fitness, Cooking"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Content Type"
                name="type"
                value={type}
                onChange={onChange}
                fullWidth
                required
                variant="outlined"
              >
                {contentTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Keywords (comma separated)"
                name="keywords"
                value={keywords}
                onChange={onChange}
                fullWidth
                placeholder="E.g., trending, beginner, howto"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendIcon />}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Ideas'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Generated Content */}
      {generatedIdea && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              Generated Idea
            </Typography>
            <Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClear}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={savedToDb ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleSave}
                disabled={savedToDb}
              >
                {savedToDb ? 'Saved' : 'Save Idea'}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {generatedIdea.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={contentTypes.find(ct => ct.value === type)?.label || type} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                {keywords.split(',').filter(k => k.trim()).map((keyword, index) => (
                  <Chip 
                    key={index}
                    label={keyword.trim()} 
                    variant="outlined" 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                {generatedIdea.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => {}}>
                Edit
              </Button>
              <Button size="small" color="primary" onClick={() => {}}>
                Copy to Clipboard
              </Button>
            </CardActions>
          </Card>

          {generatedIdea.suggestions && (
            <>
              <Typography variant="h6" gutterBottom>
                Additional Content Suggestions
              </Typography>
              <Grid container spacing={2}>
                {generatedIdea.suggestions.map((suggestion, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {suggestion.title}
                        </Typography>
                        <Typography variant="body2">
                          {suggestion.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      )}

      {/* Tips for Better Results */}
      {!generatedIdea && !loading && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tips for Better Results
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Be Specific
                </Typography>
                <Typography variant="body2">
                  Use specific topics rather than broad ones. "Email marketing for small businesses" 
                  will generate better results than just "marketing".
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Keywords
                </Typography>
                <Typography variant="body2">
                  Include relevant keywords to guide the AI. Keywords like "beginner", "advanced", 
                  "tutorial", or "case study" help shape the content direction.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Try Different Types
                </Typography>
                <Typography variant="body2">
                  Experiment with different content types for the same topic to see various perspectives 
                  and approaches for your content strategy.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default GenerateIdeas;