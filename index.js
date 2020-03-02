import gallery from './src/components/gallery.vue'

const VueSilentbox = {}

VueSilentbox.install = function (Vue, options) {
  Vue.mixin({
    components: {
      'silent-box': gallery
    }
  })
}

export default VueSilentbox
