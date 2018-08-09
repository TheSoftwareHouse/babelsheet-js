import ITransformer from './transformer';

export default class FlatListToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'strings';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: Array<{ [key: string]: string }>): string {
    return source.reduce(
      (previous: string, translation: { [key: string]: string }) =>
        `${previous}\n\n/* */\n"${translation.name}" = "${translation.text || ''}"`,
      ''
    );
  }
}
