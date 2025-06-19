const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define routes
app.get('/api', (req, res) => {
  res.json({ msg: 'Welcome to the AI Content Idea Generator API' });
});

// Define API routes here
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/ideas', require('./routes/ideas'));
// app.use('/api/trends', require('./routes/trends'));
// app.use('/api/calendar', require('./routes/calendar'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));