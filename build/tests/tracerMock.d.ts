/// <reference types="jest" />
export declare const getTracerMock: () => {
    traceCall: jest.Mock<any, any>;
    tracingIdToString: jest.Mock<any, any>;
    tracingIdFromString: jest.Mock<any, any>;
};
export declare const getSpanMock: () => {
    log: jest.Mock<any, any>;
    addTags: jest.Mock<any, any>;
};
