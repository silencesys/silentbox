<template>
  <span class="silentbox-item" :src="src" @click="openSilentBoxOverlay">
    <slot>
      <img :src="getThumnail(src)" :width="thumbnailWidth" :height="thumbnailHeight" />
    </slot>
    <div v-if="removeable" class="remove-icon" @click.stop="removeIconClick"></div>
  </span>
</template>

<script>
import ItemMixin from "./../mixins/item";

export default {
  name: "SilentboxItem",
  mixins: [ItemMixin],
  props: {
    // Media source, it could be an image or a youtube video.
    src: {
      type: String,
      required: true
    },
    // True if video should be autoplayed.
    autoplay: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // Short description below image.
    description: String,
    position: {},
    thumbnailWidth: {
      type: String,
      default: "200px"
    },
    thumbnailHeight: {
      type: String,
      default: "150px"
    },
    // Hide player controls
    hideControls: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // Remove icon controls
    removeable: {
      type: Boolean,
      default() {
        return false;
      }
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
     * Emit an event when click remove icon.
     *
     * @return {void}
     */
    removeIconClick() {
      this.$emit("removeIconClicked");
    },
    /**
     * Emit an event that overlay should be hidden.
     *
     * @return {void}
     */
    closeSilentBoxOverlay() {
      this.$parent.$emit("closeSilentboxOverlay");
    },
    /**
     * Emit an event that overlay should be opened.
     *
     * @return {void}
     */
    openSilentBoxOverlay() {
      let itemIndex = this.$parent.items.list.findIndex(
        item => item.src === this.src
      );

      this.$parent.$emit("openSilentboxOverlay", {
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
};
</script>

<style lang="scss">
$icon-color: white;
$accent: red;
.silentbox-item {
  position: relative;
  cursor: pointer;
  text-decoration: underline;
  vertical-align: top;

  .remove-icon {
    color: $icon-color;
    cursor: pointer;
    height: 1rem;
    position: absolute;
    right: 2px;
    top: 0px;
    transition: 250ms ease;
    width: 1rem;
    &:before,
    &:after {
      background: $icon-color;
      content: "";
      height: 2px;
      left: 5%;
      position: absolute;
      top: 50%;
      transition: 250ms ease;
      width: 100%;
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
        background: $accent;
      }
    }
  }
}
</style>