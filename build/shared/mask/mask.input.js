"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_immutable_1 = require("dot-prop-immutable");
const ramda = require("ramda");
class MaskInput {
    convert(source) {
        return ramda.reduce((acc, elem) => dot_prop_immutable_1.set(acc, elem, null), {}, source);
    }
}
exports.default = MaskInput;
