<template>
    <span class="silentbox-single" :src="src" @click="openSilentBoxOverlay">
        <slot></slot>
        <silentbox-overlay></silentbox-overlay>
    </span>
</template>

<script>
    import overlay from './overlay.vue';

    export default {
        name: 'SilentboxSingle',
        props: {
            // Media source, it could be an image or a youtube video.
            'src': {
                type: String,
                required: true
            },
            // Should be video autoplayed.
            'autoplay': {
                type: Boolean,
                default() {
                    return false;
                }
            },
            // Short description below image.
            'description': String
        },
        data() {
            return {
                overlayVisibility: false,
                embedUrl: undefined,
                items: {
                    total: 0,
                    position: 0
                }
            }
        },
        components: {
            'silentbox-overlay': overlay
        },
        methods: {
            closeSilentBoxOverlay() {
                this.overlayVisibility = false;
            },
            openSilentBoxOverlay() {
                if (this.src !== null) {
                    this.embedUrl = this.src;
                }
                this.overlayVisibility = true;
            }
        },
        mounted() {
            this.$on('closeSilentboxOverlay', () => {
                this.overlayVisibility = false;
            });

            window.addEventListener('keyup', (event) => {
                if (event.which == 27) {
                    this.overlayVisibility = false;
                }
            });
        }
    }
</script>

<style lang="scss">
    .silentbox-single {
        cursor: pointer;
        text-decoration: underline;
    }
</style>