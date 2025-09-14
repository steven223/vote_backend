const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validatePollOptions = (options) => {
  return Array.isArray(options) && 
         options.length >= 2 && 
         options.every(option => typeof option === 'string' && option.trim().length > 0);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePollOptions
};