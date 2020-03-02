<img src="https://silentbox.silencesys.com/images/logo-02.png" alt="SilentBox 2.0 a lightbox vue.js component"/>

<p align="center">
<a href="https://github.com/silencesys/silentbox/stargazers"><img src="https://img.shields.io/github/stars/silencesys/silentbox.svg?color=08AEEA&labelColor=169DC1&style=flat-square" alt="Github Stars"></a> <a href="https://github.com/silencesys/silentbox/issues"><img src="https://img.shields.io/github/issues/silencesys/silentbox.svg?style=flat-square&labelColor=25ADA3&color=4CC1B8" alt="Github Issues"></a> <a href="https://github.com/silencesys/silentbox/blob/master/license.md"><img src="https://img.shields.io/github/license/silencesys/silentbox.svg?color=2AC47A&labelColor=389367&style=flat-square" alt="License"></a> <img src="https://img.shields.io/github/workflow/status/silencesys/silentbox/Node.js CI?color=27EDA0&labelColor=25CE89&style=flat-square">
</p>
<br>
<p align="center">
A second version of the lightweight lightbox inspired component for Vue.js with local video support and more comming. If you're interested, see <a href="https://silentbox.silencesys.com">demo</a>.
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
Define an array of images in the data object of your Vue instance or component. 
```js
const app = new Vue({
    el: '#application',
    data: {
        images: [
            {
                src: 'images/image001.jpg',
                description: 'Sunken dreams II. by Arbebuk',
            },
            {
                src: 'images/image002.jpg',
                description: 'Tunnel View Sunrise by Porbital',
            }
        ]
    },
})
```

Then in the template you can use a `silent-box` component to display gallery.

```vue
<silent-box :gallery="images"><!-- your additional content --></silentbox-single>
```
or to show single image by just renaming the property.
```vue
<silent-box :image="images[0]"><!-- your additional content --></silentbox-single>
```

### Image object attributes 

You can set following attributes to the image object to change the behaviour
of the SilentBox or display additional information. On the other hand, if you're 
lazy, only `src` attribute is required.

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| src | yes | string | media source, it could be an image or a youtube / Vimeo video |
| thumbnail | no | string | image used for thumbnail |
| thumbnailHeight | no | string | height of the thumbnail in px |
| thumbnailWidth | no | string | width of the thumbnail in px |
| description | no | string | short description below image (doesn't work below videos yet) |
| alt | no | string | alt description for images |
| autoplay | no | bool| to autoplay youtube / Vimeo video |
| controls | no | bool | **works only for youtube videos**, setting false will hide video controls |

### Supported services and formats
- All image formats that can be displayed in browser 
- Local video files with following extensions .mp4, .ogg, .webm, .mov, .flv, .wmv, .mkv 
- YouTube and Viemo embed videos with autoplay 

<br>

## Upgrading from 0.1?
Version 2 brought many breaking changes. There are no more two separate components
to display single image or gallery. So, change all your `silentbox-group` and `silentbox-single` components to `silent-box`.
Source of images must be an array of objects or single object with previously mentioned attributes.

<br>

## Contributions

All contributions are welcomed, however give me some time to review your requests. Also please, use emoji in your commits, so it is easier to identify what your commits do. 
There are several _emoji guides_ on internet. Please stick with mine which is inspired by Atom contributing guidelines, see [emoji in commits](https://gist.github.com/silencesys/2ede032fe31fed95434aff10d29cabbf).