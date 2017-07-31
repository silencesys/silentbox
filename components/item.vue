<template>
    <span class="silentbox-item" :src="src" @click="openSilentBoxOverlay">
        <slot></slot>
    </span>
</template>

<script>
    export default {
        props: ['src', 'autoplay', 'description'],
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
                    position: this._uid - 2,
                    autoplay: this.autoplay,
                    description: this.description
                });
            }
        }
    }
</script>