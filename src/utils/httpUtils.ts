import { isValidURL } from './itemUtils'

/**
 * XMLHttpRequest is used because Vue does not work very well with top-level
 * async setup. Thus, we need to make this call synchronnous.
 *
 * @param {string} url
 * return any
 */
export const httpGet = (url: string): any => {
  if (isValidURL(url)) {
    try {
      const xmlHttp = new XMLHttpRequest()
      xmlHttp.open('GET', url, false)
      xmlHttp.send(null)
      return JSON.parse(xmlHttp.responseText)
    } catch (error) {
      console.log(error)
      return null
    }
  }
  throw new Error('Given string: url is not valid URL address.')
}
