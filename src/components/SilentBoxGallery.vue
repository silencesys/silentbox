<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { getThumbnail, isEmbedVideo } from '../utils/itemUtils'
import type { ItemProps } from '../types'
import SilentBoxOverlay, { type OverlayProps } from './SilentBoxOverlay.vue'

export interface GalleryProps {
  lazyLoading?: boolean,
  previewCount?: number,
  fallbackThumbnail?: string,
  gallery?: ItemProps[],
  image?: ItemProps
}
const props = defineProps<GalleryProps>()
/**
 * Get total length of gallery if set, otherwise is always 1.
 *
 * @return number
 */
const totalItems = computed<number>(() => {
  if (props.gallery) return props.gallery.length
  return 1
})
const overlay: OverlayProps = reactive({
  item: {
    src: '',
    alt: '',
    thumbnailWidth: 150,
    thumbnailHeight: 0,
    thumbnail: '',
    autoplay: false,
    controls: true,
    description: ''
  },
  visible: false,
  currentItem: 0,
  totalItems
})
/**
 * Set item thumbnail based on item.src.
 *
 * @param {string} itemSrc
 * @return string
 */
const getThumbnailURL = (itemSrc: string): string => {
  if (isEmbedVideo(itemSrc)) {
    return getThumbnail(itemSrc, props.fallbackThumbnail)
  }
  return itemSrc
}
/**
 * Map gallery items so it awlays contain thumbnail.
 *
 * @params {ItemProps} item
 * @return ItemProps
 */
const mapGalleryItem = (item: ItemProps): ItemProps => ({
  ...overlay.item,
  ...item,
  thumbnail: item.thumbnail ? item.thumbnail : getThumbnailURL(item.src)
})
/**
 * Create gallery with items that alwys contain all necessary information.
 * @note image is there for backward compatibility - might be deleted later
 *
 * @return ItemProps[]
 */
const getGalleryItems = (): ItemProps[] => {
  if (props.gallery && props.gallery.length > 0) {
    // Show whole gallery
    return props.gallery.map(mapGalleryItem)
  }
  if (props.image) {
    // Show single image only
    return [mapGalleryItem(props.image)]
  }
  return []
}
/**
 * Thumbnail gallery can be smaller than actual gallery as it is defined by
 * prop.previewCount. Thus, we need to compute thumbnail gallery separately.
 *
 * @return ItemProps[]
 */
const getGalleryThumbnails = computed<ItemProps[]>(() => {
  if (props.previewCount && props.previewCount > 0 && props.gallery) {
    return props.gallery.slice(0, props.previewCount).map(mapGalleryItem)
  }
  return getGalleryItems()
})
/**
 * Cache gallery in computed property.
 *
 * @return ItemProps[]
 */
const getGallery = computed<ItemProps[]>(() => getGalleryItems())

const emit = defineEmits([
  'silentbox-overlay-opened',
  'silentbox-overlay-hidden',
  'silentbox-overlay-next-item-displayed',
  'silentbox-overlay-prev-item-displayed'
])

/**
 * Open overlay and emit event that can be listened on the global SilentBox
 * component.
 *
 * @prop {ItemProps} item an image or video
 * @prop {number} index position of current element in gallery array
 */
const openOverlay = (item: ItemProps, index: number = 0): void => {
  overlay.visible = true
  overlay.item = item
  overlay.currentItem = index
  emit('silentbox-overlay-opened', item)
}
/**
 * Close overlay and emit event that can be listened on the global SilentBox
 * component.
 */
const hideOverlay = (): void => {
  overlay.visible = false
  emit('silentbox-overlay-hidden', overlay.item)
}
/**
 * Get next item for overlay, if we reach end of the gallery array, get
 * the first element. Emit event that can be listened on the global SilentBox
 * component.
 *
 * @prop {ItemProps} item an image or video
 * @prop {number} index position of current element in gallery array
 */
const showNextItem = (): void => {
  let nextItemIndex = overlay.currentItem + 1
  nextItemIndex = nextItemIndex <= getGallery.value.length - 1 ? nextItemIndex : 0
  overlay.item = getGallery.value[nextItemIndex]
  overlay.currentItem = nextItemIndex
  emit('silentbox-overlay-next-item-displayed', overlay.item)
}
/**
 * Get previous item for overlay, if we reach beginning of the gallery array, get
 * the last element. Emit event that can be listened on the global SilentBox
 * component.
 *
 * @prop {ItemProps} item an image or video
 * @prop {number} index position of current element in gallery array
 */
const showPrevItem = (): void => {
  let prevItemIndex = overlay.currentItem - 1
  prevItemIndex = prevItemIndex >= 0 ? prevItemIndex : getGallery.value.length - 1
  overlay.item = getGallery.value[prevItemIndex]
  overlay.currentItem = prevItemIndex
  emit('silentbox-overlay-prev-item-displayed', overlay.item)
}
// Expose method openOverlay, so it can be called from $refs
defineExpose({ openOverlay })
</script>

<template>
  <div>
    <slot />
    <a
      :key="image.src"
      v-for="(image, index) in getGalleryThumbnails"
      :href="image.src"
      @click.prevent="openOverlay(image, index)"
      class="silentbox-item"
    >
      <slot name="silentbox-item" :silentbox-item="image">
        <img
          :loading="(lazyLoading)? 'lazy' : 'eager'"
          :src="image.thumbnail"
          :alt="image.alt"
          :width="image.thumbnailWidth"
          :height="image.thumbnailHeight"
        >
      </slot>
    </a>
    <SilentBoxOverlay
      :visible="overlay.visible"
      :item="overlay.item"
      :current-item="overlay.currentItem"
      :total-items="totalItems"
      @silentbox-internal-close-overlay="hideOverlay"
      @silentbox-internal-get-next-item="showNextItem"
      @silentbox-internal-get-prev-item="showPrevItem"
    />
  </div>
</template>

<style lang="scss">
  .silentbox-item {
      cursor: pointer;
      display: inline-block;
      text-decoration: underline;
  }
</style>
