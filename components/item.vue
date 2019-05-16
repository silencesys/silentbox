<template>
    <span class="silentbox-item" :src="src" @click="openSilentBoxOverlay">
        <slot>
            <img :src="getThumnail(src)" :width="thumbnailWidth" :height="thumbnailHeight" />
        </slot>
    </span>
</template>

<script>
    import ItemMixin from './../mixins/item';

    export default {
        name: 'SilentboxItem',
        mixins: [ ItemMixin ],
        props: {
            // Media source, it could be an image or a youtube video.
            'src': {
                type: String,
                required: true
            },
            // True if video should be autoplayed.
            'autoplay': {
                type: Boolean,
                default() {
                    return false;
                }
            },
            // Short description below image.
            'description': String,
            'position': {},
            'thumbnailWidth': {
                type: String,
                default: '200px'
            },
            'thumbnailHeight': {
                type: String,
                default: '150px'
            }
        },
        computed: {
            /**
             * Get embed URL.
             * @return {string|null}
             */
            embedUrl() {
                if (this.src !== null) {
                    return this.src;
                }

                return null;
            }
        },
        methods: {
            /**
             * Emit an event that overlay should be hidden.
             *
             * @return {void}
             */
            closeSilentBoxOverlay() {
                this.$parent.$emit('closeSilentboxOverlay');
            },
            /**
             * Emit an event that overlay should be opened.
             *
             * @return {void}
             */
            openSilentBoxOverlay() {
                let itemIndex = this.$parent.items.list.findIndex(item => item.src === this.src);

                this.$parent.$emit('openSilentboxOverlay', {
                    url: this.embedUrl,
                    position: itemIndex,
                    autoplay: this.autoplay,
                    description: this.description
                });
            }
        },
        created() {
            // Push items to the parent component.
            // TODO: do it in parent component
            this.$parent.items.list.push({
                src: this.src,
                autoplay: this.autoplay,
                desc: this.description,
                position: this.position
            });
        }
    }
</script>

<style lang="scss">
    .silentbox-item {
        cursor: pointer;
        text-decoration: underline;
    }
</style>