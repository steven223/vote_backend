const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required'
      });
    }

    const user = await userService.createUser({ name, email, password });

    // Remove password from response
    const { passwordHash, ...userResponse } = user;

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }

    res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Remove password from response
    const { passwordHash, ...userResponse } = user;

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get user',
      details: error.message
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get users',
      details: error.message
    });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers
};