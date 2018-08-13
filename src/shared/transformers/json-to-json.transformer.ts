import ITransformer from './transformer';

export default class JsonToJsonTransformer implements ITransformer {
  private readonly supportedType = 'json';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): { [key: string]: string[] } {
    return source;
  }
}
