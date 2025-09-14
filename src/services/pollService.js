const prisma = require('../config/database');

const createPoll = async ({ question, options, createdBy, isPublished }) => {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: createdBy }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.poll.create({
    data: {
      question,
      isPublished,
      createdBy,
      options: {
        create: options.map(optionText => ({
          text: optionText
        }))
      }
    },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

const getAllPolls = async (publishedOnly = false) => {
  const whereClause = publishedOnly ? { isPublished: true } : {};
  
  return await prisma.poll.findMany({
    where: whereClause,
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getPollById = async (id) => {
  return await prisma.poll.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

const getPollWithVoteCounts = async (pollId) => {
  return await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      }
    }
  });
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  getPollWithVoteCounts
};