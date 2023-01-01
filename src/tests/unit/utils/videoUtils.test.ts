import { describe, test, expect } from 'vitest'
import { getYoutubeVideoId, getVimeoVideoId, getTwitchChannelId } from '../../../utils/videoUtils'

describe.concurrent('Test getYoutubeVideoId(url: string): string', () => {
  test('Get ID from ordinary YouTube video URL', () => {
    expect(getYoutubeVideoId('https://www.youtube.com/watch?v=1xqwnD3BdT4')).toBe('1xqwnD3BdT4')
  })
  test('Get ID from YouTube share video URL', () => {
    expect(getYoutubeVideoId('https://youtu.be/1xqwnD3BdT4')).toBe('1xqwnD3BdT4')
  })
  test('Get ID from YouTube embed video URL', () => {
    expect(getYoutubeVideoId('https://www.youtube.com/embed/1xqwnD3BdT4')).toBe('1xqwnD3BdT4')
  })
  test('Wrong link return false', () => {
    expect(getYoutubeVideoId('https://google.com')).toBeFalsy()
  })
  test('Non valid URL return false', () => {
    expect(getYoutubeVideoId('abecede')).toBeFalsy()
  })
  test('Non valid URL - numbers - return false', () => {
    expect(getYoutubeVideoId('123456')).toBeFalsy()
  })
})

describe.concurrent('Test getVimeoVideoId(url: string): string', () => {
  test('Get ID from ordinary Vimeo video URL', () => {
    expect(getVimeoVideoId('https://vimeo.com/238573128')).toBe('238573128')
  })
  test('Get ID from embed video URL', () => {
    expect(getVimeoVideoId('https://player.vimeo.com/video/238573128')).toBe('238573128')
  })
  test('Wrong link return false', () => {
    expect(getVimeoVideoId('https://google.com')).toBeFalsy()
  })
  test('Non valid URL - string - return false', () => {
    expect(getVimeoVideoId('abecede')).toBeFalsy()
  })
  test('Non valid URL - numbers - return false', () => {
    expect(getVimeoVideoId('123456')).toBeFalsy()
  })
})

describe.concurrent('Test getTwitchVideoUrl(url: string): string', () => {
  test('Get ID from ordinary Twitch video URL', () => {
    expect(getTwitchChannelId('https://www.twitch.tv/method')).toBe('method')
  })
  test('Get ID from embed video URL', () => {
    expect(getTwitchChannelId('https://player.twitch.tv/?channel=method&parent=www.example.com')).toBe('method')
  })
  test('Wrong link return false', () => {
    expect(getTwitchChannelId('https://google.com')).toBeFalsy()
  })
  test('Non valid URL - string - return false', () => {
    expect(getTwitchChannelId('abecede')).toBeFalsy()
  })
  test('Non valid URL - numbers - return false', () => {
    expect(getTwitchChannelId('123456')).toBeFalsy()
  })
})
