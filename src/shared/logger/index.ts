import * as winston from "winston";

export const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGING_LEVEL || "debug",
      timestamp: () => new Date().toISOString()
    })
  ]
});
