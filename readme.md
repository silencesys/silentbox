# Silentbox

A simple lightbox inspired component for Vue.js.

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
In the template you could use "single" silentbox instance
```vue
<silentbox-single src="" autoplay="true" description="">Single item</silentbox-single>
```
or group instance which allows loop through items inside it.
```vue
<silentbox-group>
    <silentbox-item src="" autoplay="true" description="My very custom message">Item one</silentbox-item>
    <silentbox-item src="">Item two</silentbox-item>
    <silentbox-item src="">Item three</silentbox-item>
</silentbox-group>
```
As you can see, both of the variants share some attributes which chould be filled.

| Attribute | Description |
|:------|:-----|
| src | This attribute is source file or link which will be displayed inside Silentbox |
| autoplay | If you embed youtube videos, there could be set if they should be autoplayed |
| description | Short description below the image/video |