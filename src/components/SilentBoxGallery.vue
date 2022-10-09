<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { getThumbnail, isEmbedVideo, isValidURL } from '../utils/itemUtils'
import type { ItemProps, OverlayEventProps } from '../types'
import SilentBoxOverlay, { type OverlayProps } from './SilentBoxOverlay.vue'

export interface GalleryProps {
  lazyLoading?: boolean,
  previewCount?: number,
  fallbackThumbnail?: string,
  gallery?: ItemProps[],
  image?: ItemProps
}
const props = withDefaults(defineProps<GalleryProps>(), {
  lazyLoading: true,
  previewCount: 0,
  fallbackThumbnail: '',
  gallery: () => [],
  image: () => ({
    src: '',
    srcSet: [],
    alt: '',
    thumbnailWidth: 150,
    thumbnailHeight: 0,
    thumbnail: '',
    autoplay: false,
    controls: true,
    description: ''
  })
})

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
const mapItem = (item: ItemProps): ItemProps => ({
  ...overlay.item,
  ...item,
  thumbnail: setThumbnail(item),
  autoplay: item.autoplay
})
const getGallery = computed<ItemProps[]>(() => {
  if (props.previewCount && props.previewCount > 0 && props.gallery) {
    return props.gallery.slice(0, props.previewCount).map(mapItem)
  }
  if (props.gallery && props.gallery.length > 0) {
    return props.gallery.map(mapItem)
  }
  if (props.image) {
    return [mapItem(props.image)]
  }
  return []
})
const setThumbnail = (item: ItemProps) => {
  if (isEmbedVideo(item.src) && !item.thumbnail) {
    return getThumbnail(item.src, props.fallbackThumbnail)
  }
  if (item.thumbnail && isValidURL(item.thumbnail)) return item.thumbnail
  return item.src
}
const emit = defineEmits([
  'silentbox-overlay-opened',
  'silentbox-overlay-hidden',
  'silentbox-overlay-next-item-displayed',
  'silentbox-overlay-prev-item-displayed'
])
const openOverlay = (item: ItemProps, index: number = 0): void => {
  overlay.visible = true
  overlay.item = item
  overlay.currentItem = index
  emit('silentbox-overlay-opened', { item } as OverlayEventProps)
}
const hideOverlay = (): void => {
  overlay.visible = false
  emit('silentbox-overlay-hidden', overlay.item)
}
const showNextItem = (): void => {
  let nextItemIndex = overlay.currentItem + 1
  nextItemIndex = nextItemIndex <= getGallery.value.length - 1 ? nextItemIndex : 0
  overlay.item = getGallery.value[nextItemIndex]
  overlay.currentItem = nextItemIndex
  emit('silentbox-overlay-next-item-displayed', overlay.item)
}
const showPrevItem = (): void => {
  let prevItemIndex = overlay.currentItem - 1
  prevItemIndex = prevItemIndex >= 0 ? prevItemIndex : getGallery.value.length - 1
  overlay.item = getGallery.value[prevItemIndex]
  overlay.currentItem = prevItemIndex
  emit('silentbox-overlay-prev-item-displayed', overlay.item)
}
</script>

<template>
  <div>
    <slot />
    <a
      :key="image.src"
      v-for="(image, index) in getGallery"
      :href="image.src"
      @click.prevent="openOverlay(image, index)"
      class="silentbox-item"
    >
      <slot name="silentbox-item" :silentboxItem="image">
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
      :currentItem="overlay.currentItem"
      :totalItems="totalItems"
      @closeSilentBoxOverlay="hideOverlay"
      @getNextItem="showNextItem"
      @getPrevItem="showPrevItem"
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
