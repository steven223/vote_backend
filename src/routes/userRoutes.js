const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

//  Create a new user
router.post('/', userController.createUser);

// Get all users 
router.get('/allUsers', userController.getAllUsers);

// user by ID
router.get('/:id', userController.getUserById);

module.exports = router;