const pollService = require('../services/pollService');

const createPoll = async (req, res) => {
  try {
    const { question, options, createdBy, isPublished = false } = req.body;
    
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'Question and at least 2 options are required' 
      });
    }

    if (!createdBy) {
      return res.status(400).json({ 
        error: 'Creator ID is required' 
      });
    }

    const poll = await pollService.createPoll({
      question,
      options,
      createdBy,
      isPublished
    });
    
    res.status(201).json({
      success: true,
      data: poll
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create poll',
      details: error.message 
    });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const { published } = req.query;
    const polls = await pollService.getAllPolls(published === 'true');
    
    res.json({
      success: true,
      data: polls
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get polls',
      details: error.message 
    });
  }
};

const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const poll = await pollService.getPollById(id);
    
    if (!poll) {
      return res.status(404).json({ 
        error: 'Poll not found' 
      });
    }
    
    res.json({
      success: true,
      data: poll
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get poll',
      details: error.message 
    });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById
};