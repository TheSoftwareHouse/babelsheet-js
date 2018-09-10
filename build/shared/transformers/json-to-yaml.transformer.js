"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
class JsonToYamlTransformer {
    constructor() {
        this.supportedType = 'json-yml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        return js_yaml_1.safeDump(source);
    }
}
exports.default = JsonToYamlTransformer;
