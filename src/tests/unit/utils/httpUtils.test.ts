import { httpGet } from '../../../utils/httpUtils'
import { vi, describe, it, expect } from 'vitest'

interface FakeXMLHttpRequestTypes {
  open: (method: string, url: string) => void,
  send: () => void,
  url?: string,
  responseText: string
}
function FakeXMLHttpRequest (this: FakeXMLHttpRequestTypes) {
  this.responseText = ''
  this.open = vi.fn().mockImplementation((method: string, url: string) => {
    this.responseText = JSON.stringify({ url, method })
  })
  this.send = vi.fn()
}
function FakeErrorXMLHttpRequest (this: FakeXMLHttpRequestTypes) {
  this.responseText = ''
  this.open = vi.fn().mockImplementation((method: string, url: string) => {
    throw new Error('404 Not found')
  })
  this.send = vi.fn()
}

describe('Test httpGet(url: string): any', () => {
  vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest)
  it('should always return JSON object', () => {
    expect(httpGet('http://example.com')).toStrictEqual({ url: 'http://example.com', method: 'GET' })
  })
  it('should throw error when URL is not valid URL', () => {
    expect(() => httpGet('http://example')).toThrowError('Given string: url is not valid URL address.')
  })
  it('should return NULL when request fails', () => {
    vi.stubGlobal('XMLHttpRequest', FakeErrorXMLHttpRequest)
    expect(httpGet('http://example.com')).toStrictEqual(null)
  })
})
