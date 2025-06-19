const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const axios = require('axios');
const config = require('config');

const Idea = require('../models/Idea');
const User = require('../models/User');

// @route   GET api/ideas
// @desc    Get all user's ideas
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort({ date: -1 });
    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ideas
// @desc    Create a new idea
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('contentType', 'Content type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, contentType, keywords, industry } = req.body;

      const newIdea = new Idea({
        title,
        description,
        contentType,
        keywords,
        industry,
        user: req.user.id
      });

      const idea = await newIdea.save();

      res.json(idea);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/ideas/generate
// @desc    Generate content ideas using AI
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { contentType, industry, topic } = req.body;

    if (!contentType || !industry || !topic) {
      return res.status(400).json({ msg: 'Please provide content type, industry, and topic' });
    }

    // This would be replaced with actual OpenAI API call
    // For demo purposes, we're returning mock data
    // const openaiApiKey = config.get('openaiApiKey');
    // const response = await axios.post('https://api.openai.com/v1/completions', 
    //   {
    //     model: "gpt-4",
    //     prompt: `Generate 5 ${contentType} content ideas for the ${industry} industry about ${topic}. Format as JSON array.`,
    //     max_tokens: 1000
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${openaiApiKey}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    
    // Mock response for demo
    const mockIdeas = [
      {
        title: `5 Ways ${topic} is Transforming the ${industry} Industry`,
        description: `An in-depth look at how ${topic} is changing the landscape of ${industry} businesses.`,
        contentType,
        keywords: [topic, industry, 'transformation', 'innovation'],
        industry
      },
      {
        title: `The Ultimate Guide to ${topic} for ${industry} Professionals`,
        description: `A comprehensive guide explaining how professionals in the ${industry} industry can leverage ${topic}.`,
        contentType,
        keywords: [topic, industry, 'guide', 'professional development'],
        industry
      },
      {
        title: `${topic} Case Studies: Success Stories from the ${industry} Sector`,
        description: `Real-world examples of how companies in the ${industry} industry successfully implemented ${topic}.`,
        contentType,
        keywords: [topic, industry, 'case study', 'success story'],
        industry
      }
    ];

    res.json(mockIdeas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ideas/:id
// @desc    Get idea by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ideas/:id
// @desc    Update an idea
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { title, description, contentType, keywords, industry, saved } = req.body;

    if (title) idea.title = title;
    if (description) idea.description = description;
    if (contentType) idea.contentType = contentType;
    if (keywords) idea.keywords = keywords;
    if (industry) idea.industry = industry;
    if (saved !== undefined) idea.saved = saved;

    await idea.save();

    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ideas/:id
// @desc    Delete an idea
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await idea.deleteOne();

    res.json({ msg: 'Idea removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;