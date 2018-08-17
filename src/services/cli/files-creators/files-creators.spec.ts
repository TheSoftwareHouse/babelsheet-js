import FilesCreators from './files-creators';

const iosFileCreator = {
  save: source => 'test',
  supports: type => type === 'ios',
};

describe('FileCreators', () => {
  const fileCreatorsList = [iosFileCreator];
  const filesCreators = new FilesCreators(fileCreatorsList);

  it('executes save method on proper fileCreator', () => {
    const result = filesCreators.save('', '.', 'test', 'ios');

    expect(result).toBe('test');
  });

  it('throws exception when there is no transformer', () => {
    const type = 'xyz';

    expect(() => filesCreators.save('', '.', 'test', 'xyz')).toThrow('No support for xyz data type');
  });
  // it('throws exception when there is no transformer', async () => {
  //   const type = 'xyz';

  //   await expect(transformers.transform(spreadsheetData, type)).rejects.toMatchObject(
  //     new Error(`No support for ${type} data type`)
  //   );
  // });
});
