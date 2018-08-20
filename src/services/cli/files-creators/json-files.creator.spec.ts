import JsonFilesCreator from './json-files.creator';

const fileRepository = {
  hasAccess: (path, permission) => false,
  loadData: (filename, extension) => 'loadData',
  saveData: jest.fn(),
};

describe('FileCreators', () => {
  const jsonFilesCreator = new JsonFilesCreator(fileRepository);

  it('does return true if supported type', async () => {
    const result = jsonFilesCreator.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is string', () => {
    jsonFilesCreator.save('data', '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'json', '.');
  });
});
