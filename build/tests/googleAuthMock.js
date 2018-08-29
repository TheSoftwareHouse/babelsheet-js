"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleAuthMock = {
    createOAuthClient: jest.fn(),
    getTokens: jest.fn().mockImplementation(() => ({ refresh_token: 'test-token' })),
};
exports.getGoogleAuthMock = () => googleAuthMock;
