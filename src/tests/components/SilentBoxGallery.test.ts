import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { cleanup, fireEvent, render } from '@testing-library/vue'
import type { ItemProps } from '../../types'
import SilentBoxGallery from '../../components/SilentBoxGallery.vue'

const item: ItemProps = {
  src: 'https://example.jpg',
  thumbnailWidth: 200,
  thumbnailHeight: 200,
  thumbnail: '',
  autoplay: false,
  alt: 'Alternative text',
  controls: false,
  description: 'Item description'
}
const videoItem: ItemProps = {
  ...item,
  src: 'https://www.youtube.com/embed/1xqwnD3BdT4',
  thumbnail: ''
}

describe('Test SilentBoxGallery.vue | Gallery', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    gallery: [item, item]
  }
  it('should render gallery of two images', async () => {
    const { queryAllByRole } = render(SilentBoxGallery, { props })
    expect(queryAllByRole('img')).toHaveLength(2)
  })
})

describe('Test SilentBoxGallery.vue | Thumbnail image', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    image: item
  }
  it('should be rendered', async () => {
    const { queryAllByRole } = render(SilentBoxGallery, { props })
    expect(queryAllByRole('img').length).toBe(1)
  })
  it('should load lazily', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props })
    expect(queryByRole('img')).toHaveProperty('loading', 'lazy')
  })
  it('should load eagerly', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props: { ...props, lazyLoading: false } })
    expect(queryByRole('img')).toHaveProperty('loading', 'eager')
  })
  it('should be 200px wide and 200px height', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props })
    expect(queryByRole('img')).toHaveProperty('width', 200)
    expect(queryByRole('img')).toHaveProperty('height', 200)
  })
  it('should have alt description', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props })
    expect(queryByRole('img')).toHaveProperty('alt', 'Alternative text')
  })
  it('should have thumbnail src', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props })
    expect(queryByRole('img')).toHaveProperty('src', 'https://example.jpg')
  })
  it('should have thumbnail src', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props: { ...props, image: videoItem } })
    // we can not incldue protocol as it is unknown at this stage
    expect(queryByRole('img')).toHaveProperty('src', 'https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg')
  })
})

describe('Test SilentBoxGallery.vue | silentbox-item slot', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    image: item
  }
  it('should be rendered', async () => {
    const { queryAllByRole } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :src="silentboxItem.src"/>'
        }
      })
    expect(queryAllByRole('img').length).toBe(1)
  })
  it('should have access to silentboxItem.src property', async () => {
    const { queryByRole } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :src="silentboxItem.src"/>'
        }
      })
    expect(queryByRole('img')).toHaveProperty('src', 'https://example.jpg')
  })
  it('should have access to silentboxItem.alt property', async () => {
    const { queryByAltText } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :alt="silentboxItem.alt"/>'
        }
      })
    expect(queryByAltText('Alternative text')).toHaveProperty('alt')
  })
  it('should have access to silentboxItem.thumbnailWidth property', async () => {
    const { queryByRole } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :width="silentboxItem.thumbnailWidth"/>'
        }
      })
    expect(queryByRole('img')).toHaveProperty('width', 200)
  })
  it('should have access to silentboxItem.thumbnailHeight property', async () => {
    const { queryByRole } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :height="silentboxItem.thumbnailHeight"/>'
        }
      })
    expect(queryByRole('img')).toHaveProperty('height', 200)
  })
  it('should have access to silentboxItem.thumbnail property', async () => {
    const { queryByRole } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<img :src="silentboxItem.thumbnail"/>'
        }
      })
    expect(queryByRole('img')).toHaveProperty('src', 'https://example.jpg')
  })
  it('should have access to silentboxItem.description property', async () => {
    const { queryByText } = render(
      SilentBoxGallery, {
        props,
        slots: {
          'silentbox-item': '<p>{{ silentboxItem.description }}</p>'
        }
      })
    expect(queryByText('Item description')?.innerText).toBe('Item description')
  })
})

describe('Test SilentBoxGallery.vue | anchor link', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    image: item
  }
  it('should render link with image', async () => {
    const { queryAllByRole } = render(SilentBoxGallery, { props })
    expect(queryAllByRole('link')).toHaveLength(1)
  })
  it('should have at least one children', async () => {
    const { queryByRole } = render(SilentBoxGallery, { props })
    const link = queryByRole('link')
    expect(link?.hasChildNodes).toBeTruthy()
    expect(link?.childElementCount).toBeGreaterThanOrEqual(1)
  })
  it('should emmit silentbox-overlay-opened overlay on @click', async () => {
    const { getByRole, emitted } = render(SilentBoxGallery, { props })
    const link = getByRole('link')
    await fireEvent.click(link)
    expect(emitted('silentbox-overlay-opened')).toStrictEqual([[{ ...item, autoplay: false, thumbnail: item.src }]])
  })
  it('should open overlay on @click', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    await wrapper.get('.silentbox-item').trigger('click')
    expect(wrapper.find('#silentbox-overlay').exists()).toBeTruthy()
    expect(wrapper.vm.overlay).toStrictEqual({
      currentItem: 0,
      item: { ...props.image, thumbnail: props.image.src },
      totalItems: 1,
      visible: true
    })
    expect(wrapper.emitted()).toHaveProperty('silentbox-overlay-opened')
  })
})

describe('Test SilentBoxGallery.vue | Default slot', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    image: item
  }
  it('should be rendered as HTML element', async () => {
    const { queryByText } = render(
      SilentBoxGallery, {
        props,
        slots: {
          default: '<p>Custom text</p>'
        }
      })
    expect(queryByText('Custom text')?.innerText).toContain('Custom text')
  })
  it('should be rendered with plain text', async () => {
    const { queryByText } = render(
      SilentBoxGallery, {
        props,
        slots: {
          default: 'Custom text'
        }
      })
    expect(queryByText('Custom text')?.innerText).toContain('Custom text')
  })
})

describe('Test SilentBoxGallery.vue | Events', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    gallery: [
      item,
      {
        ...item,
        src: 'https://example2.jpg',
        thumbnail: 'https://example2.jpg'
      },
      {
        ...item,
        src: 'https://example3.jpg',
        thumbnail: 'https://example3.jpg'
      }
    ]
  }
  it('should change item to next item on @silentbox-internal-get-next-item', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    wrapper.vm.showNextItem()
    expect(wrapper.vm.overlay).toStrictEqual({
      currentItem: 1,
      item: props.gallery[1],
      totalItems: 3,
      visible: false
    })
    const nextEvent = wrapper.emitted()
    expect(nextEvent).toHaveProperty('silentbox-overlay-next-item-displayed')
    expect(nextEvent['silentbox-overlay-next-item-displayed'][0]).toStrictEqual([props.gallery[1]])
  })
  it('should change item to prev item on @silentbox-internal-get-prev-item', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    wrapper.vm.showPrevItem()
    expect(wrapper.vm.overlay).toStrictEqual({
      currentItem: 2,
      item: props.gallery[2],
      totalItems: 3,
      visible: false
    })
    const prevEvent = wrapper.emitted()
    expect(prevEvent).toHaveProperty('silentbox-overlay-prev-item-displayed')
    expect(prevEvent['silentbox-overlay-prev-item-displayed'][0]).toStrictEqual([props.gallery[2]])
  })
  it('should close overlay on @silentbox-internal-close-overlay', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    await wrapper.get('.silentbox-item').trigger('click')
    expect(wrapper.find('#silentbox-overlay').exists()).toBeTruthy()
    expect(wrapper.vm.overlay).toStrictEqual({
      currentItem: 0,
      item: { ...props.gallery[0], thumbnail: props.gallery[0].src },
      totalItems: 3,
      visible: true
    })
    await wrapper.vm.hideOverlay()
    expect(wrapper.emitted()).toHaveProperty('silentbox-overlay-hidden')
    expect(wrapper.vm.overlay.visible).toBeFalsy()
  })
})

describe('Test SilentBoxGallery.vue | Other tests', () => {
  afterEach(() => {
    cleanup()
  })
  const props = {
    lazyLoading: true,
    previewCount: 0,
    fallbackThumbnail: '',
    gallery: [
      item,
      {
        ...item,
        src: 'https://example2.jpg',
        thumbnail: 'https://example2.jpg'
      },
      {
        ...item,
        src: 'https://example3.jpg',
        thumbnail: 'https://example3.jpg'
      }
    ]
  }
  vi.stubGlobal('location', { protocol: 'https:' })
  it('should always have correct totalItems number', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    expect(wrapper.vm.totalItems).toBe(3)
  })
  it('should return thumbnail based on src when no thumbnail is provided', async () => {
    const wrapper = mount(SilentBoxGallery, { props })

    expect(wrapper.vm.getThumbnailURL('https://example.com/thumbnail.jpg')).toBe('https://example.com/thumbnail.jpg')
  })
  it('should return thumbnail if provided with wrong value: boolean', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    expect(wrapper.vm.getThumbnailURL('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  })
  it('should return thumbnail if provided with YouTube link', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    expect(wrapper.vm.getThumbnailURL('https://www.youtube.com/watch?v=1xqwnD3BdT4')).toBe('https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg')
  })
  it('should create valid item', async () => {
    const wrapper = mount(SilentBoxGallery, { props })
    const item = {
      src: 'https://www.youtube.com/watch?v=1xqwnD3BdT4',
      thumbnail: 'https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg',
      autoplay: true,
      controls: true,
      description: 'Image description',
      alt: 'Image alt',
      thumbnailWidth: 150,
      thumbnailHeight: 150
    }
    expect(wrapper.vm.mapGalleryItem(item)).toStrictEqual(item)
  })
})
