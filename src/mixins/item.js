import VideoUrlDecoderMixin from './videoUrlDecoder'

export default {
  mixins: [VideoUrlDecoderMixin],
  methods: {
    isEmbedVideo (itemSrc) {
      const supportedVideoServices = [
        'youtube.com',
        'youtu.be',
        'vimeo.com'
      ]

      return supportedVideoServices.some(service => {
        return itemSrc.includes(service)
      })
    },
    isLocalVideo (itemSrc) {
      const supportedVideoServices = [
        '.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv'
      ]

      return supportedVideoServices.some(service => {
        return itemSrc.includes(service)
      })
    },
    getThumbnail (src) {
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = this.getYoutubeVideoId(src)
        return `${location.protocol}//img.youtube.com/vi/${videoId}/hqdefault.jpg`
      } else if (src.includes('vimeo.com')) {
        const videoId = this.getVimeoVideoId(src)
        const videoDetails = this.httpGet(`${location.protocol}//vimeo.com/api/v2/video/${videoId}.json`)
        return videoDetails[0].thumbnail_medium
      } else {
        return src
      }
    },
    httpGet (url) {
      var xmlHttp = new XMLHttpRequest()
      xmlHttp.open('GET', url, false)
      xmlHttp.send(null)

      return JSON.parse(xmlHttp.responseText)
    }
  }
}
