/**
 * Get video ID from YouTube/YouTu.Be video.
 *
 * @params {string} url
 * @return string
 */
export const getYoutubeVideoId = (url: string): string => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = regExp.exec(url)
  return (match !== undefined && match !== null && match[7] !== undefined) ? match[7] : ''
}
/**
 * Get video ID from Vimeo/VimeoPro video.
 *
 * @params {string} url
 * @return string
 */
export const getVimeoVideoId = (url: string): string => {
  const regExp = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/
  const match = regExp.exec(url)
  return match ? match[3] : ''
}
