# CHANGELOG
Here you can find the changelog of the SilentBox plugin.

## [3.0.4]
### Removed
- unnecessary folders from the published package

## [3.0.3]
### Added
- Added support for non-interactive Twitch video embeds. However, thumbnails are not supported as Twitch requires an API key to get the thumbnail, so you need to set your own thumbnail via the `thumbnail` option.
- Added support for downloading images and videos.
### Fixed
- Fixed bug where clicking on image or video would close the overlay.

## [3.0.0-alpha.1]
### Added
- new tests added
### Changed
- Updated to Vue 3
- renamed `silentbox-overlay-previous-item-displayed` to `silentbox-overlay-prev-item-displayed`
- rewritten in composition API
- fully rewritten in TypeScript