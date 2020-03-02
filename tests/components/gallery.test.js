import { shallowMount, mount } from '@vue/test-utils'
import Gallery from './../../src/components/gallery.vue'

describe('components/Gallery.vue', () => {
  describe('computed:galleryItems', () => {
    test('parse single image and return objects with all required properties even if they were not specified', () => {
      const wrapper = shallowMount(Gallery, {
        propsData: {
          image: { src: 'image.jpg', description: 'This is my amazing image!' }
        }
      })
      const expectedArray = [
        {
          alt: '',
          autoplay: false,
          controls: true,
          src: 'image.jpg',
          thumbnail: 'image.jpg',
          thumbnailHeight: 'auto',
          thumbnailWidth: '200px',
          description: 'This is my amazing image!'
        }
      ]
      const items = wrapper.vm.galleryItems
      expect(items).toBeInstanceOf(Array)
      expect(items).toEqual(expect.arrayContaining(expectedArray))
    })

    test('parse gallery items and return objects with all required properties even if they were not specified', () => {
      const wrapper = shallowMount(Gallery, {
        propsData: {
          gallery: [
            { src: 'image.jpg', description: 'This is my amazing image!' },
            { src: 'image2.jpg', thumbnail: 'image2-thumb.jpg' }
          ]
        }
      })
      const expectedArray = [
        {
          alt: '',
          autoplay: '',
          controls: true,
          src: 'image.jpg',
          thumbnail: 'image.jpg',
          thumbnailHeight: 'auto',
          thumbnailWidth: '200px',
          description: 'This is my amazing image!'
        }, {
          alt: '',
          autoplay: '',
          controls: true,
          src: 'image2.jpg',
          thumbnail: 'image2-thumb.jpg',
          thumbnailHeight: 'auto',
          thumbnailWidth: '200px',
          description: ''
        }
      ]
      const items = wrapper.vm.galleryItems
      expect(items).toBeInstanceOf(Array)
      expect(items).toEqual(expect.arrayContaining(expectedArray))
    })
  })

  describe('methods:openOverlay', () => {
    test('opening overlay will emitt an event', () => {
      const gallery = shallowMount(Gallery)
      const image = {
        alt: '',
        autoplay: '',
        controls: true,
        src: 'image.jpg',
        thumbnail: 'image.jpg',
        thumbnailHeight: 'auto',
        thumbnailWidth: '200px',
        description: 'This is my amazing image!'
      }

      gallery.vm.openOverlay(image, 0)

      expect(gallery.emitted('silentbox-overlay-opened')).toBeTruthy()
    })

    test('opening overlay will set an item to display', () => {
      const gallery = shallowMount(Gallery)
      const image = {
        alt: '',
        autoplay: '',
        controls: true,
        src: 'image.jpg',
        thumbnail: 'image.jpg',
        thumbnailHeight: 'auto',
        thumbnailWidth: '200px',
        description: 'This is my amazing image!'
      }

      gallery.vm.openOverlay(image, 0)

      expect(gallery.vm.overlay.item).toEqual(image)
    })

    test('opening overlay will set overlay to visible', () => {
      const gallery = shallowMount(Gallery)
      const image = {
        alt: '',
        autoplay: '',
        controls: true,
        src: 'image.jpg',
        thumbnail: 'image.jpg',
        thumbnailHeight: 'auto',
        thumbnailWidth: '200px',
        description: 'This is my amazing image!'
      }

      gallery.vm.openOverlay(image, 0)

      expect(gallery.vm.overlay.visible).toBeTruthy()
    })
  })

  describe('methods:hideOverlay', () => {
    test('opening overlay will emitt an event', () => {
      const gallery = shallowMount(Gallery)
      const image = {
        alt: '',
        autoplay: '',
        controls: true,
        src: 'image.jpg',
        thumbnail: 'image.jpg',
        thumbnailHeight: 'auto',
        thumbnailWidth: '200px',
        description: 'This is my amazing image!'
      }

      gallery.vm.hideOverlay(image, 0)

      expect(gallery.emitted('silentbox-overlay-hidden')).toBeTruthy()
    })

    test('opening overlay will set overlay to visible', () => {
      const gallery = shallowMount(Gallery)
      const image = {
        alt: '',
        autoplay: '',
        controls: true,
        src: 'image.jpg',
        thumbnail: 'image.jpg',
        thumbnailHeight: 'auto',
        thumbnailWidth: '200px',
        description: 'This is my amazing image!'
      }

      gallery.vm.hideOverlay(image, 0)

      expect(gallery.vm.overlay.visible).toBeFalsy()
    })
  })

  describe('methods:showNextItem', () => {
    test('move to next item and emitt an event', () => {
      const gallery = shallowMount(Gallery)

      gallery.vm.showNextItem()

      expect(gallery.emitted('silentbox-overlay-next-item-displayed')).toBeTruthy()
    })

    test('move to next item and increment currentItem index', () => {
      const gallery = mount(Gallery, {
        propsData: {
          gallery: [
            { src: 'image.jpg', description: 'This is my amazing image!' },
            { src: 'image2.jpg' }
          ]
        },
        data () {
          return {
            overlay: {
              currentItem: 0
            }
          }
        }
      })

      gallery.vm.showNextItem()

      expect(gallery.vm.overlay.currentItem).toEqual(1)
    })

    test('move to first item if there are no more items in gallery left', () => {
      const gallery = mount(Gallery, {
        propsData: {
          gallery: [
            { src: 'image.jpg', description: 'This is my amazing image!' },
            { src: 'image2.jpg' }
          ]
        },
        data () {
          return {
            overlay: {
              currentItem: 1
            }
          }
        }
      })

      gallery.vm.showNextItem()

      expect(gallery.vm.overlay.currentItem).toEqual(0)
    })
  })

  describe('methods:showPreviousItem', () => {
    test('move to previous item and emitt an event', () => {
      const gallery = shallowMount(Gallery)

      gallery.vm.showPreviousItem()

      expect(gallery.emitted('silentbox-overlay-previous-item-displayed')).toBeTruthy()
    })

    test('move to previous item and decrement currentItem index', () => {
      const gallery = mount(Gallery, {
        propsData: {
          gallery: [
            { src: 'image.jpg', description: 'This is my amazing image!' },
            { src: 'image2.jpg' }
          ]
        },
        data () {
          return {
            overlay: {
              currentItem: 1
            }
          }
        }
      })

      gallery.vm.showPreviousItem()

      expect(gallery.vm.overlay.currentItem).toEqual(0)
    })

    test('move to last item if there are no previous items in gallery left', () => {
      const gallery = mount(Gallery, {
        propsData: {
          gallery: [
            { src: 'image.jpg', description: 'This is my amazing image!' },
            { src: 'image2.jpg' }
          ]
        },
        data () {
          return {
            overlay: {
              currentItem: 0
            }
          }
        }
      })

      gallery.vm.showPreviousItem()

      expect(gallery.vm.overlay.currentItem).toEqual(1)
    })
  })

  describe('methods:setAutoplay', () => {
    test('return "autoplay" if item have set autoplay option to be true', () => {
      const gallery = shallowMount(Gallery)
      const autoplay = gallery.vm.setAutoplay({ autoplay: true })

      expect(autoplay).toEqual('autoplay')
    })
  })

  describe('methods:setThumbnail', () => {
    test('return thumbnail if item has set one', () => {
      const gallery = shallowMount(Gallery)
      const autoplay = gallery.vm.setThumbnail({ thumbnail: 'item.jpg', src: 'item-src.jpg' })

      expect(autoplay).toEqual('item.jpg')
    })
    test('return src as thumbnail if item does not have set thumbnail', () => {
      const gallery = shallowMount(Gallery)
      const autoplay = gallery.vm.setThumbnail({ thumbnail: null, src: 'item-src.jpg' })

      expect(autoplay).toEqual('item-src.jpg')
    })
  })
})
