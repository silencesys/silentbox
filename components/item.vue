<template>
    <span class="silentbox-item" :src="src" @click="openSilentBoxOverlay">
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: 'SilentboxItem',
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
        computed: {
            embedUrl() {
                if (this.src !== null) {
                    return this.src;
                }

                return null;
            }
        },
        methods: {
            closeSilentBoxOverlay() {
                this.$parent.$emit('closeSilentboxOverlay');
            },
            openSilentBoxOverlay() {
                this.$parent.$emit('openSilentboxOverlay', {
                    url: this.embedUrl,
                    position: this.$parent.position,
                    autoplay: this.autoplay,
                    description: this.description
                });
            }
        }
    }
</script>

<style lang="scss">
    .silentbox-item {
        cursor: pointer;
        text-decoration: underline;
    }
</style>