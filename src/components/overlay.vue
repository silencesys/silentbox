<template>
  <div
    id="silentbox-overlay"
    v-if="visible"
    @touchstart="touchStart"
    @touchmove="touchMove"
  >
    <div id="silentbox-overlay__background" />

    <transition :name="animationName" mode="out-in">
      <div
        id="silentbox-overlay__content"
        @click.stop="closeSilentboxOverlay"
        :key="overlayItem.src"
      >
        <div id="silentbox-overlay__embed">
          <div id="silentbox-overlay__container">
            <!-- embed video rendering -->
            <iframe
              v-if="isEmbedVideo(overlayItem.src)"
              :allow="`accelerometer; ${ !!overlayItem.autoplay && 'autoplay;' } encrypted-media; gyroscope; picture-in-picture`"
              :src="handleUrl(overlayItem.src)"
              frameborder="0"
              width="100%"
              height="100%"
              allowfullscreen
            />
            <!-- local video rendering -->
            <div
              v-else-if="isLocalVideo(overlayItem.src)"
              class="silentbox-video__frame"
            >
              <video
                :src="overlayItem.src"
                :autoplay="overlayItem.autoplay"
                controls
                class="silentbox-video__embed"
              />
            </div>
            <!-- local/embed image rendering -->
            <img v-else :srcset="overlayItem.srcSet ? overlayItem.srcSet : overlayItem.src" :src="overlayItem.src" :alt="overlayItem.alt" width="auto" height="auto" >
          </div>
          <p
            id="silentbox-overlay__description"
            v-if="overlayItem.description">
              {{ overlayItem.description }}
          </p>
        </div>
      </div>
    </transition>

    <div
      id="silentbox-overlay__close-button"
      role="button"
      tabindex="3"
      @click.stop="closeSilentboxOverlay"
      @keyup.enter="closeSilentboxOverlay"
    >
      <div class="icon" />
    </div>

    <div id="silentbox-overlay__arrow-buttons" v-if="totalItems > 1">
      <div
        class="arrow arrow-previous"
        role="button"
        tabindex="2"
        @click.stop="moveToPreviousItem"
        @keyup.enter="moveToPreviousItem"
      />
      <div
        class="arrow arrow-next"
        role="button"
        tabindex="1"
        @click.stop="moveToNextItem"
        @keyup.enter="moveToNextItem"
      />
    </div>
  </div>
</template>

<script>
import itemMixim from './../mixins/item'

export default {
  name: 'SilentboxOverlay',
  mixins: [itemMixim],
  props: {
    overlayItem: {
      type: Object,
      default: () => {
        return {
          src: '',
          srcSet: '',
          description: ''
        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    totalItems: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      touchHandling: {
        posX: 0,
        posY: 0
      },
      animationName: 'silentbox-animation__swipe-left'
    }
  },
  created () {
    // Listen to key events.
    window.addEventListener('keyup', (event) => {
      // Escape: 27
      if (event.which === 27) {
        this.closeSilentboxOverlay()
      }
      // Right arrow: 39
      if (event.which === 39) {
        this.moveToNextItem()
      }
      // Left arrow: 37
      if (event.which === 37) {
        this.moveToPreviousItem()
      }
    })

    // Disable browser scrolling.
    this.enableScrollLock()
  },
  methods: {
    /**
     * Registers the finger position on website so we can later calculate users
     * swipe direction.
     */
    touchStart (event) {
      const { clientX: x, clientY: y } = event.touches[0]
      this.touchHandling.posX = x
      this.touchHandling.posY = y
    },
    /**
     * Handles touch movement events, at the moment only swipe left and right
     * are supported, but later could be extended with up and down swipes.
     * It should be good to implement some kind of minimal swipe lenght support.
     */
    touchMove (event) {
      const { clientX: x, clientY: y } = event.touches[0]
      const { posX, posY } = this.touchHandling

      if (posX === 0 || posY === 0) {
        return
      }

      const xDiff = posX - x
      const yDiff = posY - y

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          // left
          this.moveToNextItem()
        } else {
          // right
          this.moveToPreviousItem()
        }
      } else {
        if (yDiff > 0) {
          // up
        } else {
          // down
          // this.closeSilentboxOverlay()
        }
      }

      // reset
      this.touchHandling.posX = 0
      this.touchHandling.posY = 0
    },
    /**
     * This method enables browser scrolling lock which prevent from horizontal
     * and vertical scrolling. This makes touch navigation less confusing.
     */
    enableScrollLock () {
      if (!document.body.classList.contains('silentbox-is-opened')) {
        return document.body.classList.add('silentbox-is-opened')
      }
    },
    /**
     * This method removes browser scrolling lock.
     */
    removeScrollLock () {
      if (document.body.classList.contains('silentbox-is-opened')) {
        return document.body.classList.remove('silentbox-is-opened')
      }
    },
    /**
     * Move to next item.
     */
    moveToNextItem () {
      this.animationName = 'silentbox-animation__swipe-left'
      this.$emit('requestNextSilentBoxItem')
    },
    /**
     * Move to previous item.
     */
    moveToPreviousItem () {
      this.animationName = 'silentbox-animation__swipe-right'
      this.$emit('requestPreviousSilentBoxItem')
    },
    /**
     * Hide silentbox overlay.
     */
    closeSilentboxOverlay () {
      this.removeScrollLock()
      this.$emit('closeSilentboxOverlay')
    },
    /**
     * Search for known video services URLs and return their players if recognized.
     * Unrecognized URLs are handled as images.
     *
     * @param  {string} url
     * @return {string}
     */
    handleUrl (url) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return this.parseYoutubeVideo(url)
      } else if (url.includes('vimeo')) {
        return this.parseVimeoVideo(url)
      }
      return url
    },
    /**
     * Get embed URL for youtube.com
     *
     * @param  {string} url
     * @return {string}
     */
    parseYoutubeVideo (url) {
      let videoUrl = ''
      const videoId = this.getYoutubeVideoId(url)

      if (videoId) {
        videoUrl = `${location.protocol}//www.youtube.com/embed/${videoId}?rel=0`

        if (this.overlayItem.autoplay) {
          videoUrl += '&autoplay=1'
        }
        if (!this.overlayItem.controls) {
          videoUrl += '&controls=0'
        }
      }

      return videoUrl
    },
    /**
     * Get embed URL for vimeo.com
     *
     * @param  {string} url
     * @return {string}
     */
    parseVimeoVideo (url) {
      let videoUrl = ''
      const vimoId = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(url)[3]

      if (vimoId !== undefined) {
        videoUrl = `${location.protocol}//player.vimeo.com/video/${vimoId}?rel=0`
        if (this.overlayItem.autoplay === 'autoplay') {
          videoUrl += '&autoplay=1'
        }
      }

      return videoUrl
    }
  }
}
</script>

<style lang="scss">
@mixin element($element) {
    &__#{$element} {
        @content;
    }
}

// Colours used in silentbox
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
