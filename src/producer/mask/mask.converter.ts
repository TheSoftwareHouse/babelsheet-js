export default class MaskConverter {
  public convert(source: { [key: string]: any }): string {
    return this.convertMaskRecursively(source);
  }

  private convertMaskRecursively(source: { [key: string]: any }): string {
    if (source !== null) {
      return Object.keys(source)
        .map(key => {
          const maskForKey = this.convertMaskRecursively(source[key]);

          return maskForKey ? `${key}(${maskForKey})` : `${key}`;
        })
        .join(",");
    }

    return "";
  }
}
