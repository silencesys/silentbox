import { describe, it, expect, afterEach } from 'vitest'
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
    expect(queryByRole('img')).toHaveProperty('src', '//img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg')
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
    expect(emitted('silentbox-overlay-opened')).toStrictEqual([[{ item: { ...item, autoplay: false, thumbnail: item.src } }]])
  })
  it('should open overlay on @click', async () => {
    const { getByRole } = render(SilentBoxGallery, { props })
    const link = getByRole('link')
    await fireEvent.click(link)
    expect(getByRole('overlay'))
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
