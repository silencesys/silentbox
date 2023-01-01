import { vi, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SilentBoxOverlay from '../../components/SilentBoxOverlay.vue'
import type { ItemProps } from '../../types'

const item: ItemProps = {
  src: 'https://example.com/image.jpg',
  srcSet: ['https://example.com/image.jpg?800', 'https://example.com/image.jpg?300'],
  thumbnail: 'https://example.com/thumbnail.jpg',
  thumbnailWidth: 200,
  thumbnailHeight: 200,
  alt: 'Alternative text',
  description: 'Item description',
  autoplay: false,
  controls: true
}

describe('Test SilentBoxOverlay.vue | Rendering', () => {
  vi.stubGlobal('location', { protocol: 'https:', hostname: 'example.com' })
  const props = {
    item,
    visible: true,
    currentItem: 1,
    totalItems: 3
  }
  it('should open overlay with background and embed', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    expect(wrapper.find('#silentbox-overlay').exists()).toBeTruthy()
    expect(wrapper.find('#silentbox-overlay__background').exists()).toBeTruthy()
    expect(wrapper.find('#silentbox-overlay__embed').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should have close button in overlay', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    expect(wrapper.find('#silentbox-overlay__close-button').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should have navigation arrows in overlay', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    const arrowPrev = wrapper.find('.arrow-previous')
    const arrowNext = wrapper.find('.arrow-next')
    expect(arrowPrev.exists()).toBeTruthy()
    expect(arrowNext.exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should show image preview in overlay for picture file', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    expect(wrapper.find(`img[src=${item.src}]`).exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should not show download button in overlay', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    expect(wrapper.find('.download').exists()).toBeFalsy()
    wrapper.unmount()
  })
  it('should show download button in overlay', () => {
    const downloadableItemProps = {
      ...props,
      item: {
        ...props.item,
        download: true
      }
    }
    const wrapper = mount(SilentBoxOverlay, { props: downloadableItemProps })
    expect(wrapper.find('.download').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should show video iframe in overlay for video link', () => {
    const videoProps = {
      ...props,
      item: {
        ...item,
        src: 'https://www.youtube.com/watch?v=1xqwnD3BdT4'
      }
    }
    const wrapper = mount(SilentBoxOverlay, { props: videoProps })
    expect(wrapper.find('iframe[src^=https://www.youtube.com/embed/1xqwnD3BdT4]').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should show video preview in overlay for video file', () => {
    const videoProps = {
      ...props,
      item: {
        ...item,
        src: 'https://example.com/video.mp4'
      }
    }
    const wrapper = mount(SilentBoxOverlay, { props: videoProps })
    expect(wrapper.find('video[src=https://example.com/video.mp4]').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should show description in overlay if is present', () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    expect(wrapper.find('#silentbox-overlay__description').exists()).toBeTruthy()
    wrapper.unmount()
  })
  it('should not show description in overlay if is not present', () => {
    const emptyDescription = {
      ...props,
      item: {
        ...item,
        description: ''
      }
    }
    const wrapper = mount(SilentBoxOverlay, { props: emptyDescription })
    expect(wrapper.find('#silentbox-overlay__description').exists()).toBeFalsy()
    wrapper.unmount()
  })
})

describe('Test SilentBoxOverlay.vue | Events and interactions', () => {
  const props = {
    item,
    visible: true,
    currentItem: 1,
    totalItems: 3
  }
  it('should fire event requesting next image on next arrow click', async () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    const arrowNext = wrapper.get('.arrow-next')
    await arrowNext.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-get-next-item')
    expect(wrapper.vm.animation.name).toBe('silentbox-animation__swipe-left')
    wrapper.unmount()
  })
  it('should fire event requesting prev image on prev arrow click', async () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    const arrowPrev = wrapper.get('.arrow-previous')
    await arrowPrev.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-get-prev-item')
    expect(wrapper.vm.animation.name).toBe('silentbox-animation__swipe-right')
    wrapper.unmount()
  })
  it('should fire event closing an overlay on cross button click', async () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    const closeButton = wrapper.get('#silentbox-overlay__close-button')
    await closeButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-close-overlay')
    wrapper.unmount()
  })
})

describe('Test SilentBoxOverlay.vue | Functions', () => {
  const props = {
    item,
    visible: true,
    currentItem: 1,
    totalItems: 3
  }
  const youtubeProps = {
    ...props,
    item: {
      ...item,
      src: 'https://www.youtube.com/watch?v=1xqwnD3BdT4'
    }
  }
  const vimeoProps = {
    ...props,
    item: {
      ...item,
      src: 'https://vimeo.com/238573128'
    }
  }
  const twitchProps = {
    ...props,
    item: {
      ...item,
      src: 'https://player.twitch.tv/?channel=method'
    }
  }
  it('should identify youtube video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: youtubeProps })
    expect(wrapper.vm.getVideoURL(youtubeProps.item.src)).toBe('https://www.youtube.com/embed/1xqwnD3BdT4?rel=0')
  })
  it('should parse youtube video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: youtubeProps })
    expect(wrapper.vm.getYouTubeVideoURL(youtubeProps.item.src)).toBe('https://www.youtube.com/embed/1xqwnD3BdT4?rel=0')
  })
  it('should return empty string if is not youtube video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: vimeoProps })
    expect(wrapper.vm.getYouTubeVideoURL(vimeoProps.item.src)).toBe('')
  })
  it('should identify vimeo video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: vimeoProps })
    expect(wrapper.vm.getVideoURL(vimeoProps.item.src)).toBe('https://player.vimeo.com/video/238573128?rel=0')
  })
  it('should parse vimeo video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: vimeoProps })
    expect(wrapper.vm.getVimeoVideoURL(vimeoProps.item.src)).toBe('https://player.vimeo.com/video/238573128?rel=0')
  })
  it('should return empty string if is not vimeo video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: youtubeProps })
    expect(wrapper.vm.getVimeoVideoURL(twitchProps.item.src)).toBe('')
  })
  it('should identify twitch video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: youtubeProps })
    expect(wrapper.vm.getVideoURL(twitchProps.item.src)).toBe('https://player.twitch.tv/?channel=method&parent=example.com')
  })
  it('should parse twitch video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: youtubeProps })
    expect(wrapper.vm.getTwitchVideURL(twitchProps.item.src)).toBe('https://player.twitch.tv/?channel=method&parent=example.com')
  })
  it('should return empty string if is not twitch video', async () => {
    const wrapper = mount(SilentBoxOverlay, { props: vimeoProps })
    expect(wrapper.vm.getTwitchVideURL(vimeoProps.item.src)).toBe('')
  })
})

describe('Test SilentBoxOverlay.vue | Keyboard navigation', () => {
  const props = {
    item,
    visible: true,
    currentItem: 1,
    totalItems: 3
  }
  it('should move to next slide if right arrow is pressed', async () => {
    const wrapper = mount(SilentBoxOverlay, { sync: true, props })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }))
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-get-next-item')
    wrapper.unmount()
  })
  it('should move to prev slide if left arrow is pressed', async () => {
    const wrapper = mount(SilentBoxOverlay, { sync: true, props })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }))
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-get-prev-item')
    wrapper.unmount()
  })
  it('should close if Escape is pressed', async () => {
    const wrapper = mount(SilentBoxOverlay, { sync: true, props })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape' }))
    expect(wrapper.emitted()).toHaveProperty('silentbox-internal-close-overlay')
    wrapper.unmount()
  })
  it('should ignore right arrow if is pressed and overlay hidden', async () => {
    const wrapper = mount(SilentBoxOverlay, { props })
    wrapper.setProps({ ...props, visible: false })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }))
    expect(wrapper.emitted()).not.toHaveProperty('silentbox-internal-get-next-item')
    wrapper.unmount()
  })
  it('should ignore left arrow if is pressed and overlay hidden', async () => {
    const wrapper = mount(SilentBoxOverlay, { sync: true, props })
    wrapper.setProps({ ...props, visible: false })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }))
    expect(wrapper.emitted()).not.toHaveProperty('silentbox-internal-get-prev-item')
    wrapper.unmount()
  })
  it('should ignore Escape if is pressed and overlay hidden', async () => {
    const wrapper = mount(SilentBoxOverlay, { sync: true, props })
    wrapper.setProps({ ...props, visible: false })
    await wrapper.vm.$forceUpdate()
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape' }))
    expect(wrapper.emitted()).not.toHaveProperty('silentbox-internal-close-overlay')
    wrapper.unmount()
  })
})
