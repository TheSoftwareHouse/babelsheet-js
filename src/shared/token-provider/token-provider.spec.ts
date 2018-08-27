import TokenProvider from './token-provider';

describe('TokenProvider', () => {
  it('returns token from proper provider', async () => {
    const writeProvider = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('writeProvider'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProvider1 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve(null),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };
    const readProvider2 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('readProvider2'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };
    const readProvider3 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('readProvider3'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProviders = [readProvider1, readProvider2, readProvider3];

    const tokenProvider = new TokenProvider(writeProvider, readProviders);

    const result = await tokenProvider.getToken();

    expect(result).toBe('readProvider2');
  });

  it('returns null if no token in read provider', async () => {
    const writeProvider2 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('writeProvider'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProvider12 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve(null),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProviders2 = [readProvider12];

    const tokenProvider = new TokenProvider(writeProvider2, readProviders2);

    const result = await tokenProvider.getToken();

    expect(result).toBe(null);
  });

  it('executes proper readProvider on second read', async () => {
    const writeProvider = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('writeProvider'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProvider1 = {
      set: (key, value) => Promise.resolve(),
      get: jest.fn().mockImplementation(() => Promise.resolve(null)),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };
    const readProvider2 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('readProvider2'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };
    const readProvider3 = {
      set: (key, value) => Promise.resolve(),
      get: key => Promise.resolve('readProvider3'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProviders = [readProvider1, readProvider2, readProvider3];

    const tokenProvider = new TokenProvider(writeProvider, readProviders);

    const result = await tokenProvider.getToken();
    const result2 = await tokenProvider.getToken();

    expect(result).toBe('readProvider2');
    expect(result2).toBe('readProvider2');
    expect(readProvider1.get).toHaveBeenCalledTimes(1);
  });

  it('executes set method on proper provider', async () => {
    const writeProvider = {
      set: jest.fn(),
      get: key => Promise.resolve('writeProvider'),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProvider1 = {
      set: (key, value) => Promise.resolve(),
      get: jest.fn().mockImplementation(() => Promise.resolve(null)),
      has: key => Promise.resolve(true),
      clear: () => Promise.resolve(),
    };

    const readProviders = [readProvider1];

    const tokenProvider = new TokenProvider(writeProvider, readProviders);

    const token = 'test_token_232';
    await tokenProvider.setToken(token);

    expect(writeProvider.set).toBeCalledWith('token', token);
  });
});
