import { getYoutubeVideoId, getVimeoVideoId } from './videoUtils'
import { httpGet } from './httpUtils'

/**
 * Check whether video is embedable and supported by SilentBox
 *
 * @param {string} itemSrc
 * @return boolean
 */
export const isEmbedVideo = (itemSrc: string): boolean => {
  const supportedVideoServices: string[] = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'twitch.tv'
  ]
  return supportedVideoServices.some(service => {
    return itemSrc.includes(service)
  })
}
/**
 * Check whether item is supported local video.
 *
 * @param {string} itemSrc
 * @return boolean
 */
export const isLocalVideo = (itemSrc: string): boolean => {
  const supportedVideoFormats: string[] = [
    '.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv'
  ]
  return supportedVideoFormats.some(service => {
    return itemSrc.toLowerCase().includes(service)
  })
}
/**
 * Get thumbnail for item.
 *
 * @param {string} src
 * @param {string} fallbackThumbnail
 * @return string
 */
export const getThumbnail = (src: string, fallbackThumbnail: string = ''): string => {
  if (/(youtu\.?be)/.test(src)) {
    const videoId = getYoutubeVideoId(src)
    // Diven src is YouTube video, then we can point thumbnail url
    // to YouTube's own.
    return `${location.protocol}//img.youtube.com/vi/${videoId}/hqdefault.jpg`
  } else if (/(vimeo(pro)?\.com)/.test(src)) {
    const videoId = getVimeoVideoId(src)
    // Given src is Vimeo video, vimeo stores all information about video in
    // json file, thus we need to make request to that file to find thumbnail.
    const videoDetails = httpGet(`${location.protocol}//vimeo.com/api/v2/video/${videoId}.json`)
    if (videoDetails && videoDetails.length > 0) {
      // @TODO: allow users to pick thumbnail size.
      return videoDetails[0]?.thumbnail_medium
    }
    // In case we're unable to get video details, return fallback thumbnail.
    return fallbackThumbnail
  } else if (isValidURL(src)) {
    return src
  } else {
    throw new Error('Given string: src is not valid URL address.')
  }
}
/**
 * Check for valid URL string.
 *
 * @param {string} src
 * return boolean
 */
export const isValidURL = (src: string): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  )
  return urlPattern.test(src)
}
