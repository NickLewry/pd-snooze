const log = (...args) => {
  if (process.env.NODE_ENV === 'test') {
    return () => ({});
  }

  return console.log(...args);
};

module.exports = log;
