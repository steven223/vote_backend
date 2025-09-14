const pollService = require('../services/pollService');

const handlePollSocket = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  const sendPollError = (message, pollId = null) => {
    socket.emit('poll:error', { pollId, message });
  };

  // Join a poll room for real-time updates
  socket.on('poll:join', async (pollId) => {
    try {
      if (!pollId) {
        sendPollError('Invalid poll ID');
        return;
      }

      // Verify poll exists
      const poll = await pollService.getPollById(pollId);
      if (!poll) {
        sendPollError('Poll not found', pollId);
        return;
      }

      // Join room
      const room = `poll:${pollId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
      
      // Notify this socket
      socket.emit('poll:joined', {
        pollId,
        poll,
        message: `Joined poll: ${poll.question}`
      });

      // Notify others in room (scalable updates)
      socket.to(room).emit('poll:userJoined', { pollId, userId: socket.id });

      // Optional: broadcast updated participant count
      const clients = io.sockets.adapter.rooms.get(room) || new Set();
      io.to(room).emit('poll:participants', {
        pollId,
        count: clients.size
      });
    } catch (error) {
      console.error(`Join error for ${socket.id}:`, error);
      sendPollError('Failed to join poll room', pollId);
    }
  });

  // Leave a poll room
  socket.on('poll:leave', (pollId) => {
    const room = `poll:${pollId}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} left poll room: ${pollId}`);
    
    socket.emit('poll:left', {
      pollId,
      message: 'Left poll room'
    });

    // Notify others in room
    socket.to(room).emit('poll:userLeft', { pollId, userId: socket.id });

    // Update participant count
    const clients = io.sockets.adapter.rooms.get(room) || new Set();
    io.to(room).emit('poll:participants', {
      pollId,
      count: clients.size
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // If you want, you could track which polls the socket was in and update counts here too
  });

  // Handle unexpected socket errors safely
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
    sendPollError('An unexpected error occurred');
  });
};

module.exports = handlePollSocket;
