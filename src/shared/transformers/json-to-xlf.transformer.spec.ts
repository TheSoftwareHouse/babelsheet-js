import ITransformer from './transformer';
import JsonToXlfTransformer from './json-to-xlf.transformer';
import { minimalPassingObject } from '../../tests/testData';

const jsonToFlatList: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json-flat-list return'),
};

const flatListToXlf: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'flat-list-xlf return'),
};

describe('JsonToXlfTransformer', () => {
  const jsonToXlfTransformer = new JsonToXlfTransformer(jsonToFlatList, flatListToXlf);

  it('does return true if supported type', async () => {
    const result = jsonToXlfTransformer.supports('json-xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToXlfTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xlf from json', async () => {
    jsonToXlfTransformer.transform(minimalPassingObject);
    expect(jsonToFlatList.transform).toBeCalledWith(minimalPassingObject);
    expect(flatListToXlf.transform).toBeCalledWith('json-flat-list return');
  });
});
