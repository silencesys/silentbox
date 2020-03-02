import itemMixin from './../../src/mixins/item'

describe('mixins/item', () => {
  describe('methods:isEmbedVideo', () => {
    test('it shuld return true when youtube.com link is passed', () => {
      const mixin = itemMixin.methods.isEmbedVideo('https://www.youtube.com/watch?v=HSsqzzuGTPo')
      expect(mixin).toBeTruthy()
    })
    test('it shuld return true when youtu.be link is passed', () => {
      const mixin = itemMixin.methods.isEmbedVideo('https://www.youtu.be/watch?v=HSsqzzuGTPo')
      expect(mixin).toBeTruthy()
    })
    test('it shuld return true when vimeo link is passed', () => {
      const mixin = itemMixin.methods.isEmbedVideo('https://vimeo.com/336812660')
      expect(mixin).toBeTruthy()
    })
    test('it shuld return false when unsupported link is passed', () => {
      const mixin = itemMixin.methods.isEmbedVideo('https://localhost')
      expect(mixin).toBeFalsy()
    })
  })

  describe('methods:isLocalVideo', () => {
    const supportedFormatsThatShouldPass = ['.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv']

    for (const testCase of supportedFormatsThatShouldPass) {
      test('it shuld return true when ' + testCase + ' link is passed', () => {
        const mixin = itemMixin.methods.isLocalVideo('fileName' + testCase)
        expect(mixin).toBeTruthy()
      })
    }

    test('it shuld return false when unsupported format is passed', () => {
      const mixin = itemMixin.methods.isLocalVideo('fileName.mp3')
      expect(mixin).toBeFalsy()
    })
  })
})
