import * as winston from "winston";

export const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      formatter: options =>
        JSON.stringify({
          "@timestamp": new Date().toISOString(),
          "@version": 1,
          application: process.env.APP_NAME,
          environment: process.env.NODE_ENV,
          host: process.env.HOST,
          message: options.message,
          severity: options.level,
          type: "stdin"
        }),
      level: process.env.LOGGING_LEVEL || "debug"
    })
  ]
});
