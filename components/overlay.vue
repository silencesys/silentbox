<template>
    <section id="silentbox" v-if="isVisible">
        <div id="silentbox-overlay-background" @click.stop="closeSilentboxOverlay"></div>

        <button class="silentbox-close-overlay" @click.stop="closeSilentboxOverlay">
            <div class="silentbox-close-button"></div>
        </button>

        <div class="silentbox-navigation-arrows" v-if="this.$parent.items.total > 0">
            <div class="silentbox-arrow silentbox-arrow-previous" @click="this.$parent.prevItem"></div>
            <div class="silentbox-arrow silentbox-arrow-next" @click="this.$parent.nextItem"></div>
        </div>

        <div id="silentbox-embed-overlay">
            <iframe width="100%" height="100%" v-if="video" :src="getEmbedUrl" frameborder="0" allowfullscreen></iframe>
            <img width="auto" height="auto" :src="getEmbedUrl" v-if="! video">
            <p class="silentbox-embed-description" v-if="this.$parent.description">{{ this.$parent.description }}</p>
        </div>
    </section>
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

<style>
#silentbox {
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
}
#silentbox-embed-overlay {
    display: block;
    left: -35%;
    height: 80%;
    position: absolute;
    margin: 0 50%;
    text-align: center;
    vertical-align: middle;
    top: 10%;
    width: 70%;
}
#silentbox-embed-overlay img {
    max-width: 100%;
    max-height: 100%;
}
#silentbox-overlay-background {
        background: rgba(0, 0, 0, 0.65);
        cursor: default;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
}
.silentbox-item {
    cursor: pointer;
}
.silentbox-item:hover {
    text-decoration: underline;
}
.silentbox-embed-description {
    color: #fff;
}
.silentbox-close-overlay {
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
.silentbox-close-button {
    height: .75em;
    background: #fff;
    -webkit-mask-box-image: url('https://cdn.rawgit.com/silencesys/silentbox/f2e0bd0d/components/close-button.svg');
    margin: 0 auto;
    width: .75em;
}
.silentbox-close-overlay:hover {
    outline: none;
    background-color: rgba(0, 0, 0, .5);
}
.silentbox-close-overlay:hover .silentbox-close-button {
    background: #a6fcd4;
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