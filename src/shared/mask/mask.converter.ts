export default class MaskConverter {
  public convert(source: { [key: string]: any }, tags: { [key: string]: any }): string {
    return this.convertMaskRecursively(source, tags || {});
  }

  private convertMaskRecursively(source: { [key: string]: any }, tags: { [key: string]: any }): string {
    if (source !== null) {
      return Object.keys(source)
        .map(key => {
          if (tags[key]) {
            return this.convertMaskRecursively(tags[key], tags);
          }

          const maskForKey = this.convertMaskRecursively(source[key], tags);

          return maskForKey ? `${key}(${maskForKey})` : `${key}`;
        })
        .join(',');
    }

    return '';
  }
}
