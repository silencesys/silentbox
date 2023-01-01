# CHANGELOG
Here you can find the changelog of the SilentBox plugin.

## 3.0.3
- Added support for non-interactive Twitch video embeds. However, thumbnails are not supported as Twitch requires an API key to get the thumbnail, so you need to set your own thumbnail via the `thumbnail` option.
- Fixed bug where clicking on image or video would close the overlay.
- Added support for downloading images and videos.

## 3.0.0-alpha.1
- Updated to Vue 3
- renamed `silentbox-overlay-previous-item-displayed` to `silentbox-overlay-prev-item-displayed`
- rewritten in composition API
- new tests added
- fully rewritten in TypeScript