const bcrypt = require('bcrypt');
const prisma = require('../config/database');

const createUser = async ({ name, email, password }) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return await prisma.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      polls: {
        include: {
          options: {
            include: {
              _count: {
                select: { votes: true }
              }
            }
          }
        }
      }
    }
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          polls: true,
          votes: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers
};