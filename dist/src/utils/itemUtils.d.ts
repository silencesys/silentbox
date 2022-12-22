/**
 * Check whether video is embedable and supported by SilentBox
 *
 * @param {string} itemSrc
 * @return boolean
 */
export declare const isEmbedVideo: (itemSrc: string) => boolean;
/**
 * Check whether item is supported local video.
 *
 * @param {string} itemSrc
 * @return boolean
 */
export declare const isLocalVideo: (itemSrc: string) => boolean;
/**
 * Get thumbnail for item.
 *
 * @param {string} src
 * @param {string} fallbackThumbnail
 * @return string
 */
export declare const getThumbnail: (src: string, fallbackThumbnail?: string) => string;
/**
 * Check for valid URL string.
 *
 * @param {string} src
 * return boolean
 */
export declare const isValidURL: (src: string) => boolean;
