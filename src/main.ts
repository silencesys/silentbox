import type { App, Plugin } from 'vue'
import GalleryVue from './components/SilentBoxGallery.vue'

const SilentBox: Plugin = {
  install: (Vue: App, options: any): void => {
    Vue.component('silent-box', GalleryVue)
    console.log('Registered')
  }
}

export default SilentBox
