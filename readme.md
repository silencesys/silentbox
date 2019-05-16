<img src="https://silentbox.silencesys.com/images/logo-02.png" alt="SilentBox a lightbox vue.js component"/>

<p align="center">
<a href="https://github.com/silencesys/silentbox/stargazers"><img src="https://img.shields.io/github/stars/silencesys/silentbox.svg?color=08AEEA&labelColor=169DC1&style=flat-square" alt="Github Stars"></a> <a href="https://github.com/silencesys/silentbox/issues"><img src="https://img.shields.io/github/issues/silencesys/silentbox.svg?style=flat-square&labelColor=25ADA3&color=4CC1B8" alt="Github Issues"></a> <a href="https://github.com/silencesys/silentbox/blob/master/license.md"><img src="https://img.shields.io/github/license/silencesys/silentbox.svg?color=2AC47A&labelColor=389367&style=flat-square" alt="License"></a>
</p>
<br>
<p align="center">
A simple lightbox inspired component for Vue.js. If you're interested, see <a href="https://silentbox.silencesys.com">demo</a>.
</p>

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

<br>

## How to use?
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
Both `silentbox-item` and `silentbox-single` share the same attributes that could set. Furthermore, both
elements accept viemo and youtube video links as source. If you don't specify the preview image, youtube or vimeo  
thumbnail will be used instead.

### Supported attributes 

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| src | yes | string |media source, it could be an image or a youtube / Vimeo video |
| description | no | string | short description below image (doesn't work below videos yet) |
| autoplay | no | bool| to autoplay youtube / Vimeo video |
| thumbnail-height | no | string | height of the thumbnail in px |
| thumbnail-width | no | string | width of the thumbnail in px |
| hide-controls | no | bool | **works only for youtube videos**, setting true will hide video controls |

<br>

## Contributions

All contributions are welcomed, however give me some time to review your requests. Also please, use emoji in your commits, so it is easier to identify what your commits do. 
There are several _emoji guides_ on internet. Please stick with mine which is inspired by Atom contributing guidelines, see [emoji in commits](https://gist.github.com/silencesys/2ede032fe31fed95434aff10d29cabbf).