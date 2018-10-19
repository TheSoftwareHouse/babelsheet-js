export default class MaskConverter {
    convert(source: {
        [key: string]: any;
    }, tags: {
        [key: string]: any;
    }, meta: {
        [key: string]: any;
    }): string;
    private convertMaskRecursively;
}
