const pollService = require('../services/pollService');

const handlePollSocket = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a poll room for real-time updates
  socket.on('poll:join', async (pollId) => {
    try {
      // Verify poll exists
      const poll = await pollService.getPollById(pollId);
      if (!poll) {
        socket.emit('error', { message: 'Poll not found' });
        return;
      }

      socket.join(`poll:${pollId}`);
      console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
      
      // Send current poll data
      socket.emit('poll:joined', {
        pollId,
        poll,
        message: `Joined poll: ${poll.question}`
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join poll room' });
    }
  });

  // Leave a poll room
  socket.on('poll:leave', (pollId) => {
    socket.leave(`poll:${pollId}`);
    console.log(`Socket ${socket.id} left poll room: ${pollId}`);
    
    socket.emit('poll:left', {
      pollId,
      message: 'Left poll room'
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
};

module.exports = handlePollSocket;