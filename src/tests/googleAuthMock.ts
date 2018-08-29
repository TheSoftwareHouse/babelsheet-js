const googleAuthMock = {
  createOAuthClient: jest.fn(),
  getTokens: jest.fn().mockImplementation(() => ({ refresh_token: 'test-token' })),
};

export const getGoogleAuthMock = () => googleAuthMock;
