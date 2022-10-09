import { getYoutubeVideoId, getVimeoVideoId } from './videoUtils'
import { httpGet } from './httpUtils'

export const isEmbedVideo = (itemSrc: string): boolean => {
  const supportedVideoServices: string[] = [
    'youtube.com',
    'youtu.be',
    'vimeo.com'
  ]
  return supportedVideoServices.some(service => {
    return itemSrc.includes(service)
  })
}
export const isLocalVideo = (itemSrc: string): boolean => {
  const supportedVideoFormats: string[] = [
    '.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv'
  ]
  return supportedVideoFormats.some(service => {
    return itemSrc.toLowerCase().includes(service)
  })
}
export const getThumbnail = (src: string, fallback: string = ''): string => {
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    const videoId = getYoutubeVideoId(src)
    return `${location.protocol}//img.youtube.com/vi/${videoId}/hqdefault.jpg`
  } else if (src.includes('vimeo.com')) {
    const videoId = getVimeoVideoId(src)
    const videoDetails = httpGet(`${location.protocol}//vimeo.com/api/v2/video/${videoId}.json`)
    if (videoDetails && videoDetails.length > 0) {
      return videoDetails[0]?.thumbnail_medium
    }
    return fallback
  } else if (isValidURL(src)) {
    return src
  } else {
    throw new Error('Passed source URL is not a valid URL.')
  }
}
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
