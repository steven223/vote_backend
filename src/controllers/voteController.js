const voteService = require('../services/voteService');

const castVote = async (req, res) => {
  try {
    const { userId, pollOptionId } = req.body;
    
    if (!userId || !pollOptionId) {
      return res.status(400).json({ 
        error: 'User ID and poll option ID are required' 
      });
    }

    const result = await voteService.castVote(userId, pollOptionId, req.io);
    
    res.status(201).json({
      success: true,
      data: result.vote,
      message: 'Vote cast successfully'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'User has already voted for this option' 
      });
    }
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to cast vote',
      details: error.message 
    });
  }
};

module.exports = {
  castVote
};