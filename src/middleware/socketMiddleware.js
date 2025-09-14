// Middleware to attach Socket.IO instance to request object
const attachSocketIO = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};

module.exports = {
  attachSocketIO
};