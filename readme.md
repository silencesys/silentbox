# Silentbox

A simple lightbox inspired component for Vue.js. If you're interested, you can visit [demo site](http://silentbox.silencesys.com/).

## Installation
### Npm
```
npm install --save vue-silentbox
```
Import the plugin into Vue:
```js
import Vue from 'vue'
import VueSilentbox from 'vue-silentbox'

Vue.use(VueSilentbox)
```

## Usage
In the template you can use "single" silentbox instance
```vue
<silentbox-single src="" autoplay="true" description="">Single item</silentbox-single>
```
or group instance which will make gallery.
```vue
<silentbox-group>
    <silentbox-item src="" autoplay="true" description="My very custom message">Item one</silentbox-item>
    <silentbox-item src="">Item two</silentbox-item>
    <silentbox-item src="">Item three</silentbox-item>
</silentbox-group>
```
As you can see, both of the variants share some attributes which could be filled.

| Attribute | Description |
|:------|:-----|
| src | media source, it could be an image or a youtube / Vimeo video |
| description | short description below image (doesn't work below videos yet) |
| autoplay | bool, to autoplay youtube / Vimeo video |
