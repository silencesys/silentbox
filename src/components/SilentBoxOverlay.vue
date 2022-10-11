<script lang="ts" setup>
import { isEmbedVideo, isLocalVideo } from '../utils/itemUtils'
import type { ItemProps } from '../types'
import { getVimeoVideoId, getYoutubeVideoId } from '../utils/videoUtils'
import { onUpdated, reactive } from 'vue'

export interface OverlayProps {
  item: ItemProps,
  visible: boolean,
  currentItem: number,
  totalItems: number
}

const props = defineProps<OverlayProps>()
const parseYouTubeVideo = (url: string): string => {
  let videoURL = ''
  const videoId = getYoutubeVideoId(url)
  if (videoId) {
    videoURL = `${location.protocol}//www.youtube.com/embed/${videoId}?rel=0`
    if (props.item.autoplay) videoURL += '&autoplay=1'
    // we check if controls should be turned OFF as default is ON
    if (!props.item.controls) videoURL += '&controls=0'
  }
  return videoURL
}
const parseVimeoVideo = (url: string): string => {
  let videoURL = ''
  const videoId = getVimeoVideoId(url)
  if (videoId) {
    videoURL = `${location.protocol}//player.vimeo.com/video/${videoId}?rel=0`
    if (props.item.autoplay) videoURL += '&autoplay=1'
  }
  return videoURL
}
const parseURL = (url: string): string => {
  if (/(youtu\.?be)/.test(url)) {
    return parseYouTubeVideo(url)
  } else if (/(vimeo(pro)?\.com)/.test(url)) {
    return parseVimeoVideo(url)
  }
  return url
}

const lockScrolling = (): void => {
  if (!document.body.classList.contains('silentbox-is-opened')) {
    document.body.classList.add('silentbox-is-opened')
  }
}
const unlockScrolling = (): void => {
  if (document.body.classList.contains('silentbox-is-opened')) {
    document.body.classList.remove('silentbox-is-opened')
  }
}

// Overlay navigation
const animation = reactive({
  name: 'silentbox-animation__swipe-left'
})
const emit = defineEmits([
  'closeSilentBoxOverlay',
  'getNextItem',
  'getPrevItem',
  // Following events are used only when component is opened from global call
  'silentbox-overlay-opened',
  'silentbox-overlay-hidden'
])
const handleClose = () => { emit('closeSilentBoxOverlay') }
const handleMoveNext = () => {
  animation.name = 'silentbox-animation__swipe-left'
  emit('getNextItem')
}
const handleMovePrev = () => {
  animation.name = 'silentbox-animation__swipe-right'
  emit('getPrevItem')
}
const handleKeys = (event: KeyboardEvent) => {
  if (event.code === 'Escape') handleClose()
  if (event.code === 'ArrowRight') handleMoveNext()
  if (event.code === 'ArrowLeft') handleMovePrev()
}
const touchData = reactive({
  posX: 0,
  posY: 0
})
const touchStart = (event: TouchEvent): void => {
  const { clientX: x, clientY: y } = event.touches[0]
  touchData.posX = x
  touchData.posY = y
}
const touchMove = (event: TouchEvent): void => {
  const { clientX: x, clientY: y } = event.touches[0]
  const { posX, posY } = touchData

  if (posX === 0 || posY === 0) {
    return
  }
  const xDiff = posX - x
  const yDiff = posY - y
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      handleMoveNext()
    } else {
      handleMovePrev()
    }
  }
  // Reset for next move
  touchData.posX = 0
  touchData.posY = 0
}
onUpdated(() => {
  // We must use onUpdate hook as otherwise it seems Vue adds event listener
  // for each instance of silent-box. Other hooks as onBeforeUnmount or
  // onUnmount does not remove event listner, thus this awkward condition.
  if (props.visible) {
    window.addEventListener('keyup', handleKeys)
    lockScrolling()
  } else {
    window.removeEventListener('keyup', handleKeys)
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
    @touchmove="touchMove"
  >
    <div id="silentbox-overlay__background" />
    <transition :name="animation.name" mode="out-in">
      <div
        id="silentbox-overlay__content"
        @click.stop="handleClose"
        :key="props.item.src"
      >
        <div id="silentbox-overlay__embed">
          <div id="silentbox-overlay__container">
            <!-- Embed video rendering -->
            <iframe
              v-if="isEmbedVideo(props.item.src)"
              :allow="`accelerometer; ${ !!props.item.autoplay && 'autoplay;' } encrypted-media; gyroscope; picture-in-picture`"
              :src="parseURL(props.item.src)"
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
