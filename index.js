import Gallery from './src/components/gallery.vue'
import Overlay from './src/components/overlay.vue'

const VueSilentbox = {}

VueSilentbox.install = function (Vue) {
  Vue.mixin({
    components: {
      'silent-box': Gallery
    }
  })
  Vue.prototype.$silentbox = {
    /**
     * Programatically open SilentBox overlay.
     *
     * @param {Object} image
     */
    open: (image) => {
      const OverlayClass = Vue.extend(Overlay)
      const instance = new OverlayClass().$mount()
      instance.$set(instance, 'visible', true)
      instance.$set(instance, 'overlayItem', image)
      // Get the website body, so we can append false silentbox root to it later
      const bodyRoot = document.getElementsByTagName('body')[0]
      // Create false silentbox root
      const silentboxRoot = document.createElement('div')
      // Set ID to false silentbox root, so we can target it in some cases
      silentboxRoot.setAttribute('id', 'silentbox--false-root')

      // Register the elements
      silentboxRoot.appendChild(instance.$el)
      bodyRoot.appendChild(silentboxRoot)

      instance.$on('closeSilentboxOverlay', () => {
        // Remove and destroy the instance after closing.
        silentboxRoot.remove()
        instance.$destroy()
      })
    }
  }
}

export default VueSilentbox
