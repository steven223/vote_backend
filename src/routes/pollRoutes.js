const express = require('express');
const pollController = require('../controllers/pollController');

const router = express.Router();

// Create Poll
router.post('/', pollController.createPoll);

// Get All Polls
router.get('/', pollController.getAllPolls);

// Get Pole By Id
router.get('/:id', pollController.getPollById);

module.exports = router;