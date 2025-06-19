const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['blog', 'video', 'social']
  },
  keywords: [String],
  industry: String,
  saved: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('idea', IdeaSchema);