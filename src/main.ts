import { createApp, type App, type Plugin } from 'vue'
import GalleryVue from './components/SilentBoxGallery.vue'
import OverlayVue from './components/SilentBoxOverlay.vue'
import type { ItemProps, SilentBoxOptions } from './types'

const SilentBox: Plugin = {
  install: (Vue: App, options: SilentBoxOptions = {}): void => {
    Vue.component('silent-box', GalleryVue)
    Vue.provide('silent-box-options', {
      downloadButtonLabel: 'Download',
      ...options
    })

    /**
     * Global function to call SilentBox on any element.
     */
    Vue.config.globalProperties.$silentbox = {
      /**
       * Open SilentBox programatically via $silentbox global property.
       *
       * @param {ItemProps} item
       */
      open: (item: ItemProps): void => {
        const silentBoxRoot = document.createElement('div')
        silentBoxRoot.setAttribute('id', 'silentbox--false-root')
        const overlayComponent = createApp(OverlayVue, {
          item,
          currentItem: 1,
          totalItems: 1,
          visible: true,
          onSilentboxInternalCloseOverlay: () => {
            // Emit event with current item so it has the same API as gallery
            overlayInstance.$emit('silentbox-overlay-hidden', item)
            overlayComponent.unmount()
            silentBoxRoot.remove()
          }
        })
        const overlayInstance = overlayComponent.mount(silentBoxRoot)
        // Emit event with current item so it has the same API as gallery
        overlayInstance.$emit('silentbox-overlay-opened', item)
        // We need to force update the component to register keyboard events
        overlayInstance.$forceUpdate()
        document.body.appendChild(overlayInstance.$el)
      }
    }
  }
}

export default SilentBox
