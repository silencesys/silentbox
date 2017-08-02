<template>
    <div id="silentbox-overlay" v-if="isVisible">
        <div id="silentbox-overlay-background" @click.stop="closeSilentboxOverlay"></div>

        <div id="silentbox-overlay-content" @click.stop="closeSilentboxOverlay">
            <div id="silentbox-overlay-embed">
                <div id="silentbox-image-container">
                    <iframe width="100%" height="100%" v-if="video" :src="getEmbedUrl" frameborder="0" allowfullscreen></iframe>
                    <img width="auto" height="auto" :src="getEmbedUrl" v-if="! video">
                </div>
                <p class="silentbox-overlay-embed-description" v-if="this.$parent.description">{{ this.$parent.description }}</p>
            </div>
        </div>

        <button class="silentbox-overlay-close" @click.stop="closeSilentboxOverlay">
            <div class="silentbox-overlay-close-icon"></div>
        </button>
        <div class="silentbox-arrows" v-if="this.$parent.items.total > 0">
            <div class="silentbox-arrow silentbox-arrow-previous" @click="this.$parent.prevItem"></div>
            <div class="silentbox-arrow silentbox-arrow-next" @click="this.$parent.nextItem"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                video: false
            }
        },
        computed: {
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
            closeSilentboxOverlay() {
                this.$parent.$emit('closeSilentboxOverlay');
            },
            handleUrl(url) {
                if (url.includes('youtube.com')) {
                    this.video = true;

                    let videoIdPosition  = url.indexOf('v=') + 2;
                    let videoId = url.substring(videoIdPosition);

                    let videoUrl = 'https://www.youtube.com/embed/' + videoId;

                    if (this.$parent.autoplay) {
                        videoUrl += '?autoplay=1';
                    }

                    return videoUrl;
                } else {
                    this.video = false;

                    return url;
                }
            }
        }
    }
</script>

<style lang="scss">
#silentbox-overlay {
    display: block;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
}
#silentbox-overlay-background {
    background: rgba(0, 0, 0, 0.75);
    cursor: default;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
#silentbox-overlay-content {
    display: block;
    height: 100%;
    width: 100%;
    position: relative;
}
#silentbox-overlay-navigation {
    display: block;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    position: relative;
}
#silentbox-overlay-embed {
    cursor: default;
    height: 80%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    margin: auto;
    width: 70%;
}
#silentbox-image-container {
    cursor: default;
    min-height: 100%;
    text-align: center;
    position: relative;
    min-width: 100%;
}
#silentbox-image-container img,
iframe {
    cursor: default;
    box-shadow: 0 0 1.5em RGBA(0, 0, 0, .25);
    max-height: 100%;
    max-width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    margin: auto;
}
.silentbox-item,
.silentbox-single {
    cursor: pointer;
}
.silentbox-item:hover {
    text-decoration: underline;
}
p.silentbox-overlay-embed-description {
    display: block;
    padding-top: 1em;
    text-align: center;
    color: #fff;
}
.silentbox-overlay-close {
    background: rgba(0, 0, 0, .0);
    border: none;
    color: #fff;
    cursor: pointer;
    height: 2.5em;
    position: absolute;
    right: 0;
    top: 0;
    width: 2.5em;
}
.silentbox-overlay-close-icon {
    color: #fff;
    cursor: pointer;
    left: .7em;
    height: 1em;
    width: 1em;
    right: 0px;
    top: -.5em;
    margin: 50% 50% 0 0;
    position: absolute;
    transition: 250ms ease;

    &:before,
    &:after {
        content: "";
        height: 2px;
        background: #fff;
        width: 100%;
        top: 50%;
        left: 5%;
        position: absolute;
        transition: 250ms ease;
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
            width: 50%;
            left: 25%;
        }
    }
}
.silentbox-overlay-close:hover {
    outline: none;
    background-color: rgba(0, 0, 0, .5);
}
.silentbox-arrow {
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    cursor: pointer;
    height: 50px;
    position: absolute;
    width: 50px;
}
.silentbox-arrow:hover {
    border-color: #a6fcd4;
}
.silentbox-arrow-previous {
    left: 2%;
    top: 50%;
    transform: rotate(-45deg);
}
.silentbox-arrow-previous:hover {
    animation-name: pulsingPrevious;
    animation-duration: 1s;
    animation-iteration-count: infinite;
}
.silentbox-arrow-next {
    right: 2%;
    top: 50%;
    transform: rotate(135deg);
}
.silentbox-arrow-next:hover {
    animation-name: pulsingNext;
    animation-duration: 1s;
    animation-iteration-count: infinite;
}
@keyframes pulsingNext {
    0%   {
        animation-timing-function: ease-in-out;
        right: 2%;
    }
    25%  {
        animation-timing-function: ease-in-out;
        right: 1.5%;
    }
    75%  {
        animation-timing-function: ease-in-out;
        right: 2.5%;
    }
    100% {
        animation-timing-function: ease-in-out;
        right: 2%;
    }
}
@keyframes pulsingPrevious {
    0%   {
        animation-timing-function: ease-in-out;
        left: 2%;
    }
    25%  {
        animation-timing-function: ease-in-out;
        left: 1.5%;
    }
    75%  {
        animation-timing-function: ease-in-out;
        left: 2.5%;
    }
    100% {
        animation-timing-function: ease-in-out;
        left: 2%;
    }
}
</style>