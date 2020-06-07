import videoUrlDecoder from './../../src/mixins/videoUrlDecoder'

describe('mixins/videoUrlDecoder', () => {
  describe('methods:getYoutubeVideoId', () => {
    test('it should return YouTube video ID', () => {
      const mixin = videoUrlDecoder.methods.getYoutubeVideoId(`${location.protocol}//www.youtube.com/watch?v=HSsqzzuGTPo`)
      expect(mixin).toEqual('HSsqzzuGTPo')
    })
    test('it should return Vimeo video ID', () => {
      const mixin = videoUrlDecoder.methods.getVimeoVideoId(`${location.protocol}//vimeo.com/336812660`)
      expect(mixin).toEqual('336812660')
    })
  })
})
