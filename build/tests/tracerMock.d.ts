/// <reference types="jest" />
export declare const getTracerMock: () => {
    traceCall: jest.Mock<{}>;
    tracingIdToString: jest.Mock<{}>;
    tracingIdFromString: jest.Mock<{}>;
};
export declare const getSpanMock: () => {
    log: jest.Mock<{}>;
    addTags: jest.Mock<{}>;
};
