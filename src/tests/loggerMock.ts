const loggerMock = {
  info: () => null,
  error: () => null,
  log: () => null,
  warn: () => null,
  verbose: () => null,
  debug: () => null,
};

export const getLoggerMock = () => loggerMock;
