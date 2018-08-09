import ITransformer from './transformer';

export default class JsonToFlatListTransformer implements ITransformer {
  private readonly supportedType = 'flat-list';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: object): Array<{ [key: string]: string }> {
    const result: Array<{ [key: string]: string }> = [];

    const generateFlatListRecursively = (translationsObj: object, current?: string) => {
      Object.keys(translationsObj).forEach(key => {
        const value = (translationsObj as any)[key];
        const newKey = current ? `${current}_${key}` : key;
        if (value && typeof value === 'object') {
          generateFlatListRecursively(value, newKey);
        } else {
          result.push({ name: newKey.toLowerCase(), text: value });
        }
      });
    };

    generateFlatListRecursively(source);
    return result;
  }
}
