"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.getTracerMock = () => tracerMock;
exports.getSpanMock = () => spanMock;
