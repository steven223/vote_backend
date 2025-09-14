const prisma = require('../config/database');
const pollService = require('./pollService');

const castVote = async (userId, pollOptionId, io) => {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  // Verify poll option exists and get poll info
  const pollOption = await prisma.pollOption.findUnique({
    where: { id: pollOptionId },
    include: {
      poll: true
    }
  });
  
  if (!pollOption) {
    throw new Error('Poll option not found');
  }

  // Create the vote
  const vote = await prisma.vote.create({
    data: {
      userId,
      pollOptionId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      pollOption: {
        include: {
          poll: true
        }
      }
    }
  });

  // Get updated poll with vote counts
  const updatedPoll = await pollService.getPollWithVoteCounts(pollOption.pollId);
  
  // Broadcast real-time update to all clients in the poll room
  if (io) {
    io.to(`poll:${pollOption.pollId}`).emit('vote:update', {
      pollId: pollOption.pollId,
      poll: updatedPoll,
      newVote: {
        userId,
        pollOptionId,
        timestamp: vote.createdAt
      }
    });
  }

  return { vote, updatedPoll };
};

const getUserVotesForPoll = async (userId, pollId) => {
  return await prisma.vote.findMany({
    where: {
      userId,
      pollOption: {
        pollId
      }
    },
    include: {
      pollOption: true
    }
  });
};

module.exports = {
  castVote,
  getUserVotesForPoll
};