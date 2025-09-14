const express = require('express');
const voteController = require('../controllers/voteController');

const router = express.Router();

// Cast a vote
router.post('/', voteController.castVote);

module.exports = router;