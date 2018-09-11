import FilesCreators from './files-creators';

const iosFileCreator = {
  save: source => 'test',
  supports: type => type === 'ios',
};

describe('FileCreators', () => {
  const fileCreatorsList = [iosFileCreator];
  const filesCreators = new FilesCreators(fileCreatorsList);

  it('executes save method on proper fileCreator', () => {
    const result = filesCreators.save('', '.', 'test', 'ios', 'en');

    expect(result).toBe('test');
  });

  it('throws exception when there is no transformer', () => {
    const type = 'xyz';

    expect(() => filesCreators.save('', '.', 'test', type, 'en')).toThrow(`No support for saving ${type} data type`);
  });
});
