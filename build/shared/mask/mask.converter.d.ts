export default class MaskConverter {
    convert(source: {
        [key: string]: any;
    }, tags: {
        [key: string]: any;
    }): string;
    private convertMaskRecursively;
}
