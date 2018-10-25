"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YAML = require("yaml");
class JsonToYamlTransformer {
    constructor() {
        this.supportedType = 'json-yml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.mergeLanguages) {
            return {
                ...source,
                result: {
                    merged: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                },
            };
        }
        else if (source.meta.langCode) {
            return {
                ...source,
                result: [
                    {
                        lang: source.meta.langCode,
                        content: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                    },
                ],
            };
        }
        else {
            return {
                ...source,
                result: Object.keys(source.result).map(lang => ({
                    lang,
                    content: this.generateYaml(source.result[lang], source.meta.includeComments ? source.comments : undefined, source.meta.locales),
                })),
            };
        }
    }
    generateYaml(json, comments, locales) {
        // change schema to force compatibility with previous yaml implementation
        const doc = new YAML.Document({ schema: 'yaml-1.1' });
        doc.contents = YAML.createNode(json);
        // add comments
        const addComments = (node, context) => {
            //  map
            if (node.items) {
                node.items.forEach((item) => addComments(item, [...context, item.key.value]));
            }
            // pair with map as value
            else if (node.value && node.value.items) {
                node.value.items.forEach((item) => addComments(item, [...context, item.key.value]));
            }
            // value - check for comments
            else if (comments) {
                const comment = context.reduce((previous, key, index) => {
                    // if first key is an locale, skip it
                    if (index === 0 && locales && locales.some(locale => locale === key)) {
                        return previous;
                    }
                    return previous && previous[key];
                }, comments);
                if (comment) {
                    node.comment = comment;
                }
            }
        };
        addComments(doc.contents, []);
        return doc.toString();
    }
}
exports.default = JsonToYamlTransformer;
