<template>
    <span class="silentbox-single" :src="src" @click="openSilentBoxOverlay">
        <slot></slot>
        <silentbox-overlay></silentbox-overlay>
    </span>
</template>

<script>
    import overlay from './overlay.vue';

    export default {
        props: ['src', 'autoplay', 'description'],
        components: {'silentbox-overlay': overlay},
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