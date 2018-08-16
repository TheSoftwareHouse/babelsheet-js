import { getExtension, getExtensionsFromJson, getDocumentType } from './formatToExtensions';

describe('getExtension', () => {
  it('does return proper extension for right format', () => {
    const result = getExtension('android');
    expect(result).toBe('xml');
  });

  it('does throw proper error if format does not exists', () => {
    expect(() => getExtension('xyz')).toThrow("Not possible to create translations for format 'xyz'");
  });
});

describe('getExtensionsFromJson', () => {
  it('does return proper extension for right format', () => {
    const result = getExtensionsFromJson('android');
    expect(result).toBe('json-xml');

    const result2 = getExtensionsFromJson('json');
    expect(result2).toBe('json');
  });

  it('does throw proper error if format does not exists', () => {
    expect(() => getExtensionsFromJson('xyz')).toThrow("Not possible to create translations for format 'xyz'");
  });
});

describe('getDocumentType', () => {
  it('does return proper document type for right format', () => {
    const result = getDocumentType('android');
    expect(result).toBe('application/xml');

    const result2 = getDocumentType('json');
    expect(result2).toBe('application/json');
  });

  it('does throw proper error if format does not exists', () => {
    expect(() => getDocumentType('xyz')).toThrow("Not possible to create translations for format 'xyz'");
  });
});
