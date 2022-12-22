/**
 * XMLHttpRequest is used because Vue does not work very well with top-level
 * async setup. Thus, we need to make this call synchronnous.
 *
 * @param {string} url
 * return any
 */
export declare const httpGet: (url: string) => any;
