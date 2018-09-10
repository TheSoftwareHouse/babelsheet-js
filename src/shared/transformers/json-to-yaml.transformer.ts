import { safeDump } from 'js-yaml';
import ITransofrmer from './transformer';

export default class JsonToYamlTransformer implements ITransofrmer {
  private readonly supportedType = 'json-yml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): string {
    return safeDump(source);
  }
}
