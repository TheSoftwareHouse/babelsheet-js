import { set } from "dot-prop-immutable";
import * as ramda from "ramda";

export default class MaskInput {
  convert(source: string[]): Object {
    return ramda.reduce((acc, elem) => set(acc, elem, null), {}, source);
  }
}
