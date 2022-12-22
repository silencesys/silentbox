<p align="center">
<img src="https://silentbox.rocek.dev/images/silentbox-v3.png" alt="SilentBox 3.0 a lightbox vue.js component"/>
</p>

<p align="center">
<a href="https://github.com/silencesys/silentbox/stargazers"><img src="https://img.shields.io/github/stars/silencesys/silentbox.svg?color=08AEEA&labelColor=169DC1&style=flat-square" alt="Github Stars"></a> <a href="https://github.com/silencesys/silentbox/issues"><img src="https://img.shields.io/github/issues/silencesys/silentbox.svg?style=flat-square&labelColor=25ADA3&color=4CC1B8" alt="Github Issues"></a> <a href="https://github.com/silencesys/silentbox/blob/master/license.md"><img src="https://img.shields.io/github/license/silencesys/silentbox.svg?color=2AC47A&labelColor=389367&style=flat-square" alt="License"></a> <img src="https://img.shields.io/github/workflow/status/silencesys/silentbox/Node.js CI?color=27EDA0&labelColor=25CE89&style=flat-square">
</p>
<br>
<p align="center">
A third version of the lightweight lightbox inspired component for Vue.js with local video support and more features coming. If you're interested, see <a href="https://silentbox.silencesys.com">demo</a>.
</p>

<br>

<br>

## Supported formats and services
- All image formats that can be displayed in browser
- Local video files with following extensions .mp4, .ogg, .webm, .mov, .flv, .wmv, .mkv
- YouTube and Vimeo embed videos with autoplay

<br>

## Installation
### Npm
```
npm install --save vue-silentbox
```
Import the plugin into Vue:
```js
import { createApp } from 'vue'
import VueSilentbox from 'vue-silentbox'
import 'vue-silentbox/dist/style.css'

createApp({
    // your app props ...
})
.use(VueSilentbox)
.mount('#root')
```

<br>

## How to use?
Define an array of images in the data object of your Vue instance or component.
```js
import { createApp } from 'vue'
import VueSilentbox from 'vue-silentbox'
import 'vue-silentbox/dist/style.css'

createApp({
    data: {
        images: [
            {
                src: 'images/image001.jpg',
                srcSet: '/images/image001-640.jpg 640w,/images/image001-1280.jpg 1280w,/images/image001-1920.jpg 1920w',
                description: 'Sunken dreams II. by Arbebuk',
            },
            {
                src: 'images/image002.jpg',
                srcSet: '/images/image002-640.jpg 640w,/images/image002-1280.jpg 1280w,/images/image003-1920.jpg 1920w',
                description: 'Tunnel View Sunrise by Porbital',
            }
        ]
    },
})
.use(VueSilentbox)
.mount('#root')
```

Then in the template you use a `silent-box` component to display the gallery.

```vue
<silent-box :gallery="images"><!-- your additional content --></silent-box>
```
Or you can show a single image by just renaming the property.
```vue
<silent-box :image="images[0]"><!-- your additional content --></silent-box>
```


### Custom activators

In case you don't like the default image previews that SilentBox provides, you can
set your own activators - text, button or even a video! SilentBox provides a named slot for this - `silentbox-item`. The slot provides variable called `silentboxItem` which
provides you access to all properties you set on image object.

```html
<!--
In this example only alt text is displayed as an activator.
-->
<silent-box :gallery="images">
    <h2 class="tw-text-3xl tw-font-bold tw-mb-2">Gallery</h2>
    <p class="tw-font-light tw-mb-3">
        Items could be merged into groups that make galleries.
    </p>
    <template v-slot:silentbox-item="{ silentboxItem }">
        <p>{{ silentboxItem.alt  }}</p>
    </template>
</silent-box>
```

### Image object attributes

You can set the following attributes to the image object to change the behaviour
of the SilentBox or display additional information. On the other hand, if you're
lazy, only the `src` attribute is required.

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| src | yes | string | media source, it could be an image, video or a YouTube / Vimeo embed link |
| srcSet | no | string | srcSet to make use of [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) |
| thumbnail | no | string | image used for thumbnail |
| thumbnailHeight | no | string | height of the thumbnail in px |
| thumbnailWidth | no | string | width of the thumbnail in px |
| description | no | string | short description below image (doesn't work below videos yet) |
| alt | no | string | alt description for images |
| autoplay | no | bool| to autoplay youtube / Vimeo video |
| controls | no | bool | **does not work for Vimeo**, setting false will hide video controls |

### Gallery element attributes

These attributes can change the gallery element behaviour.

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| gallery | no | array | list of image objects that will be displayed in the gallery |
| image | no | object | image object that will be displayed in the gallery |
| lazy-loading | no | bool | whether images should be lazy loaded |
| preview-count | no | number | number of images that should be displayed in the gallery |

### Events
SilentBox also fires several events that can be further used in your Vue.js application. Each event has a payload that contains the
`item` object which holds information about the currently displayed item.
| Event name | When is event fired |
|:------| :------ |
| `silentbox-overlay-opened` | when the overlay is opened |
| `silentbox-overlay-hidden` | when the overlay is closed (button or ESC key) |
| `silentbox-overlay-next-item-displayed` | when the user moves to the next picture (arrow or key) |
| `silentbox-overlay-prev-item-displayed` | when the user moves to the previous picture (arrow or key) |

### Open overlay programatically
SilentBox provides two options how to open the overlay programatically. If you need to open an existing gallery, the best option
is to use the `ref` attribute and then call the method `openOverlay` on the `$refs` object in your method. See example:
```html
<silent-box ref="silentbox" :gallery="images"></silent-box>
```
and then the method `openOverlay` can be called from your method:
```javascript
// ...
methods: {
    // the index parameter is optional, however it should be set if you're opening
    // the overlay on different position than the beginning of the gallery
    openOverlayProgramaticallyWithContext (item, index = 0) {
        this.$refs.silentbox.openOverlay(item, index)
    }
}
// ...
```

However, in case you just want to open an item without any context, it might be a better choice to call the global `open`
method that SilentBox provides.
```javascript
// ...
methods: {
    openOverlayProgramaticallyWithoutContext (item) {
        this.$silentbox.open(item)
    }
}
// ...
```

<br>


## Upgrading from 2.x to 3.x?
Almost all APIs remained same except two things:
- Vue3 always transforms `<img />` width and height to numbers, thus properties `thumbnailWidth` and `thumbnailHeight` should always be a number
- event fired when user navigates to previous image was renamed to `silentbox-overlay-prev-item-displayed` from `silentbox-overlay-previous-item-displayed`

<br>

## Upgrading from 0.1?
Version 2 brought many breaking changes. There are no more two separate components
to display a single image or gallery. So, change all your `silentbox-group` and `silentbox-single` components to `silent-box`.
The source of images must be an array of objects or a single object with previously mentioned attributes.

<br>

## Contributions

All contributions are welcomed, however give me some time to review your requests. Please, use emoji in your commits, so it is easier to identify what your commits do.
There are several _emoji guides_ on the internet. Please stick with mine which is inspired by Atom contributing guidelines, see [emoji in commits](https://gist.github.com/silencesys/2ede032fe31fed95434aff10d29cabbf).
