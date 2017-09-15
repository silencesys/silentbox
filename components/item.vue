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
            // True if video should be autoplayed.
            'autoplay': {
                type: Boolean,
                default() {
                    return false;
                }
            },
            // Short description below image.
            'description': String,
            'position': {}
        },
        computed: {
            embedUrl() {
                if (this.src !== null) {
                    return this.src;
                }

                return null;
            }
        },
        created() {
            this.$parent.items.list.push(this.src);
        },
        methods: {
            closeSilentBoxOverlay() {
                this.$parent.$emit('closeSilentboxOverlay');
            },
            openSilentBoxOverlay() {
                this.$parent.$emit('openSilentboxOverlay', {
                    url: this.embedUrl,
                    position: this.$parent.items.list.indexOf(this.src),
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