<template>
    <section id="silentbox-group">
        <slot></slot>
        <silentbox-overlay></silentbox-overlay>
    </section>
</template>

<script>
    import overlay from './overlay.vue';

    export default {
        components: {'silentbox-overlay': overlay},
        data() {
            return {
                overlayVisibility: false,
                embedUrl: '',
                items: {
                    total: 0,
                    position: 0
                },
                autoplay: false,
                description: ''
            }
        },
        created() {
            this.$on('closeSilentboxOverlay', () => {
                this.overlayVisibility = false;
            });
            this.$on('openSilentboxOverlay', item => {
                this.embedUrl = item.url;
                this.items.position = item.position;
                this.overlayVisibility = true;
                this.autoplay = item.autoplay;
                this.description = item.description;
            });

            window.addEventListener('keyup', (event) => {
                if (event.which === 27) {
                    this.overlayVisibility = false;
                }
                if (event.which === 39) {
                    this.nextItem();
                }
                if (event.which === 37) {
                    this.prevItem();
                }
            });
        },
        methods: {
            // Open next item in the queue
            nextItem() {
                let item = this.$children[this.items.position + 1].$options._componentTag;

                if (this.items.position !== (this.items.total - 1)) {
                    this.items.position++;
                } else {
                    this.items.position = 0;
                }

                this.embedUrl = this.$children[this.items.position].src;

                this.autoplay = (this.$children[this.items.position].autoplay !== undefined)
                    ? this.$children[this.items.position].autoplay : false;

                this.description = (this.$children[this.items.position].description !== undefined)
                    ? this.$children[this.items.position].description : false;
            },
            // Open previous item in the queue
            prevItem() {
                let item = this.$children[this.items.position].$options._componentTag;

                if (this.items.position !== 0) {
                    this.items.position--;
                } else {
                    this.items.position = this.items.total - 1;
                }

                this.embedUrl = this.$children[this.items.position].src;

                this.autoplay = (this.$children[this.items.position].autoplay !== undefined)
                    ? this.$children[this.items.position].autoplay : false;

                this.description = (this.$children[this.items.position].description !== undefined)
                    ? this.$children[this.items.position].description : false;
            }
        },
        mounted() {
            // When our vue component is loaded, we need to get count of silentbox-items
            this.items.total = 0;

            for (let i = 0; i < this.$children.length; i++) {
                if (this.$children[i].$options._componentTag === 'silentbox-item') {
                    this.items.total++;
                }
            }
        }
    }
</script>