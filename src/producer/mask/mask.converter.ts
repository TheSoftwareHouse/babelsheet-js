import { set } from "dot-prop-immutable";

export default class MaskConverter {
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

  convert(source: { [key: string]: any }): string {
    return this.convertMaskRecursively(source);
  }
}
