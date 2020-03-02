import { shallowMount } from '@vue/test-utils'
import Overlay from './../../src/components/overlay.vue'

describe('components/Overlay.vue', () => {
  describe('computed:moveToNextItem', () => {
    test('move to the next item by firing an event to parent', () => {
      const overlay = shallowMount(Overlay)

      overlay.vm.moveToNextItem()

      expect(overlay.emitted('requestNextSilentBoxItem')).toBeTruthy()
    })
  })
  describe('computed:moveToPreviousItem', () => {
    test('move to the previous item by firing an event to parent', () => {
      const overlay = shallowMount(Overlay)

      overlay.vm.moveToPreviousItem()

      expect(overlay.emitted('requestPreviousSilentBoxItem')).toBeTruthy()
    })
  })
  describe('computed:closeSilentboxOverlay', () => {
    test('closes the overlay by firing an event to parent', () => {
      const overlay = shallowMount(Overlay)

      overlay.vm.closeSilentboxOverlay()

      expect(overlay.emitted('closeSilentboxOverlay')).toBeTruthy()
    })
  })
  describe('computed:handleUrl', () => {
    test('to return URL as it is', () => {
      const overlay = shallowMount(Overlay)
      const url = overlay.vm.handleUrl('http://localhost/image.jpg')

      expect(url).toEqual('http://localhost/image.jpg')
    })
  })
  describe('computed:parseYoutubeVideo', () => {
    test('to return parsed YouTube URL', () => {
      const overlay = shallowMount(Overlay, {
        propsData: {
          overlayItem: {
            autoplay: false,
            controls: true
          }
        }
      })
      const url = overlay.vm.parseYoutubeVideo('https://www.youtube.com/watch?v=HSsqzzuGTPo')

      expect(url).toEqual('http://www.youtube.com/embed/HSsqzzuGTPo?rel=0')
    })
    test('to return parsed YouTube URL with autoplay', () => {
      const overlay = shallowMount(Overlay, {
        propsData: {
          overlayItem: {
            autoplay: 'autoplay',
            controls: true
          }
        }
      })
      const url = overlay.vm.parseYoutubeVideo('https://www.youtube.com/watch?v=HSsqzzuGTPo')

      expect(url).toEqual('http://www.youtube.com/embed/HSsqzzuGTPo?rel=0&autoplay=1')
    })
    test('to return parsed YouTube URL without controls', () => {
      const overlay = shallowMount(Overlay, {
        propsData: {
          overlayItem: {
            autoplay: false,
            controls: false
          }
        }
      })
      const url = overlay.vm.parseYoutubeVideo('https://www.youtube.com/watch?v=HSsqzzuGTPo')

      expect(url).toEqual('http://www.youtube.com/embed/HSsqzzuGTPo?rel=0&controls=0')
    })
  })

  describe('computed:parseVimeoVideo', () => {
    test('to return parsed Vimeo URL', () => {
      const overlay = shallowMount(Overlay, {
        propsData: {
          overlayItem: {
            autoplay: false,
            controls: true
          }
        }
      })
      const url = overlay.vm.parseVimeoVideo('https://vimeo.com/336812660')

      expect(url).toEqual('https://player.vimeo.com/video/336812660?rel=0')
    })
    test('to return parsed Vimeo URL with autoplay', () => {
      const overlay = shallowMount(Overlay, {
        propsData: {
          overlayItem: {
            autoplay: 'autoplay',
            controls: true
          }
        }
      })
      const url = overlay.vm.parseVimeoVideo('https://vimeo.com/336812660')

      expect(url).toEqual('https://player.vimeo.com/video/336812660?rel=0&autoplay=1')
    })
  })
})
