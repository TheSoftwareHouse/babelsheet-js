import { ILogger } from 'node-common';

export default class Formatter {
  constructor(private logger: ILogger) {}

  private formatJson(): void {
    console.log('formatJson!!');
  }

  private formatXML(): void {
    console.log('formatXML2!');
  }

  public format(formatType: string): void {
    switch (formatType) {
      case 'xml':
        this.formatXML();
        break;
      case 'json':
      default:
        this.formatJson();
        break;
    }
  }
}
