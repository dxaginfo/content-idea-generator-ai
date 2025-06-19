import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';

// Get all ideas
export const getIdeas = createAsyncThunk(
  'ideas/getIdeas',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/ideas');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.msg || 'Failed to fetch ideas');
    }
  }
);

// Create an idea
export const createIdea = createAsyncThunk(
  'ideas/createIdea',
  async ({ title, category, content, isPublished = false }, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ title, category, content, isPublished });

    try {
      const res = await axios.post('/api/ideas', body, config);
      dispatch(setAlert({ msg: 'Idea created successfully!', type: 'success' }));
      return res.data;
    } catch (err) {
      dispatch(setAlert({ msg: err.response.data.msg || 'Failed to create idea', type: 'error' }));
      return rejectWithValue(err.response.data.msg || 'Failed to create idea');
    }
  }
);

// Generate idea with AI
export const generateIdea = createAsyncThunk(
  'ideas/generateIdea',
  async ({ topic, type, keywords }, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ topic, type, keywords });

    try {
      const res = await axios.post('/api/ideas/generate', body, config);
      return res.data;
    } catch (err) {
      dispatch(setAlert({ msg: err.response.data.msg || 'Failed to generate idea', type: 'error' }));
      return rejectWithValue(err.response.data.msg || 'Failed to generate idea');
    }
  }
);

// Update an idea
export const updateIdea = createAsyncThunk(
  'ideas/updateIdea',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/ideas/${id}`, formData, config);
      dispatch(setAlert({ msg: 'Idea updated successfully!', type: 'success' }));
      return res.data;
    } catch (err) {
      dispatch(setAlert({ msg: err.response.data.msg || 'Failed to update idea', type: 'error' }));
      return rejectWithValue(err.response.data.msg || 'Failed to update idea');
    }
  }
);

// Delete an idea
export const deleteIdea = createAsyncThunk(
  'ideas/deleteIdea',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/api/ideas/${id}`);
      dispatch(setAlert({ msg: 'Idea removed successfully!', type: 'success' }));
      return id;
    } catch (err) {
      dispatch(setAlert({ msg: err.response.data.msg || 'Failed to delete idea', type: 'error' }));
      return rejectWithValue(err.response.data.msg || 'Failed to delete idea');
    }
  }
);

// Initial state
const initialState = {
  ideas: [],
  generatedIdea: null,
  idea: null,
  loading: false,
  error: null
};

// Slice
const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearIdea: (state) => {
      state.idea = null;
    },
    clearGeneratedIdea: (state) => {
      state.generatedIdea = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get ideas cases
      .addCase(getIdeas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.ideas = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create idea cases
      .addCase(createIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(createIdea.fulfilled, (state, action) => {
        state.ideas.unshift(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate idea cases
      .addCase(generateIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateIdea.fulfilled, (state, action) => {
        state.generatedIdea = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(generateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update idea cases
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.ideas = state.ideas.map(idea => 
          idea._id === action.payload._id ? action.payload : idea
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete idea cases
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.ideas = state.ideas.filter(idea => idea._id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearIdea, clearGeneratedIdea } = ideaSlice.actions;

export default ideaSlice.reducer;