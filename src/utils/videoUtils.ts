export const getYoutubeVideoId = (url: string): string => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match !== undefined && match !== null && match[7] !== undefined) ? match[7] : ''
}
export const getVimeoVideoId = (url: string): string => {
  const id = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(url)
  return id ? id[3] : ''
}
