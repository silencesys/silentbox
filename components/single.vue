<template>
    <span class="silentbox-single" :src="src" @click="openSilentBoxOverlay">
        <slot>
            <img :src="getThumnail(src)" :width="thumbnailWidth" :height="thumbnailHeight">
        </slot>
        <silentbox-overlay></silentbox-overlay>
    </span>
</template>

<script>
    import SilentboxItem from './item.vue';
    import SilentboxOverlay from './overlay.vue';
    import ItemMixin from './../mixins/item';

    export default {
        name: 'SilentboxSingle',
        mixins: [ ItemMixin ],
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
            'description': String,
            'thumbnailWidth': {
                type: String,
                default: '200px'
            },
            'thumbnailHeight': {
                type: String,
                default: '150px'
            }
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
        methods: {
            /**
             * Hide the Silenbotx overlay.
             * 
             * @return {void}
             */
            closeSilentBoxOverlay() {
                this.overlayVisibility = false;
            },
            /**
             * Open Silentbox with given media.
             * 
             * @return {void}
             */
            openSilentBoxOverlay() {
                if (this.src !== null) {
                    this.embedUrl = this.src;
                }
                this.overlayVisibility = true;
            }
        },
        components: {
            SilentboxOverlay,
            SilentboxItem
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