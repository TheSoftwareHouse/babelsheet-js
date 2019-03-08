/// <reference types="jest" />
export declare const getGoogleAuthMock: () => {
    createOAuthClient: jest.Mock<any, any>;
    getTokens: jest.Mock<any, any>;
};
