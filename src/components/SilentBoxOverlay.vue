<script lang="ts" setup>
import { isEmbedVideo, isLocalVideo } from '../utils/itemUtils'
import type { ItemProps, SilentBoxOptions } from '../types'
import { getVimeoVideoId, getYoutubeVideoId, getTwitchChannelId } from '../utils/videoUtils'
import { onUpdated, reactive, computed, inject } from 'vue'

export interface OverlayProps {
  item: ItemProps,
  visible: boolean,
  currentItem: number,
  totalItems: number
}

// Inject plugin options, ensure the label is always defined.
const silentBoxOptions = inject<SilentBoxOptions>('silent-box-options') ||
  { downloadButtonLabel: 'Download' }

const props = defineProps<OverlayProps>()

/**
 * Compute download link property.
 * @return {string}
 */
const downloadLink = computed<string>(() => {
  if (typeof props.item.download === 'string') {
    return props.item.download
  }
  return props.item.src
})

/**
 * Get YouTube video embed URL and set autoplay and controls state.
 *
 * @param {string} url any video URL from YouTube
 * @return string
 */
const getYouTubeVideoURL = (url: string): string => {
  let videoURL = ''
  const videoId = getYoutubeVideoId(url)
  if (videoId) {
    videoURL = `${location.protocol}//www.youtube.com/embed/${videoId}?rel=0`
    if (props.item.autoplay) videoURL += '&autoplay=1'
    // check whether controls should disabled as default is enabled
    if (!props.item.controls) videoURL += '&controls=0'
  }
  return videoURL
}
/**
 * Get Vimeo video embed URL and set autoplay and controls state.
 *
 * @param {string} url any video URL from Vimeo or VimeoPro
 * @return string
 */
const getVimeoVideoURL = (url: string): string => {
  let videoURL = ''
  const videoId = getVimeoVideoId(url)
  if (videoId) {
    videoURL = `${location.protocol}//player.vimeo.com/video/${videoId}?rel=0`
    if (props.item.autoplay) videoURL += '&autoplay=1'
  }
  return videoURL
}
/**
 * Get Twitch video embed URL.
 */
const getTwitchVideURL = (url: string): string => {
  let videoURL = ''
  const channelID = getTwitchChannelId(url)
  if (channelID) {
    videoURL = `${location.protocol}//player.twitch.tv/?channel=${channelID}&parent=${location.hostname}`
    if (props.item.autoplay) videoURL += '&autoplay=true'
  }
  return videoURL
}
/**
 * Check whether provided URL is YouTube or Vimeo, otherwise always return it
 * as it is.
 *
 * @param {string} url
 * @return {string}
 */
const getVideoURL = (url: string): string => {
  if (/(youtu\.?be)/.test(url)) {
    return getYouTubeVideoURL(url)
  } else if (/(vimeo(pro)?\.com)/.test(url)) {
    return getVimeoVideoURL(url)
  } else if (/(?:player\.|clips\.|www\.)?twitch\.tv/.test(url)) {
    return getTwitchVideURL(url)
  }
  return url
}
/**
 * Lock horizontal and vertical scrolling when user opens overlay to improve
 * user-experience.
 */
const lockScrolling = (): void => {
  if (!document.body.classList.contains('silentbox-is-opened')) {
    document.body.classList.add('silentbox-is-opened')
  }
}
/**
 * Unlock horizontal and vertical scrolling.
 */
const unlockScrolling = (): void => {
  if (document.body.classList.contains('silentbox-is-opened')) {
    document.body.classList.remove('silentbox-is-opened')
  }
}

const animation = reactive({
  name: 'silentbox-animation__swipe-left'
})

const emit = defineEmits([
  'silentbox-internal-close-overlay',
  'silentbox-internal-get-next-item',
  'silentbox-internal-get-prev-item',
  // Following events are emitted only when component is opened from global call
  'silentbox-overlay-opened',
  'silentbox-overlay-hidden'
])
const handleClose = (): void => { emit('silentbox-internal-close-overlay') }
const handleMoveNext = (): void => {
  animation.name = 'silentbox-animation__swipe-left'
  emit('silentbox-internal-get-next-item')
}
const handleMovePrev = (): void => {
  animation.name = 'silentbox-animation__swipe-right'
  emit('silentbox-internal-get-prev-item')
}

const touchPosition = reactive({
  posX: 0,
  posY: 0
})
/**
 * Save user's start position on touch-enabled device and touch event began.
 *
 * @param {TouchEvent} event
 */
const touchStart = (event: TouchEvent): void => {
  const { clientX: x, clientY: y } = event.touches[0]
  touchPosition.posX = x
  touchPosition.posY = y
}
/**
 * Calculate user's touch movement direction, so we can change overlay content
 * accordingly.
 *
 * @param {TouchEvent} event
 */
const handleTouchMove = (event: TouchEvent): void => {
  const { clientX: x, clientY: y } = event.touches[0]
  const { posX, posY } = touchPosition

  if (posX === 0 || posY === 0) {
    // return if user did not moved
    return
  }
  const xDiff = posX - x
  const yDiff = posY - y
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    // User moved on x-axis
    if (xDiff > 0) {
      // if difference between starging point
      // and movement point is positive,
      // move to next item
      handleMoveNext()
    } else {
      // otherwise move to previous item
      handleMovePrev()
    }
    // ... y-axis events could be added here
  }

  // Reset start position for next event
  touchPosition.posX = 0
  touchPosition.posY = 0
}
/**
 * Register keyboard interaction.
 *
 * @param {KeyboardEvent} event
 */
const handleKeyInteraction = (event: KeyboardEvent): void => {
  if (event.code === 'Escape') handleClose()
  if (event.code === 'ArrowRight') handleMoveNext()
  if (event.code === 'ArrowLeft') handleMovePrev()
}
onUpdated(() => {
  // We must use onUpdate hook as otherwise it seems Vue adds event listener
  // for each instance of silent-box. Other hooks as onBeforeUnmount or
  // onUnmount does not remove event listner, thus this awkward condition.
  if (props.visible) {
    window.addEventListener('keyup', handleKeyInteraction)
    lockScrolling()
  } else {
    window.removeEventListener('keyup', handleKeyInteraction)
    unlockScrolling()
  }
})
</script>

<template>
  <div
    id="silentbox-overlay"
    v-if="props.visible"
    role="overlay"
    @touchstart="touchStart"
    @touchmove="handleTouchMove"
  >
    <div id="silentbox-overlay__background" />
    <transition :name="animation.name" mode="out-in">
      <div
        id="silentbox-overlay__content"
        @click.stop="handleClose"
        :key="props.item.src"
      >
        <div id="silentbox-overlay__embed">
          <div id="silentbox-overlay__container" @click.stop>
            <!-- Embed video rendering -->
            <iframe
              v-if="isEmbedVideo(props.item.src)"
              :allow="`accelerometer; ${ !!props.item.autoplay && 'autoplay;' } encrypted-media; gyroscope; picture-in-picture`"
              :src="getVideoURL(props.item.src)"
              frameborder="0"
              width="100%"
              height="100%"
              allowfullscreen
            />
              <!-- Local video rendering -->
              <div
                v-else-if="isLocalVideo(props.item.src)"
                class="silentbox-video__frame"
              >
                <video
                  :src="props.item.src"
                  :autoplay="props.item.autoplay ? true : false"
                  :controls="props.item.controls"
                  class="silentbox-video__embed"
                />
              </div>
              <!-- Image rendering -->
              <img
                v-else
                :srcset="props.item.srcSet ? props.item.srcSet.join(',') : props.item.src"
                :src="props.item.src"
                :alt="props.item.alt"
              />
            </div>
            <p
              id="silentbox-overlay__description"
              v-if="props.item.description"
              @click.prevent.stop=""
            >
              {{ props.item.description }}
            </p>
            <div v-if="props.item.download" id="silentbox-overlay__tool-buttons">
              <a :href="downloadLink" class="download" download>{{ silentBoxOptions.downloadButtonLabel }}</a>
            </div>
          </div>
      </div>
    </transition>
    <button
      id="silentbox-overlay__close-button"
      role="button"
      tabindex="3"
      @click.prevent="handleClose"
      @keyup.enter="handleClose"
    >
      <div class="icon" />
    </button>
    <div id="silentbox-overlay__arrow-buttons" v-if="props.totalItems > 1">
      <button
        class="arrow arrow-previous"
        role="button"
        tabindex="2"
        @click.stop="handleMovePrev"
        @keyup.enter="handleMovePrev"
      >
      </button>
      <button
        class="arrow arrow-next"
        role="button"
        tabindex="1"
        @click.stop="handleMoveNext"
        @keyup.enter="handleMoveNext"
      >
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@mixin element($element) {
  &__#{$element} {
    @content;
  }
}
$main:   #fff;
$accent: #58e8d2;
$bg: #000;
.silentbox-is-opened {
  overflow: hidden;
}
#silentbox-overlay {
  display: block;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 999;
  @include element(background) {
    background: rgba($bg, .75);
    backdrop-filter: blur(20px);
    cursor: default;
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  @include element(content) {
    cursor: default;
    display: block;
    height: 100%;
    position: relative;
    width: 100%;
  }
  @include element(embed) {
    bottom: 0;
    cursor: default;
    display: block;
    height: 80%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: -2.5rem;
    width: 75%;
    img,
    iframe {
      background-color: $bg;
      bottom: 0;
      box-shadow: 0 0 1.5rem rgba($bg, .45);
      cursor: default;
      display: block;
      left: 0;
      margin: auto;
      max-height: 100%;
      max-width: 100%;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  @include element(container) {
    cursor: default;
    height: 100%;
    margin: 0;
    position: relative;
    text-align: center;
    width: 100%;
  }
  @include element(tool-buttons) {
    text-align: center;
    margin-top: 1rem;
    width: 100%;
    a {
      color: $main;
      position: relative;
      display: inline-block;
      line-height: 1.5rem;
      font-size: .9rem;
      border: 1px solid $main;
      border-radius: 1rem;
      padding: .15rem .8rem;
      &:hover {
        color: $accent;
        border-color: $accent;
        &.download::before {
          background: $accent;
        }
        &.download::after {
          border-color: $accent;
        }
      }
      &.download {
        padding-right: 1.8rem;
      }
      &.download::before {
        content: ' ';
        display: block;
        width: 1px;
        height: 9px;
        position: absolute;
        right: calc(.9rem + 3px);
        top: .6rem;
        background: $main;
      }
      &.download::after {
        content: ' ';
        display: block;
        position: absolute;
        right: .9rem;
        top: .65rem;
        border-bottom: 1px solid $main;
        border-right: 1px solid $main;
        width: 7px;
        height: 7px;
        transform: rotate(45deg);
      }
    }
  }
  @include element(description) {
    display: block;
    padding-top: 1rem;
    text-align: center;
    color: $main;
  }

  @include element(close-button) {
    background: rgba($bg, .0);
    border: none;
    color: $main;
    cursor: pointer;
    height: 2.5rem;
    position: absolute;
    right: 0;
    top: 0;
    transition: background-color 250ms ease-out;
    width: 2.5rem;
    &:hover,
    &:focus {
      background-color: rgba($bg, .5);
      outline: none;
    }
    @media (max-width: 1024px) {
      height: 5.75rem;
      width: 5.75rem;
    }
    .icon {
      color: $main;
      cursor: pointer;
      height: 1rem;
      left: .7rem;
      margin: 50% 50% 0 0;
      position: absolute;
      right: 0px;
      top: -.5rem;
      transition: 250ms ease;
      width: 1rem;
      @media (max-width: 1024px) {
        height: 2.5rem;
        width: 2.5rem;
        left: -1rem;
      }
      &:before,
      &:after {
        background: $main;
        content: "";
        height: 2px;
        left: 5%;
        position: absolute;
        top: 50%;
        transition: 250ms ease;
        width: 100%;
      }
      &:before {
        transform: rotate(-45deg);
      }
      &:after {
        transform: rotate(45deg);
    }
      &:hover,
      &:focus {
        &:before,
        &:after {
          background: $accent;
          left: 25%;
          width: 50%;
        }
      }
    }
  }
  @include element(arrow-buttons) {
    .arrow {
      border-left: 2px solid $main;
      border-top: 2px solid $main;
      cursor: pointer;
      height: 1.5rem;
      position: absolute;
      width: 1.5rem;
      &:hover,
      &:focus {
        outline: none;
        border-color: $accent;
      }
    }
    .arrow-previous {
      left: 2rem;
      top: 50%;
      transform: rotate(-45deg);
      &:hover,
      &:focus {
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-name: pulsingPrevious;
      }
    }
    .arrow-next {
      right: 2rem;
      top: 50%;
      transform: rotate(135deg);
      &:hover,
      &:focus {
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-name: pulsingNext;
      }
    }
  }
  .silentbox-video__frame {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .silentbox-video__embed {
    outline: none;
    &:active,
    &:focus,
    &:hover {
      outline: none
    }
  }
}
// Transitions
.silentbox-animation__swipe-left-enter-active {
  transition: all .3s ease;
  opacity: 0;
  transform: translateX(25vw);
}
.silentbox-animation__swipe-left-leave-active {
  transition: all .3s ease;
  transition: opacity .5s;
}
.silentbox-animation__swipe-left-enter-to {
  opacity: 1;
  transition: all .3s ease;
  transform: translateX(0);
}
.silentbox-animation__swipe-left-leave-to {
  opacity: 0;
  transition: all .3s ease;
  transform: translateX(-25vw);
}
.silentbox-animation__swipe-right-enter-active {
  transition: all .3s ease;
  opacity: 0;
  transform: translateX(-25vw);
}
.silentbox-animation__swipe-right-leave-active {
  transition: all .3s ease;
  transition: opacity .5s;
}
.silentbox-animation__swipe-right-enter-to {
  opacity: 1;
  transition: all .3s ease;
  transform: translateX(0);
}
.silentbox-animation__swipe-right-leave-to {
  opacity: 0;
  transition: all .3s ease;
  transform: translateX(25vw);
}

// Animations
@keyframes pulsingNext {
  0%   {
    animation-timing-function: ease-in;
    right: 2rem;
  }
  25%  {
    animation-timing-function: ease-in;
    right: 1.75rem;
  }
  75%  {
    animation-timing-function: ease-in;
    right: 2.25rem;
  }
  100% {
    animation-timing-function: ease-in;
    right: 2rem;
  }
}
@keyframes pulsingPrevious {
  0%   {
    animation-timing-function: ease-in;
    left: 2rem;
  }
  25%  {
    animation-timing-function: ease-in;
    left: 1.75rem;
  }
  75%  {
    animation-timing-function: ease-in;
    left: 2.25rem;
  }
  100% {
    animation-timing-function: ease-in;
    left: 2rem;
  }
}
</style>
