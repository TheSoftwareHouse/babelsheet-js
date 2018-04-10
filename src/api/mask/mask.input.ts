import { set } from 'dot-prop-immutable';
import * as ramda from 'ramda';

export default class MaskInput {
  public convert(source: string[]): object {
    return ramda.reduce((acc, elem) => set(acc, elem, null), {}, source);
  }
}
