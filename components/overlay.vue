<template>
    <div id="silentbox-overlay" v-if="isVisible">
        <div id="silentbox-overlay__background" @click.stop="closeSilentboxOverlay"></div>

        <div id="silentbox-overlay__content" @click.stop="closeSilentboxOverlay">
            <div id="silentbox-overlay__embed">
                <div id="silentbox-overlay__container">
                    <iframe width="100%" height="100%" v-if="youtubeVideo" :src="getEmbedUrl" frameborder="0" allowfullscreen></iframe>
                    <img class="silentbox-overlay__image" width="auto" height="auto" :src="getEmbedUrl" v-if="image">
                    <video width="70%" height="auto" :src="getEmbedUrl" v-if="video" controls></video>
                </div>
                <p id="silentbox-overlay__description" v-if="this.$parent.description">{{ this.$parent.description }}</p>
            </div>
        </div>

        <div id="silentbox-overlay__close-button" role="button" tabindex="3" @click.stop="closeSilentboxOverlay" @keyup.enter="closeSilentboxOverlay">
            <div class="icon"></div>
        </div>

        <div id="silentbox-overlay__arrow-buttons" v-if="this.$parent.items.total > 0">
            <div class="arrow arrow-previous" role="button" tabindex="2" @click="moveToPreviousItem" @keyup.enter="moveToPreviousItem"></div>
            <div class="arrow arrow-next" role="button" tabindex="1" @click="moveToNextItem" @keyup.enter="moveToNextItem"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SilentboxOverlay',
        computed: {
            youtubeVideo() {
                return this.$parent.embedUrl.includes('youtube.com');
            },
            image() {
                return !this.youtubeVideo && !this.video;
            },
            video() {
                return (/\.(mp4|avi|mkv|wmv|mov|flv)/igm).test(this.$parent.embedUrl.toLowerCase());
            },
            getEmbedUrl() {
                return this.handleUrl(this.$parent.embedUrl);
            },
            isVisible() {
                if (this.$parent.overlayVisibility !== undefined && this.$parent.overlayVisibility !== false) {
                    return true;
                }

                return false;
            }
        },
        methods: {
            moveToNextItem() {
                this.$parent.nextItem();
            },
            moveToPreviousItem()
            {
                this.$parent.prevItem();
            },
            closeSilentboxOverlay() {
                this.$parent.$emit('closeSilentboxOverlay');
            },
            handleUrl(url) {
                if (url.includes('youtube.com')) {

                    let videoIdPosition  = url.indexOf('v=') + 2;
                    let videoId = url.substring(videoIdPosition);

                    let videoUrl = 'https://www.youtube.com/embed/' + videoId;

                    if (this.$parent.autoplay) {
                        videoUrl += '?autoplay=1';
                    }

                    return videoUrl;
                } else {
                    return url;
                }
            }
        },
        beforeUpdate() {
            let body = document.body;

            // add class only if overlay should be visible
            if (this.isVisible && ! body.classList.contains('silentbox-is-opened')) {
                return body.classList.add('silentbox-is-opened');
            }

            // remove class only if overlay should be hidden
            if (! this.isVisible && body.classList.contains('silentbox-is-opened')) {
                return body.classList.remove('silentbox-is-opened')
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
        cursor: default;
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    @include element(image) {
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
			linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%),
			linear-gradient(-45deg, transparent 75%, #808080 75%);

		background-size: 20px 20px;
		background-position: 0 0, 10px 0, 10px -10px, 0px 10px;
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
        margin: 0 0 1.5rem 0;
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