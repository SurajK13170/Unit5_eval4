const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log' }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

const logError = (error) => {
  logger.error(error);
};

module.exports = { logError };
