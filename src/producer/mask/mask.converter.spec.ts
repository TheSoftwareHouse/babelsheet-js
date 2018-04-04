import * as mask from "json-mask";
import MaskConverter from "./mask.converter";

describe("MaskConverter", () => {
  it("converts object to proper mask string", () => {
    const source = {
      tag1: {
        COMMON: {
          STH1: null
        },
        FRONT: {
          PAGINATION: {
            FIRST: null,
            NEXT: null,
            PREV: null,
            LAST: null
          }
        }
      },
      tag2: {
        COMMON: {
          STH1: null
        },
        FRONT: {
          PAGINATION: {
            FIRST: null,
            NEXT: null
          }
        },
        BACK: { MAILS: { REGISTER: { FOOTER: null } } }
      }
    };

    const converter = new MaskConverter();

    expect(converter.convert(source)).toEqual(
      "tag1(COMMON(STH1),FRONT(PAGINATION(FIRST,NEXT,PREV,LAST))),tag2(COMMON(STH1),FRONT(PAGINATION(FIRST,NEXT)),BACK(MAILS(REGISTER(FOOTER))))"
    );
  });
});
