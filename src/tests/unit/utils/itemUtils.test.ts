import { getThumbnail, isEmbedVideo, isLocalVideo, isValidURL } from '../../../utils/itemUtils'
import * as httpUtils from '../../../utils/httpUtils'
import { vi, describe, it, expect, afterEach } from 'vitest'

describe.concurrent('it isEmbedVideo(itemSrc: string): boolean', () => {
  it('YouTube URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://www.youtube.com/watch?v=1xqwnD3BdT4')).toBeTruthy()
  })
  it('YouTube share URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://youtu.be/1xqwnD3BdT4')).toBeTruthy()
  })
  it('YouTube embed player URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://www.youtube.com/embed/1xqwnD3BdT4')).toBeTruthy()
  })
  it('Vimeo URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://vimeo.com/238573128')).toBeTruthy()
  })
  it('Vimeo embed player URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://player.vimeo.com/video/238573128')).toBeTruthy()
  })
  it('Twitch embed player URL is recognized as supported video service', () => {
    expect(isEmbedVideo('https://player.twitch.tv/method')).toBeTruthy()
  })
  it('Other URL is recognized as unsupported video service', () => {
    expect(isEmbedVideo('https://google.com')).toBeFalsy()
  })
  it('Image URL is recognized as unsupported video service', () => {
    expect(isEmbedVideo('https://example.com/picture.jpg')).toBeFalsy()
  })
  it('Text is recognized as unsupported video service', () => {
    expect(isEmbedVideo('Hello world!')).toBeFalsy()
  })
})
describe.concurrent('it isLocalVideo(itemSrc: string): boolean', () => {
  const supportedFormats = [
    '.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv',
    '.MP4', '.OGG', '.WEBM', '.MOV', '.FLV', '.WMV', '.MKV'
  ]
  for (const format of supportedFormats) {
    it(`${format} file is recognized as local video file`, () => {
      expect(isLocalVideo(`video${format}`)).toBeTruthy()
    })
  }
  it('Image file is not recognized as local video file', () => {
    expect(isLocalVideo('video.jpeg')).toBeFalsy()
  })
  it('Text is recognized as unsupported local video service', () => {
    expect(isLocalVideo('Hello world!')).toBeFalsy()
  })
})
describe.concurrent('it getThumbnail(src: string): string', () => {
  afterEach(() => { vi.restoreAllMocks() })
  vi.stubGlobal('location', { protocol: 'https:' })

  it('should generate YouTube thumbnail URL from YouTube URL', () => {
    expect(getThumbnail('https://www.youtube.com/watch?v=1xqwnD3BdT4')).toBe(
      'https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg'
    )
  })
  it('should generate YouTube thumbnail URL from YouTube\'s share URL', () => {
    expect(getThumbnail('https://youtu.be/1xqwnD3BdT4')).toBe(
      'https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg'
    )
  })
  it('should generate YouTube thumbnail URL from YouTube\'s embed URL', () => {
    expect(getThumbnail('https://www.youtube.com/embed/1xqwnD3BdT4')).toBe(
      'https://img.youtube.com/vi/1xqwnD3BdT4/hqdefault.jpg'
    )
  })
  it('should generate Vimeo thumbnail URL from standard Vimeo URL', () => {
    const spy = vi.spyOn(httpUtils, 'httpGet')
    spy.mockImplementation((str: string) => ([{ thumbnail_medium: str }]))
    expect(getThumbnail('https://vimeo.com/238573128'))
      .toBe('https://vimeo.com/api/v2/video/238573128.json')
    expect(spy).toBeCalledTimes(1)
  })
  it('should generate Vimeo thumbnail URL from Vimeo\'s embed player URL', () => {
    const spy = vi.spyOn(httpUtils, 'httpGet')
    spy.mockImplementation((str: string) => ([{ thumbnail_medium: str }]))
    expect(getThumbnail('https://player.vimeo.com/video/238573128'))
      .toBe('https://vimeo.com/api/v2/video/238573128.json')
    expect(spy).toBeCalledTimes(1)
  })
  it('should show fallback thumbnail if API request returns non-valid Vimeo response', () => {
    const spy = vi.spyOn(httpUtils, 'httpGet')
    spy.mockImplementation((str: string) => null)
    expect(getThumbnail('https://player.vimeo.com/video/238573128', 'fallback'))
      .toBe('fallback')
    expect(spy).toBeCalledTimes(1)
  })
  it('should return valid non-video link without changes', () => {
    expect(getThumbnail('https://example.com/website.jpg')).toBe(
      'https://example.com/website.jpg'
    )
  })
  it('should return valid non-video link with query without changes', () => {
    expect(getThumbnail('https://example.com/?image=image.jpg')).toBe(
      'https://example.com/?image=image.jpg'
    )
  })
  it('should fail with text as input', () => {
    expect(() => getThumbnail('Hello, world!')).toThrowError('Given string: src is not valid URL address.')
  })
})
describe.concurrent('Test isValidURL(src: string): boolean', () => {
  it('should return false with text as input', () => {
    expect(isValidURL('Hello, World!')).toBeFalsy()
  })
  it('should return true with https://example.com', () => {
    expect(isValidURL('https://example.com')).toBeTruthy()
  })
  it('should return true with https://example.com/?query=example', () => {
    expect(isValidURL('https://example.com/?query=example')).toBeTruthy()
  })
  it('should return true with https://example.com/page/?query=example', () => {
    expect(isValidURL('https://example.com/page/?query=example')).toBeTruthy()
  })
  it('should return true with https://example.com/page/?query=example#hash', () => {
    expect(isValidURL('https://example.com/page/?query=example#hash')).toBeTruthy()
  })
  it('should return true with https://example.com/#hash', () => {
    expect(isValidURL('https://example.com/#hash')).toBeTruthy()
  })
})
