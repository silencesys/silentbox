![Silentbox](https://silentbox.silencesys.com/images/logo-01.png) 

<div style="text-align: center;">

[![GitHub issues](https://img.shields.io/github/stars/silencesys/silentbox.svg?color=08AEEA&labelColor=169DC1&style=flat-square)](https://github.com/silencesys/silentbox/issues)
[![GitHub stars](https://img.shields.io/github/issues/silencesys/silentbox.svg?style=flat-square&labelColor=25ADA3&color=4CC1B8)](https://github.com/silencesys/silentbox/stargazers)
[![GitHub license](https://img.shields.io/github/license/silencesys/silentbox.svg?color=2AC47A&labelColor=389367&style=flat-square)](https://github.com/silencesys/silentbox/blob/master/license.md)

<br>

A simple lightbox inspired component for Vue.js. If you're interested, you can visit [demo site](http://silentbox.silencesys.com/).

</div>

<br>
<br>




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
    <silentbox-item src=""></silentbox-item> <!-- Vimeo/Youtube preview or src will be used as thumbnail -->
</silentbox-group>
```
As you can see, both of the variants share some attributes which could be filled. 
Furthemore you can embed vimeo and youtube videos as src. If you leave tags without setting the slot
youtube/vimeo thumbnail will be used.

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| src | yes | string |media source, it could be an image or a youtube / Vimeo video |
| description | no | string | short description below image (doesn't work below videos yet) |
| autoplay | no | bool| to autoplay youtube / Vimeo video |
| thumbnail-height | no | string | height of the thumbnail in px |
| thumbnail-width | no | string | width of the thumbnail in px |
