const tracerMock = {
  traceCall: jest.fn().mockImplementation(async (name, call) => {
    await call(spanMock);
  }),
  tracingIdToString: jest.fn(),
  tracingIdFromString: jest.fn().mockImplementation(tracingId => tracingId),
};

const spanMock = {
  log: jest.fn(),
  addTags: jest.fn(),
};

export const getTracerMock = () => tracerMock;

export const getSpanMock = () => spanMock;
