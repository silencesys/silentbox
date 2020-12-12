<template>
  <section id="silentbox-gallery">
    <slot />
    <div
      v-for="(image, index) in previewGallery"
      :key="image.src"
      @click="openOverlay(image, index)"
      class="silentbox-item"
    >
      <slot
          name="silentbox-item"
          v-bind:silentboxItem="image"
      >
        <img
          :loading="(this.lazyLoading)? 'lazy' : 'eager'"
          :src="image.thumbnail"
          :alt="image.alt"
          :width="image.thumbnailWidth"
          :height="image.thumbnailHeight"
        >
      </slot>
    </div>
    <silentbox-overlay
      v-if="overlay.visible"
      :overlay-item="overlay.item"
      :visible="overlay.visible"
      :total-items="totalItems"
      @closeSilentboxOverlay="hideOverlay"
      @requestNextSilentBoxItem="showNextItem"
      @requestPreviousSilentBoxItem="showPreviousItem"
    />
  </section>
</template>

<script>
import overlay from './overlay.vue'
import itemMixin from './../mixins/item'

export default {
  name: 'silentboxGallery',
  mixins: [itemMixin],
  props: {
    lazyLoading: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    previewCount: {
      type: Number,
      default: null
    },
    gallery: {
      type: Array,
      default: () => {
        return []
      }
    },
    image: {
      type: Object,
      default: () => {
        return {
          src: '',
          alt: '',
          thumbnailWidth: 'auto',
          thumbnailHeight: 'auto',
          thumbnail: '',
          autoplay: false,
          controls: true,
          description: ''
        }
      }
    }
  },
  components: {
    'silentbox-overlay': overlay
  },
  data () {
    return {
      overlay: {
        item: {
          src: '',
          alt: '',
          thumbnailWidth: 'auto',
          thumbnailHeight: 'auto',
          thumbnail: '',
          autoplay: false,
          controls: true,
          description: ''
        },
        visible: false,
        currentItem: 0
      }
    }
  },
  computed: {
    totalItems () {
      return this.gallery.length || 1
    },
    previewGallery () {
      if (Number.isInteger(this.previewCount)) {
        return this.gallery.slice(0, this.previewCount).map(item => {
          return {
            ...this.overlay.item,
            ...item,
            thumbnail: this.setThumbnail(item),
            autoplay: this.setAutoplay(item)
          }
        })
      }
      return this.galleryItems
    },
    galleryItems () {
      if (this.gallery.length > 0) {
        return this.gallery.map(item => {
          return {
            ...this.overlay.item,
            ...item,
            thumbnail: this.setThumbnail(item),
            autoplay: this.setAutoplay(item)
          }
        })
      }
      return [{
        ...this.overlay.item,
        ...this.image,
        thumbnail: this.setThumbnail(this.image)
      }]
    }
  },
  methods: {
    openOverlay (image, index) {
      this.overlay.visible = true
      this.overlay.item = image
      this.overlay.currentItem = index
      this.$emit('silentbox-overlay-opened')
    },
    hideOverlay () {
      this.overlay.visible = false
      this.$emit('silentbox-overlay-hidden')
    },
    showNextItem () {
      let newItemIndex = this.overlay.currentItem + 1
      newItemIndex = newItemIndex <= this.galleryItems.length - 1
        ? newItemIndex : 0

      this.overlay.item = this.galleryItems[newItemIndex]
      this.overlay.currentItem = newItemIndex
      this.$emit('silentbox-overlay-next-item-displayed')
    },
    showPreviousItem () {
      let newItemIndex = this.overlay.currentItem - 1
      newItemIndex = newItemIndex > -1
        ? newItemIndex : this.galleryItems.length - 1

      this.overlay.item = this.galleryItems[newItemIndex]
      this.overlay.currentItem = newItemIndex
      this.$emit('silentbox-overlay-previous-item-displayed')
    },
    setAutoplay (item) {
      return item.autoplay ? 'autoplay' : ''
    },
    setThumbnail (item) {
      if (this.isEmbedVideo(item.src) && item.thumbnail === undefined) {
        return this.getThumbnail(item.src)
      }

      return item.thumbnail || item.src
    }
  }
}
</script>

<style lang="scss">
  .silentbox-item {
      cursor: pointer;
      display: inline-block;
      text-decoration: underline;
  }
</style>
