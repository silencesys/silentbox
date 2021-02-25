var VideoUrlDecoderMixin = {
  methods: {
    getYoutubeVideoId(url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match !== undefined && match[7] !== undefined ? match[7] : false;
    },

    getVimeoVideoId(url) {
      return /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(url)[3];
    }

  }
};

var itemMixin = {
  mixins: [VideoUrlDecoderMixin],
  methods: {
    isEmbedVideo(itemSrc) {
      const supportedVideoServices = ['youtube.com', 'youtu.be', 'vimeo.com'];
      return supportedVideoServices.some(service => {
        return itemSrc.includes(service);
      });
    },

    isLocalVideo(itemSrc) {
      const supportedVideoServices = ['.mp4', '.ogg', '.webm', '.mov', '.flv', '.wmv', '.mkv'];
      return supportedVideoServices.some(service => {
        return itemSrc.includes(service);
      });
    },

    getThumbnail(src) {
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = this.getYoutubeVideoId(src);
        return `${location.protocol}//img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } else if (src.includes('vimeo.com')) {
        const videoId = this.getVimeoVideoId(src);
        const videoDetails = this.httpGet(`${location.protocol}//vimeo.com/api/v2/video/${videoId}.json`);
        return videoDetails[0].thumbnail_medium;
      } else {
        return src;
      }
    },

    httpGet(url) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', url, false);
      xmlHttp.send(null);
      return JSON.parse(xmlHttp.responseText);
    }

  }
};

//
var script = {
  name: 'SilentboxOverlay',
  mixins: [itemMixin],
  props: {
    overlayItem: {
      type: Object,
      default: () => {
        return {
          src: '',
          srcSet: '',
          description: ''
        };
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    totalItems: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      touchHandling: {
        posX: 0,
        posY: 0
      },
      animationName: 'silentbox-animation__swipe-left'
    };
  },

  created() {
    // Listen to key events.
    window.addEventListener('keyup', event => {
      // Escape: 27
      if (event.which === 27) {
        this.closeSilentboxOverlay();
      } // Right arrow: 39


      if (event.which === 39) {
        this.moveToNextItem();
      } // Left arrow: 37


      if (event.which === 37) {
        this.moveToPreviousItem();
      }
    }); // Disable browser scrolling.

    this.enableScrollLock();
  },

  methods: {
    /**
     * Registers the finger position on website so we can later calculate users
     * swipe direction.
     */
    touchStart(event) {
      const {
        clientX: x,
        clientY: y
      } = event.touches[0];
      this.touchHandling.posX = x;
      this.touchHandling.posY = y;
    },

    /**
     * Handles touch movement events, at the moment only swipe left and right
     * are supported, but later could be extended with up and down swipes.
     * It should be good to implement some kind of minimal swipe lenght support.
     */
    touchMove(event) {
      const {
        clientX: x,
        clientY: y
      } = event.touches[0];
      const {
        posX,
        posY
      } = this.touchHandling;

      if (posX === 0 || posY === 0) {
        return;
      }

      const xDiff = posX - x;
      const yDiff = posY - y;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          // left
          this.moveToNextItem();
        } else {
          // right
          this.moveToPreviousItem();
        }
      } // reset


      this.touchHandling.posX = 0;
      this.touchHandling.posY = 0;
    },

    /**
     * This method enables browser scrolling lock which prevent from horizontal
     * and vertical scrolling. This makes touch navigation less confusing.
     */
    enableScrollLock() {
      if (!document.body.classList.contains('silentbox-is-opened')) {
        return document.body.classList.add('silentbox-is-opened');
      }
    },

    /**
     * This method removes browser scrolling lock.
     */
    removeScrollLock() {
      if (document.body.classList.contains('silentbox-is-opened')) {
        return document.body.classList.remove('silentbox-is-opened');
      }
    },

    /**
     * Move to next item.
     */
    moveToNextItem() {
      this.animationName = 'silentbox-animation__swipe-left';
      this.$emit('requestNextSilentBoxItem');
    },

    /**
     * Move to previous item.
     */
    moveToPreviousItem() {
      this.animationName = 'silentbox-animation__swipe-right';
      this.$emit('requestPreviousSilentBoxItem');
    },

    /**
     * Hide silentbox overlay.
     */
    closeSilentboxOverlay() {
      this.removeScrollLock();
      this.$emit('closeSilentboxOverlay');
    },

    /**
     * Search for known video services URLs and return their players if recognized.
     * Unrecognized URLs are handled as images.
     *
     * @param  {string} url
     * @return {string}
     */
    handleUrl(url) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return this.parseYoutubeVideo(url);
      } else if (url.includes('vimeo')) {
        return this.parseVimeoVideo(url);
      }

      return url;
    },

    /**
     * Get embed URL for youtube.com
     *
     * @param  {string} url
     * @return {string}
     */
    parseYoutubeVideo(url) {
      let videoUrl = '';
      const videoId = this.getYoutubeVideoId(url);

      if (videoId) {
        videoUrl = `${location.protocol}//www.youtube.com/embed/${videoId}?rel=0`;

        if (this.overlayItem.autoplay) {
          videoUrl += '&autoplay=1';
        }

        if (!this.overlayItem.controls) {
          videoUrl += '&controls=0';
        }
      }

      return videoUrl;
    },

    /**
     * Get embed URL for vimeo.com
     *
     * @param  {string} url
     * @return {string}
     */
    parseVimeoVideo(url) {
      let videoUrl = '';
      const vimoId = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(url)[3];

      if (vimoId !== undefined) {
        videoUrl = `${location.protocol}//player.vimeo.com/video/${vimoId}?rel=0`;

        if (this.overlayItem.autoplay === 'autoplay') {
          videoUrl += '&autoplay=1';
        }
      }

      return videoUrl;
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  const options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  let hook;

  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      const originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      const existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

const isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return (id, style) => addStyle(id, style);
}

let HEAD;
const styles = {};

function addStyle(id, css) {
  const group = isOldIE ? css.media || 'default' : id;
  const style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    let code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      const index = style.ids.size - 1;
      const textNode = document.createTextNode(code);
      const nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.visible
    ? _c(
        "div",
        {
          attrs: { id: "silentbox-overlay" },
          on: { touchstart: _vm.touchStart, touchmove: _vm.touchMove }
        },
        [
          _c("div", { attrs: { id: "silentbox-overlay__background" } }),
          _vm._v(" "),
          _c(
            "transition",
            { attrs: { name: _vm.animationName, mode: "out-in" } },
            [
              _c(
                "div",
                {
                  key: _vm.overlayItem.src,
                  attrs: { id: "silentbox-overlay__content" },
                  on: {
                    click: function($event) {
                      $event.stopPropagation();
                      return _vm.closeSilentboxOverlay($event)
                    }
                  }
                },
                [
                  _c("div", { attrs: { id: "silentbox-overlay__embed" } }, [
                    _c(
                      "div",
                      { attrs: { id: "silentbox-overlay__container" } },
                      [
                        _vm.isEmbedVideo(_vm.overlayItem.src)
                          ? _c("iframe", {
                              attrs: {
                                allow:
                                  "'accelerometer; " +
                                  (!!_vm.overlayItem.autoplay && "autoplay;") +
                                  " encrypted-media; gyroscope; picture-in-picture",
                                src: _vm.handleUrl(_vm.overlayItem.src),
                                frameborder: "0",
                                width: "100%",
                                height: "100%",
                                allowfullscreen: ""
                              }
                            })
                          : _vm.isLocalVideo(_vm.overlayItem.src)
                          ? _c(
                              "div",
                              { staticClass: "silentbox-video__frame" },
                              [
                                _c("video", {
                                  staticClass: "silentbox-video__embed",
                                  attrs: {
                                    src: _vm.overlayItem.src,
                                    autoplay: _vm.overlayItem.autoplay,
                                    controls: ""
                                  }
                                })
                              ]
                            )
                          : _c("img", {
                              attrs: {
                                srcset: _vm.overlayItem.srcSet
                                  ? _vm.overlayItem.srcSet
                                  : _vm.overlayItem.src,
                                src: _vm.overlayItem.src,
                                alt: _vm.overlayItem.alt,
                                width: "auto",
                                height: "auto"
                              }
                            })
                      ]
                    ),
                    _vm._v(" "),
                    _vm.overlayItem.description
                      ? _c(
                          "p",
                          { attrs: { id: "silentbox-overlay__description" } },
                          [
                            _vm._v(
                              "\n            " +
                                _vm._s(_vm.overlayItem.description) +
                                "\n        "
                            )
                          ]
                        )
                      : _vm._e()
                  ])
                ]
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              attrs: {
                id: "silentbox-overlay__close-button",
                role: "button",
                tabindex: "3"
              },
              on: {
                click: function($event) {
                  $event.stopPropagation();
                  return _vm.closeSilentboxOverlay($event)
                },
                keyup: function($event) {
                  if (
                    !$event.type.indexOf("key") &&
                    _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                  ) {
                    return null
                  }
                  return _vm.closeSilentboxOverlay($event)
                }
              }
            },
            [_c("div", { staticClass: "icon" })]
          ),
          _vm._v(" "),
          _vm.totalItems > 1
            ? _c("div", { attrs: { id: "silentbox-overlay__arrow-buttons" } }, [
                _c("div", {
                  staticClass: "arrow arrow-previous",
                  attrs: { role: "button", tabindex: "2" },
                  on: {
                    click: function($event) {
                      $event.stopPropagation();
                      return _vm.moveToPreviousItem($event)
                    },
                    keyup: function($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                      ) {
                        return null
                      }
                      return _vm.moveToPreviousItem($event)
                    }
                  }
                }),
                _vm._v(" "),
                _c("div", {
                  staticClass: "arrow arrow-next",
                  attrs: { role: "button", tabindex: "1" },
                  on: {
                    click: function($event) {
                      $event.stopPropagation();
                      return _vm.moveToNextItem($event)
                    },
                    keyup: function($event) {
                      if (
                        !$event.type.indexOf("key") &&
                        _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                      ) {
                        return null
                      }
                      return _vm.moveToNextItem($event)
                    }
                  }
                })
              ])
            : _vm._e()
        ],
        1
      )
    : _vm._e()
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-a04c8938_0", { source: ".silentbox-is-opened {\n  overflow: hidden;\n}\n#silentbox-overlay {\n  display: block;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  z-index: 999;\n}\n#silentbox-overlay__background {\n  background: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(20px);\n  cursor: default;\n  display: block;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n#silentbox-overlay__content {\n  cursor: default;\n  display: block;\n  height: 100%;\n  position: relative;\n  width: 100%;\n}\n#silentbox-overlay__embed {\n  bottom: 0;\n  cursor: default;\n  display: block;\n  height: 80%;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: -2.5rem;\n  width: 75%;\n}\n#silentbox-overlay__embed img,\n#silentbox-overlay__embed iframe {\n  background-color: #000;\n  bottom: 0;\n  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.45);\n  cursor: default;\n  display: block;\n  left: 0;\n  margin: auto;\n  max-height: 100%;\n  max-width: 100%;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n#silentbox-overlay__container {\n  cursor: default;\n  height: 100%;\n  margin: 0;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n#silentbox-overlay__description {\n  display: block;\n  padding-top: 1rem;\n  text-align: center;\n  color: #fff;\n}\n#silentbox-overlay__close-button {\n  background: rgba(0, 0, 0, 0);\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  height: 2.5rem;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transition: background-color 250ms ease-out;\n  width: 2.5rem;\n}\n#silentbox-overlay__close-button:hover, #silentbox-overlay__close-button:focus {\n  background-color: rgba(0, 0, 0, 0.5);\n  outline: none;\n}\n@media (max-width: 1024px) {\n#silentbox-overlay__close-button {\n    height: 5.75rem;\n    width: 5.75rem;\n}\n}\n#silentbox-overlay__close-button .icon {\n  color: #fff;\n  cursor: pointer;\n  height: 1rem;\n  left: 0.7rem;\n  margin: 50% 50% 0 0;\n  position: absolute;\n  right: 0px;\n  top: -0.5rem;\n  transition: 250ms ease;\n  width: 1rem;\n}\n@media (max-width: 1024px) {\n#silentbox-overlay__close-button .icon {\n    height: 2.5rem;\n    width: 2.5rem;\n    left: -1rem;\n}\n}\n#silentbox-overlay__close-button .icon:before, #silentbox-overlay__close-button .icon:after {\n  background: #fff;\n  content: \"\";\n  height: 2px;\n  left: 5%;\n  position: absolute;\n  top: 50%;\n  transition: 250ms ease;\n  width: 100%;\n}\n#silentbox-overlay__close-button .icon:before {\n  transform: rotate(-45deg);\n}\n#silentbox-overlay__close-button .icon:after {\n  transform: rotate(45deg);\n}\n#silentbox-overlay__close-button .icon:hover:before, #silentbox-overlay__close-button .icon:hover:after, #silentbox-overlay__close-button .icon:focus:before, #silentbox-overlay__close-button .icon:focus:after {\n  background: #58e8d2;\n  left: 25%;\n  width: 50%;\n}\n#silentbox-overlay__arrow-buttons .arrow {\n  border-left: 2px solid #fff;\n  border-top: 2px solid #fff;\n  cursor: pointer;\n  height: 1.5rem;\n  position: absolute;\n  width: 1.5rem;\n}\n#silentbox-overlay__arrow-buttons .arrow:hover, #silentbox-overlay__arrow-buttons .arrow:focus {\n  outline: none;\n  border-color: #58e8d2;\n}\n#silentbox-overlay__arrow-buttons .arrow-previous {\n  left: 2rem;\n  top: 50%;\n  transform: rotate(-45deg);\n}\n#silentbox-overlay__arrow-buttons .arrow-previous:hover, #silentbox-overlay__arrow-buttons .arrow-previous:focus {\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n  animation-name: pulsingPrevious;\n}\n#silentbox-overlay__arrow-buttons .arrow-next {\n  right: 2rem;\n  top: 50%;\n  transform: rotate(135deg);\n}\n#silentbox-overlay__arrow-buttons .arrow-next:hover, #silentbox-overlay__arrow-buttons .arrow-next:focus {\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n  animation-name: pulsingNext;\n}\n#silentbox-overlay .silentbox-video__frame {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n}\n#silentbox-overlay .silentbox-video__embed {\n  outline: none;\n}\n#silentbox-overlay .silentbox-video__embed:active, #silentbox-overlay .silentbox-video__embed:focus, #silentbox-overlay .silentbox-video__embed:hover {\n  outline: none;\n}\n.silentbox-animation__swipe-left-enter-active {\n  transition: all 0.3s ease;\n  opacity: 0;\n  transform: translateX(25vw);\n}\n.silentbox-animation__swipe-left-leave-active {\n  transition: all 0.3s ease;\n  transition: opacity 0.5s;\n}\n.silentbox-animation__swipe-left-enter-to {\n  opacity: 1;\n  transition: all 0.3s ease;\n  transform: translateX(0);\n}\n.silentbox-animation__swipe-left-leave-to {\n  opacity: 0;\n  transition: all 0.3s ease;\n  transform: translateX(-25vw);\n}\n.silentbox-animation__swipe-right-enter-active {\n  transition: all 0.3s ease;\n  opacity: 0;\n  transform: translateX(-25vw);\n}\n.silentbox-animation__swipe-right-leave-active {\n  transition: all 0.3s ease;\n  transition: opacity 0.5s;\n}\n.silentbox-animation__swipe-right-enter-to {\n  opacity: 1;\n  transition: all 0.3s ease;\n  transform: translateX(0);\n}\n.silentbox-animation__swipe-right-leave-to {\n  opacity: 0;\n  transition: all 0.3s ease;\n  transform: translateX(25vw);\n}\n@keyframes pulsingNext {\n0% {\n    animation-timing-function: ease-in;\n    right: 2rem;\n}\n25% {\n    animation-timing-function: ease-in;\n    right: 1.75rem;\n}\n75% {\n    animation-timing-function: ease-in;\n    right: 2.25rem;\n}\n100% {\n    animation-timing-function: ease-in;\n    right: 2rem;\n}\n}\n@keyframes pulsingPrevious {\n0% {\n    animation-timing-function: ease-in;\n    left: 2rem;\n}\n25% {\n    animation-timing-function: ease-in;\n    left: 1.75rem;\n}\n75% {\n    animation-timing-function: ease-in;\n    left: 2.25rem;\n}\n100% {\n    animation-timing-function: ease-in;\n    left: 2rem;\n}\n}\n\n/*# sourceMappingURL=overlay.vue.map */", map: {"version":3,"sources":["/Users/silencesys/Projects/Silencesys/silentbox/src/Silentbox/src/components/overlay.vue","overlay.vue"],"names":[],"mappings":"AAqSA;EACA,gBAAA;ACpSA;ADuSA;EACA,cAAA;EACA,aAAA;EACA,OAAA;EACA,eAAA;EACA,MAAA;EACA,YAAA;EACA,YAAA;ACpSA;AD+QA;EAwBA,+BAAA;EACA,2BAAA;EACA,eAAA;EACA,cAAA;EACA,YAAA;EACA,OAAA;EACA,kBAAA;EACA,MAAA;EACA,WAAA;ACpSA;ADoQA;EAoCA,eAAA;EACA,cAAA;EACA,YAAA;EACA,kBAAA;EACA,WAAA;ACrSA;AD6PA;EA4CA,SAAA;EACA,eAAA;EACA,cAAA;EACA,WAAA;EACA,OAAA;EACA,YAAA;EACA,kBAAA;EACA,QAAA;EACA,YAAA;EACA,UAAA;ACtSA;ADwSA;;EAEA,sBAjDA;EAkDA,SAAA;EACA,0CAAA;EACA,eAAA;EACA,cAAA;EACA,OAAA;EACA,YAAA;EACA,gBAAA;EACA,eAAA;EACA,kBAAA;EACA,QAAA;EACA,MAAA;ACtSA;ADkOA;EAyEA,eAAA;EACA,YAAA;EACA,SAAA;EACA,kBAAA;EACA,kBAAA;EACA,WAAA;ACxSA;AD0NA;EAkFA,cAAA;EACA,iBAAA;EACA,kBAAA;EACA,WA/EA;AC1NA;ADoNA;EAyFA,4BAAA;EACA,YAAA;EACA,WArFA;EAsFA,eAAA;EACA,cAAA;EACA,kBAAA;EACA,QAAA;EACA,MAAA;EACA,2CAAA;EACA,aAAA;AC1SA;AD2SA;EAEA,oCAAA;EACA,aAAA;AC1SA;AD4SA;AAxGA;IAyGA,eAAA;IACA,cAAA;ACzSE;AACF;AD2SA;EACA,WAxGA;EAyGA,eAAA;EACA,YAAA;EACA,YAAA;EACA,mBAAA;EACA,kBAAA;EACA,UAAA;EACA,YAAA;EACA,sBAAA;EACA,WAAA;ACzSA;AD0SA;AAXA;IAYA,cAAA;IACA,aAAA;IACA,WAAA;ACvSE;AACF;ADwSA;EAEA,gBAzHA;EA0HA,WAAA;EACA,WAAA;EACA,QAAA;EACA,kBAAA;EACA,QAAA;EACA,sBAAA;EACA,WAAA;ACvSA;ADySA;EACA,yBAAA;ACvSA;ADySA;EACA,wBAAA;ACvSA;AD2SA;EAEA,mBA3IA;EA4IA,SAAA;EACA,UAAA;AC1SA;ADiTA;EACA,2BAAA;EACA,0BAAA;EACA,eAAA;EACA,cAAA;EACA,kBAAA;EACA,aAAA;AC/SA;ADgTA;EAEA,aAAA;EACA,qBA9JA;ACjJA;ADkTA;EACA,UAAA;EACA,QAAA;EACA,yBAAA;AChTA;ADiTA;EAEA,sBAAA;EACA,mCAAA;EACA,+BAAA;AChTA;ADmTA;EACA,WAAA;EACA,QAAA;EACA,yBAAA;ACjTA;ADkTA;EAEA,sBAAA;EACA,mCAAA;EACA,2BAAA;ACjTA;ADqTA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,WAAA;EACA,YAAA;ACnTA;ADqTA;EACA,aAAA;ACnTA;ADoTA;EAGA,aAAA;ACpTA;AD0TA;EACA,yBAAA;EACA,UAAA;EACA,2BAAA;ACvTA;ADyTA;EACA,yBAAA;EACA,wBAAA;ACtTA;ADwTA;EACA,UAAA;EACA,yBAAA;EACA,wBAAA;ACrTA;ADuTA;EACA,UAAA;EACA,yBAAA;EACA,4BAAA;ACpTA;ADsTA;EACA,yBAAA;EACA,UAAA;EACA,4BAAA;ACnTA;ADqTA;EACA,yBAAA;EACA,wBAAA;AClTA;ADoTA;EACA,UAAA;EACA,yBAAA;EACA,wBAAA;ACjTA;ADmTA;EACA,UAAA;EACA,yBAAA;EACA,2BAAA;AChTA;ADoTA;AACA;IACA,kCAAA;IACA,WAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,cAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,cAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,WAAA;ACjTE;AACF;ADmTA;AACA;IACA,kCAAA;IACA,UAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,aAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,aAAA;ACjTE;ADmTF;IACA,kCAAA;IACA,UAAA;ACjTE;AACF;;AAEA,sCAAsC","file":"overlay.vue","sourcesContent":["<template>\r\n  <div\r\n    id=\"silentbox-overlay\"\r\n    v-if=\"visible\"\r\n    @touchstart=\"touchStart\"\r\n    @touchmove=\"touchMove\"\r\n  >\r\n    <div id=\"silentbox-overlay__background\" />\r\n\r\n    <transition :name=\"animationName\" mode=\"out-in\">\r\n      <div\r\n        id=\"silentbox-overlay__content\"\r\n        @click.stop=\"closeSilentboxOverlay\"\r\n        :key=\"overlayItem.src\"\r\n      >\r\n        <div id=\"silentbox-overlay__embed\">\r\n          <div id=\"silentbox-overlay__container\">\r\n            <!-- embed video rendering -->\r\n            <iframe\r\n              v-if=\"isEmbedVideo(overlayItem.src)\"\r\n              :allow=\"`'accelerometer; ${ !!overlayItem.autoplay && 'autoplay;' } encrypted-media; gyroscope; picture-in-picture`\"\r\n              :src=\"handleUrl(overlayItem.src)\"\r\n              frameborder=\"0\"\r\n              width=\"100%\"\r\n              height=\"100%\"\r\n              allowfullscreen\r\n            />\r\n            <!-- local video rendering -->\r\n            <div\r\n              v-else-if=\"isLocalVideo(overlayItem.src)\"\r\n              class=\"silentbox-video__frame\"\r\n            >\r\n              <video\r\n                :src=\"overlayItem.src\"\r\n                :autoplay=\"overlayItem.autoplay\"\r\n                controls\r\n                class=\"silentbox-video__embed\"\r\n              />\r\n            </div>\r\n            <!-- local/embed image rendering -->\r\n            <img v-else :srcset=\"overlayItem.srcSet ? overlayItem.srcSet : overlayItem.src\" :src=\"overlayItem.src\" :alt=\"overlayItem.alt\" width=\"auto\" height=\"auto\" >\r\n          </div>\r\n          <p\r\n            id=\"silentbox-overlay__description\"\r\n            v-if=\"overlayItem.description\">\r\n              {{ overlayItem.description }}\r\n          </p>\r\n        </div>\r\n      </div>\r\n    </transition>\r\n\r\n    <div\r\n      id=\"silentbox-overlay__close-button\"\r\n      role=\"button\"\r\n      tabindex=\"3\"\r\n      @click.stop=\"closeSilentboxOverlay\"\r\n      @keyup.enter=\"closeSilentboxOverlay\"\r\n    >\r\n      <div class=\"icon\" />\r\n    </div>\r\n\r\n    <div id=\"silentbox-overlay__arrow-buttons\" v-if=\"totalItems > 1\">\r\n      <div\r\n        class=\"arrow arrow-previous\"\r\n        role=\"button\"\r\n        tabindex=\"2\"\r\n        @click.stop=\"moveToPreviousItem\"\r\n        @keyup.enter=\"moveToPreviousItem\"\r\n      />\r\n      <div\r\n        class=\"arrow arrow-next\"\r\n        role=\"button\"\r\n        tabindex=\"1\"\r\n        @click.stop=\"moveToNextItem\"\r\n        @keyup.enter=\"moveToNextItem\"\r\n      />\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nimport itemMixim from './../mixins/item'\r\n\r\nexport default {\r\n  name: 'SilentboxOverlay',\r\n  mixins: [itemMixim],\r\n  props: {\r\n    overlayItem: {\r\n      type: Object,\r\n      default: () => {\r\n        return {\r\n          src: '',\r\n          srcSet: '',\r\n          description: ''\r\n        }\r\n      }\r\n    },\r\n    visible: {\r\n      type: Boolean,\r\n      default: false\r\n    },\r\n    totalItems: {\r\n      type: Number,\r\n      default: 1\r\n    }\r\n  },\r\n  data () {\r\n    return {\r\n      touchHandling: {\r\n        posX: 0,\r\n        posY: 0\r\n      },\r\n      animationName: 'silentbox-animation__swipe-left'\r\n    }\r\n  },\r\n  created () {\r\n    // Listen to key events.\r\n    window.addEventListener('keyup', (event) => {\r\n      // Escape: 27\r\n      if (event.which === 27) {\r\n        this.closeSilentboxOverlay()\r\n      }\r\n      // Right arrow: 39\r\n      if (event.which === 39) {\r\n        this.moveToNextItem()\r\n      }\r\n      // Left arrow: 37\r\n      if (event.which === 37) {\r\n        this.moveToPreviousItem()\r\n      }\r\n    })\r\n\r\n    // Disable browser scrolling.\r\n    this.enableScrollLock()\r\n  },\r\n  methods: {\r\n    /**\r\n     * Registers the finger position on website so we can later calculate users\r\n     * swipe direction.\r\n     */\r\n    touchStart (event) {\r\n      const { clientX: x, clientY: y } = event.touches[0]\r\n      this.touchHandling.posX = x\r\n      this.touchHandling.posY = y\r\n    },\r\n    /**\r\n     * Handles touch movement events, at the moment only swipe left and right\r\n     * are supported, but later could be extended with up and down swipes.\r\n     * It should be good to implement some kind of minimal swipe lenght support.\r\n     */\r\n    touchMove (event) {\r\n      const { clientX: x, clientY: y } = event.touches[0]\r\n      const { posX, posY } = this.touchHandling\r\n\r\n      if (posX === 0 || posY === 0) {\r\n        return\r\n      }\r\n\r\n      const xDiff = posX - x\r\n      const yDiff = posY - y\r\n\r\n      if (Math.abs(xDiff) > Math.abs(yDiff)) {\r\n        if (xDiff > 0) {\r\n          // left\r\n          this.moveToNextItem()\r\n        } else {\r\n          // right\r\n          this.moveToPreviousItem()\r\n        }\r\n      } else {\r\n        if (yDiff > 0) {\r\n          // up\r\n        } else {\r\n          // down\r\n          // this.closeSilentboxOverlay()\r\n        }\r\n      }\r\n\r\n      // reset\r\n      this.touchHandling.posX = 0\r\n      this.touchHandling.posY = 0\r\n    },\r\n    /**\r\n     * This method enables browser scrolling lock which prevent from horizontal\r\n     * and vertical scrolling. This makes touch navigation less confusing.\r\n     */\r\n    enableScrollLock () {\r\n      if (!document.body.classList.contains('silentbox-is-opened')) {\r\n        return document.body.classList.add('silentbox-is-opened')\r\n      }\r\n    },\r\n    /**\r\n     * This method removes browser scrolling lock.\r\n     */\r\n    removeScrollLock () {\r\n      if (document.body.classList.contains('silentbox-is-opened')) {\r\n        return document.body.classList.remove('silentbox-is-opened')\r\n      }\r\n    },\r\n    /**\r\n     * Move to next item.\r\n     */\r\n    moveToNextItem () {\r\n      this.animationName = 'silentbox-animation__swipe-left'\r\n      this.$emit('requestNextSilentBoxItem')\r\n    },\r\n    /**\r\n     * Move to previous item.\r\n     */\r\n    moveToPreviousItem () {\r\n      this.animationName = 'silentbox-animation__swipe-right'\r\n      this.$emit('requestPreviousSilentBoxItem')\r\n    },\r\n    /**\r\n     * Hide silentbox overlay.\r\n     */\r\n    closeSilentboxOverlay () {\r\n      this.removeScrollLock()\r\n      this.$emit('closeSilentboxOverlay')\r\n    },\r\n    /**\r\n     * Search for known video services URLs and return their players if recognized.\r\n     * Unrecognized URLs are handled as images.\r\n     *\r\n     * @param  {string} url\r\n     * @return {string}\r\n     */\r\n    handleUrl (url) {\r\n      if (url.includes('youtube.com') || url.includes('youtu.be')) {\r\n        return this.parseYoutubeVideo(url)\r\n      } else if (url.includes('vimeo')) {\r\n        return this.parseVimeoVideo(url)\r\n      }\r\n      return url\r\n    },\r\n    /**\r\n     * Get embed URL for youtube.com\r\n     *\r\n     * @param  {string} url\r\n     * @return {string}\r\n     */\r\n    parseYoutubeVideo (url) {\r\n      let videoUrl = ''\r\n      const videoId = this.getYoutubeVideoId(url)\r\n\r\n      if (videoId) {\r\n        videoUrl = `${location.protocol}//www.youtube.com/embed/${videoId}?rel=0`\r\n\r\n        if (this.overlayItem.autoplay) {\r\n          videoUrl += '&autoplay=1'\r\n        }\r\n        if (!this.overlayItem.controls) {\r\n          videoUrl += '&controls=0'\r\n        }\r\n      }\r\n\r\n      return videoUrl\r\n    },\r\n    /**\r\n     * Get embed URL for vimeo.com\r\n     *\r\n     * @param  {string} url\r\n     * @return {string}\r\n     */\r\n    parseVimeoVideo (url) {\r\n      let videoUrl = ''\r\n      const vimoId = /(vimeo(pro)?\\.com)\\/(?:[^\\d]+)?(\\d+)\\??(.*)?$/.exec(url)[3]\r\n\r\n      if (vimoId !== undefined) {\r\n        videoUrl = `${location.protocol}//player.vimeo.com/video/${vimoId}?rel=0`\r\n        if (this.overlayItem.autoplay === 'autoplay') {\r\n          videoUrl += '&autoplay=1'\r\n        }\r\n      }\r\n\r\n      return videoUrl\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style lang=\"scss\">\r\n@mixin element($element) {\r\n    &__#{$element} {\r\n        @content;\r\n    }\r\n}\r\n\r\n// Colours used in silentbox\r\n$main:   #fff;\r\n$accent: #58e8d2;\r\n$bg: #000;\r\n\r\n.silentbox-is-opened {\r\n    overflow: hidden;\r\n}\r\n\r\n#silentbox-overlay {\r\n    display: block;\r\n    height: 100vh;\r\n    left: 0;\r\n    position: fixed;\r\n    top: 0;\r\n    width: 100vw;\r\n    z-index: 999;\r\n\r\n    @include element(background) {\r\n        background: rgba($bg, .75);\r\n        backdrop-filter: blur(20px);\r\n        cursor: default;\r\n        display: block;\r\n        height: 100%;\r\n        left: 0;\r\n        position: absolute;\r\n        top: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    @include element(content) {\r\n        cursor: default;\r\n        display: block;\r\n        height: 100%;\r\n        position: relative;\r\n        width: 100%;\r\n    }\r\n\r\n    @include element(embed) {\r\n        bottom: 0;\r\n        cursor: default;\r\n        display: block;\r\n        height: 80%;\r\n        left: 0;\r\n        margin: auto;\r\n        position: absolute;\r\n        right: 0;\r\n        top: -2.5rem;\r\n        width: 75%;\r\n\r\n        img,\r\n        iframe {\r\n            background-color: $bg;\r\n            bottom: 0;\r\n            box-shadow: 0 0 1.5rem rgba($bg, .45);\r\n            cursor: default;\r\n            display: block;\r\n            left: 0;\r\n            margin: auto;\r\n            max-height: 100%;\r\n            max-width: 100%;\r\n            position: absolute;\r\n            right: 0;\r\n            top: 0;\r\n        }\r\n    }\r\n\r\n    @include element(container) {\r\n        cursor: default;\r\n        height: 100%;\r\n        margin: 0;\r\n        position: relative;\r\n        text-align: center;\r\n        width: 100%;\r\n    }\r\n\r\n    @include element(description) {\r\n        display: block;\r\n        padding-top: 1rem;\r\n        text-align: center;\r\n        color: $main;\r\n    }\r\n\r\n    @include element(close-button) {\r\n        background: rgba($bg, .0);\r\n        border: none;\r\n        color: $main;\r\n        cursor: pointer;\r\n        height: 2.5rem;\r\n        position: absolute;\r\n        right: 0;\r\n        top: 0;\r\n        transition: background-color 250ms ease-out;\r\n        width: 2.5rem;\r\n        &:hover,\r\n        &:focus {\r\n            background-color: rgba($bg, .5);\r\n            outline: none;\r\n        }\r\n        @media (max-width: 1024px) {\r\n          height: 5.75rem;\r\n          width: 5.75rem;\r\n        }\r\n\r\n        .icon {\r\n            color: $main;\r\n            cursor: pointer;\r\n            height: 1rem;\r\n            left: .7rem;\r\n            margin: 50% 50% 0 0;\r\n            position: absolute;\r\n            right: 0px;\r\n            top: -.5rem;\r\n            transition: 250ms ease;\r\n            width: 1rem;\r\n            @media (max-width: 1024px) {\r\n              height: 2.5rem;\r\n              width: 2.5rem;\r\n              left: -1rem;\r\n            }\r\n            &:before,\r\n            &:after {\r\n                background: $main;\r\n                content: \"\";\r\n                height: 2px;\r\n                left: 5%;\r\n                position: absolute;\r\n                top: 50%;\r\n                transition: 250ms ease;\r\n                width: 100%;\r\n            }\r\n            &:before {\r\n                transform: rotate(-45deg);\r\n            }\r\n            &:after {\r\n                transform: rotate(45deg);\r\n            }\r\n            &:hover,\r\n            &:focus {\r\n                &:before,\r\n                &:after {\r\n                    background: $accent;\r\n                    left: 25%;\r\n                    width: 50%;\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    @include element(arrow-buttons) {\r\n        .arrow {\r\n            border-left: 2px solid $main;\r\n            border-top: 2px solid $main;\r\n            cursor: pointer;\r\n            height: 1.5rem;\r\n            position: absolute;\r\n            width: 1.5rem;\r\n            &:hover,\r\n            &:focus {\r\n                outline: none;\r\n                border-color: $accent;\r\n            }\r\n        }\r\n        .arrow-previous {\r\n            left: 2rem;\r\n            top: 50%;\r\n            transform: rotate(-45deg);\r\n            &:hover,\r\n            &:focus {\r\n                animation-duration: 1s;\r\n                animation-iteration-count: infinite;\r\n                animation-name: pulsingPrevious;\r\n            }\r\n        }\r\n        .arrow-next {\r\n            right: 2rem;\r\n            top: 50%;\r\n            transform: rotate(135deg);\r\n            &:hover,\r\n            &:focus {\r\n                animation-duration: 1s;\r\n                animation-iteration-count: infinite;\r\n                animation-name: pulsingNext;\r\n            }\r\n        }\r\n    }\r\n    .silentbox-video__frame {\r\n      display: flex;\r\n      justify-content: center;\r\n      align-items: center;\r\n      width: 100%;\r\n      height: 100%;\r\n    }\r\n    .silentbox-video__embed {\r\n      outline: none;\r\n      &:active,\r\n      &:focus,\r\n      &:hover {\r\n        outline: none\r\n      }\r\n    }\r\n}\r\n\r\n// Transitions\r\n.silentbox-animation__swipe-left-enter-active {\r\n  transition: all .3s ease;\r\n  opacity: 0;\r\n  transform: translateX(25vw);\r\n}\r\n.silentbox-animation__swipe-left-leave-active {\r\n  transition: all .3s ease;\r\n  transition: opacity .5s;\r\n}\r\n.silentbox-animation__swipe-left-enter-to {\r\n  opacity: 1;\r\n  transition: all .3s ease;\r\n  transform: translateX(0);\r\n}\r\n.silentbox-animation__swipe-left-leave-to {\r\n  opacity: 0;\r\n  transition: all .3s ease;\r\n  transform: translateX(-25vw);\r\n}\r\n.silentbox-animation__swipe-right-enter-active {\r\n  transition: all .3s ease;\r\n  opacity: 0;\r\n  transform: translateX(-25vw);\r\n}\r\n.silentbox-animation__swipe-right-leave-active {\r\n  transition: all .3s ease;\r\n  transition: opacity .5s;\r\n}\r\n.silentbox-animation__swipe-right-enter-to {\r\n  opacity: 1;\r\n  transition: all .3s ease;\r\n  transform: translateX(0);\r\n}\r\n.silentbox-animation__swipe-right-leave-to {\r\n  opacity: 0;\r\n  transition: all .3s ease;\r\n  transform: translateX(25vw);\r\n}\r\n\r\n// Animations\r\n@keyframes pulsingNext {\r\n    0%   {\r\n        animation-timing-function: ease-in;\r\n        right: 2rem;\r\n    }\r\n    25%  {\r\n        animation-timing-function: ease-in;\r\n        right: 1.75rem;\r\n    }\r\n    75%  {\r\n        animation-timing-function: ease-in;\r\n        right: 2.25rem;\r\n    }\r\n    100% {\r\n        animation-timing-function: ease-in;\r\n        right: 2rem;\r\n    }\r\n}\r\n@keyframes pulsingPrevious {\r\n    0%   {\r\n        animation-timing-function: ease-in;\r\n        left: 2rem;\r\n    }\r\n    25%  {\r\n        animation-timing-function: ease-in;\r\n        left: 1.75rem;\r\n    }\r\n    75%  {\r\n        animation-timing-function: ease-in;\r\n        left: 2.25rem;\r\n    }\r\n    100% {\r\n        animation-timing-function: ease-in;\r\n        left: 2rem;\r\n    }\r\n}\r\n</style>\r\n",".silentbox-is-opened {\n  overflow: hidden;\n}\n\n#silentbox-overlay {\n  display: block;\n  height: 100vh;\n  left: 0;\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  z-index: 999;\n}\n#silentbox-overlay__background {\n  background: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(20px);\n  cursor: default;\n  display: block;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n#silentbox-overlay__content {\n  cursor: default;\n  display: block;\n  height: 100%;\n  position: relative;\n  width: 100%;\n}\n#silentbox-overlay__embed {\n  bottom: 0;\n  cursor: default;\n  display: block;\n  height: 80%;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: -2.5rem;\n  width: 75%;\n}\n#silentbox-overlay__embed img,\n#silentbox-overlay__embed iframe {\n  background-color: #000;\n  bottom: 0;\n  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.45);\n  cursor: default;\n  display: block;\n  left: 0;\n  margin: auto;\n  max-height: 100%;\n  max-width: 100%;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n#silentbox-overlay__container {\n  cursor: default;\n  height: 100%;\n  margin: 0;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n#silentbox-overlay__description {\n  display: block;\n  padding-top: 1rem;\n  text-align: center;\n  color: #fff;\n}\n#silentbox-overlay__close-button {\n  background: rgba(0, 0, 0, 0);\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  height: 2.5rem;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transition: background-color 250ms ease-out;\n  width: 2.5rem;\n}\n#silentbox-overlay__close-button:hover, #silentbox-overlay__close-button:focus {\n  background-color: rgba(0, 0, 0, 0.5);\n  outline: none;\n}\n@media (max-width: 1024px) {\n  #silentbox-overlay__close-button {\n    height: 5.75rem;\n    width: 5.75rem;\n  }\n}\n#silentbox-overlay__close-button .icon {\n  color: #fff;\n  cursor: pointer;\n  height: 1rem;\n  left: 0.7rem;\n  margin: 50% 50% 0 0;\n  position: absolute;\n  right: 0px;\n  top: -0.5rem;\n  transition: 250ms ease;\n  width: 1rem;\n}\n@media (max-width: 1024px) {\n  #silentbox-overlay__close-button .icon {\n    height: 2.5rem;\n    width: 2.5rem;\n    left: -1rem;\n  }\n}\n#silentbox-overlay__close-button .icon:before, #silentbox-overlay__close-button .icon:after {\n  background: #fff;\n  content: \"\";\n  height: 2px;\n  left: 5%;\n  position: absolute;\n  top: 50%;\n  transition: 250ms ease;\n  width: 100%;\n}\n#silentbox-overlay__close-button .icon:before {\n  transform: rotate(-45deg);\n}\n#silentbox-overlay__close-button .icon:after {\n  transform: rotate(45deg);\n}\n#silentbox-overlay__close-button .icon:hover:before, #silentbox-overlay__close-button .icon:hover:after, #silentbox-overlay__close-button .icon:focus:before, #silentbox-overlay__close-button .icon:focus:after {\n  background: #58e8d2;\n  left: 25%;\n  width: 50%;\n}\n#silentbox-overlay__arrow-buttons .arrow {\n  border-left: 2px solid #fff;\n  border-top: 2px solid #fff;\n  cursor: pointer;\n  height: 1.5rem;\n  position: absolute;\n  width: 1.5rem;\n}\n#silentbox-overlay__arrow-buttons .arrow:hover, #silentbox-overlay__arrow-buttons .arrow:focus {\n  outline: none;\n  border-color: #58e8d2;\n}\n#silentbox-overlay__arrow-buttons .arrow-previous {\n  left: 2rem;\n  top: 50%;\n  transform: rotate(-45deg);\n}\n#silentbox-overlay__arrow-buttons .arrow-previous:hover, #silentbox-overlay__arrow-buttons .arrow-previous:focus {\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n  animation-name: pulsingPrevious;\n}\n#silentbox-overlay__arrow-buttons .arrow-next {\n  right: 2rem;\n  top: 50%;\n  transform: rotate(135deg);\n}\n#silentbox-overlay__arrow-buttons .arrow-next:hover, #silentbox-overlay__arrow-buttons .arrow-next:focus {\n  animation-duration: 1s;\n  animation-iteration-count: infinite;\n  animation-name: pulsingNext;\n}\n#silentbox-overlay .silentbox-video__frame {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n}\n#silentbox-overlay .silentbox-video__embed {\n  outline: none;\n}\n#silentbox-overlay .silentbox-video__embed:active, #silentbox-overlay .silentbox-video__embed:focus, #silentbox-overlay .silentbox-video__embed:hover {\n  outline: none;\n}\n\n.silentbox-animation__swipe-left-enter-active {\n  transition: all 0.3s ease;\n  opacity: 0;\n  transform: translateX(25vw);\n}\n\n.silentbox-animation__swipe-left-leave-active {\n  transition: all 0.3s ease;\n  transition: opacity 0.5s;\n}\n\n.silentbox-animation__swipe-left-enter-to {\n  opacity: 1;\n  transition: all 0.3s ease;\n  transform: translateX(0);\n}\n\n.silentbox-animation__swipe-left-leave-to {\n  opacity: 0;\n  transition: all 0.3s ease;\n  transform: translateX(-25vw);\n}\n\n.silentbox-animation__swipe-right-enter-active {\n  transition: all 0.3s ease;\n  opacity: 0;\n  transform: translateX(-25vw);\n}\n\n.silentbox-animation__swipe-right-leave-active {\n  transition: all 0.3s ease;\n  transition: opacity 0.5s;\n}\n\n.silentbox-animation__swipe-right-enter-to {\n  opacity: 1;\n  transition: all 0.3s ease;\n  transform: translateX(0);\n}\n\n.silentbox-animation__swipe-right-leave-to {\n  opacity: 0;\n  transition: all 0.3s ease;\n  transform: translateX(25vw);\n}\n\n@keyframes pulsingNext {\n  0% {\n    animation-timing-function: ease-in;\n    right: 2rem;\n  }\n  25% {\n    animation-timing-function: ease-in;\n    right: 1.75rem;\n  }\n  75% {\n    animation-timing-function: ease-in;\n    right: 2.25rem;\n  }\n  100% {\n    animation-timing-function: ease-in;\n    right: 2rem;\n  }\n}\n@keyframes pulsingPrevious {\n  0% {\n    animation-timing-function: ease-in;\n    left: 2rem;\n  }\n  25% {\n    animation-timing-function: ease-in;\n    left: 1.75rem;\n  }\n  75% {\n    animation-timing-function: ease-in;\n    left: 2.25rem;\n  }\n  100% {\n    animation-timing-function: ease-in;\n    left: 2rem;\n  }\n}\n\n/*# sourceMappingURL=overlay.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

//
var script$1 = {
  name: 'silentboxGallery',
  mixins: [itemMixin],
  props: {
    lazyLoading: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    previewCount: {
      type: Number,
      default: null
    },
    gallery: {
      type: Array,
      default: () => {
        return [];
      }
    },
    image: {
      type: Object,
      default: () => {
        return {
          src: '',
          alt: '',
          thumbnailWidth: 'auto',
          thumbnailHeight: 'auto',
          thumbnail: '',
          autoplay: false,
          controls: true,
          description: ''
        };
      }
    }
  },
  components: {
    'silentbox-overlay': __vue_component__
  },

  data() {
    return {
      overlay: {
        item: {
          src: '',
          alt: '',
          thumbnailWidth: 'auto',
          thumbnailHeight: 'auto',
          thumbnail: '',
          autoplay: false,
          controls: true,
          description: ''
        },
        visible: false,
        currentItem: 0
      }
    };
  },

  computed: {
    totalItems() {
      return this.gallery.length || 1;
    },

    previewGallery() {
      if (Number.isInteger(this.previewCount)) {
        return this.gallery.slice(0, this.previewCount).map(item => {
          return { ...this.overlay.item,
            ...item,
            thumbnail: this.setThumbnail(item),
            autoplay: this.setAutoplay(item)
          };
        });
      }

      return this.galleryItems;
    },

    galleryItems() {
      if (this.gallery.length > 0) {
        return this.gallery.map(item => {
          return { ...this.overlay.item,
            ...item,
            thumbnail: this.setThumbnail(item),
            autoplay: this.setAutoplay(item)
          };
        });
      }

      return [{ ...this.overlay.item,
        ...this.image,
        thumbnail: this.setThumbnail(this.image)
      }];
    }

  },
  methods: {
    openOverlay(image, index = 0) {
      this.overlay.visible = true;
      this.overlay.item = image;
      this.overlay.currentItem = index;
      this.$emit('silentbox-overlay-opened', {
        item: image
      });
    },

    hideOverlay() {
      this.overlay.visible = false;
      this.$emit('silentbox-overlay-hidden', {
        item: this.overlay.item
      });
    },

    showNextItem() {
      let newItemIndex = this.overlay.currentItem + 1;
      newItemIndex = newItemIndex <= this.galleryItems.length - 1 ? newItemIndex : 0;
      this.overlay.item = this.galleryItems[newItemIndex];
      this.overlay.currentItem = newItemIndex;
      this.$emit('silentbox-overlay-next-item-displayed', {
        item: this.overlay.item
      });
    },

    showPreviousItem() {
      let newItemIndex = this.overlay.currentItem - 1;
      newItemIndex = newItemIndex > -1 ? newItemIndex : this.galleryItems.length - 1;
      this.overlay.item = this.galleryItems[newItemIndex];
      this.overlay.currentItem = newItemIndex;
      this.$emit('silentbox-overlay-previous-item-displayed', {
        item: this.overlay.item
      });
    },

    setAutoplay(item) {
      return item.autoplay ? 'autoplay' : '';
    },

    setThumbnail(item) {
      if (this.isEmbedVideo(item.src) && item.thumbnail === undefined) {
        return this.getThumbnail(item.src);
      }

      return item.thumbnail || item.src;
    }

  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "section",
    { attrs: { id: "silentbox-gallery" } },
    [
      _vm._t("default"),
      _vm._v(" "),
      _vm._l(_vm.previewGallery, function(image, index) {
        return _c(
          "div",
          {
            key: image.src,
            staticClass: "silentbox-item",
            on: {
              click: function($event) {
                return _vm.openOverlay(image, index)
              }
            }
          },
          [
            _vm._t(
              "silentbox-item",
              [
                _c("img", {
                  attrs: {
                    loading: _vm.lazyLoading ? "lazy" : "eager",
                    src: image.thumbnail,
                    alt: image.alt,
                    width: image.thumbnailWidth,
                    height: image.thumbnailHeight
                  }
                })
              ],
              { silentboxItem: image }
            )
          ],
          2
        )
      }),
      _vm._v(" "),
      _vm.overlay.visible
        ? _c("silentbox-overlay", {
            attrs: {
              "overlay-item": _vm.overlay.item,
              visible: _vm.overlay.visible,
              "total-items": _vm.totalItems
            },
            on: {
              closeSilentboxOverlay: _vm.hideOverlay,
              requestNextSilentBoxItem: _vm.showNextItem,
              requestPreviousSilentBoxItem: _vm.showPreviousItem
            }
          })
        : _vm._e()
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-832c0c28_0", { source: ".silentbox-item {\n  cursor: pointer;\n  display: inline-block;\n  text-decoration: underline;\n}\n\n/*# sourceMappingURL=gallery.vue.map */", map: {"version":3,"sources":["/Users/silencesys/Projects/Silencesys/silentbox/src/Silentbox/src/components/gallery.vue","gallery.vue"],"names":[],"mappings":"AA8KA;EACA,eAAA;EACA,qBAAA;EACA,0BAAA;AC7KA;;AAEA,sCAAsC","file":"gallery.vue","sourcesContent":["<template>\n  <section id=\"silentbox-gallery\">\n    <slot />\n    <div\n      v-for=\"(image, index) in previewGallery\"\n      :key=\"image.src\"\n      @click=\"openOverlay(image, index)\"\n      class=\"silentbox-item\"\n    >\n      <slot\n          name=\"silentbox-item\"\n          v-bind:silentboxItem=\"image\"\n      >\n        <img\n          :loading=\"(lazyLoading)? 'lazy' : 'eager'\"\n          :src=\"image.thumbnail\"\n          :alt=\"image.alt\"\n          :width=\"image.thumbnailWidth\"\n          :height=\"image.thumbnailHeight\"\n        >\n      </slot>\n    </div>\n    <silentbox-overlay\n      v-if=\"overlay.visible\"\n      :overlay-item=\"overlay.item\"\n      :visible=\"overlay.visible\"\n      :total-items=\"totalItems\"\n      @closeSilentboxOverlay=\"hideOverlay\"\n      @requestNextSilentBoxItem=\"showNextItem\"\n      @requestPreviousSilentBoxItem=\"showPreviousItem\"\n    />\n  </section>\n</template>\n\n<script>\nimport overlay from './overlay.vue'\nimport itemMixin from './../mixins/item'\n\nexport default {\n  name: 'silentboxGallery',\n  mixins: [itemMixin],\n  props: {\n    lazyLoading: {\n      type: Boolean,\n      default: () => {\n        return true\n      }\n    },\n    previewCount: {\n      type: Number,\n      default: null\n    },\n    gallery: {\n      type: Array,\n      default: () => {\n        return []\n      }\n    },\n    image: {\n      type: Object,\n      default: () => {\n        return {\n          src: '',\n          alt: '',\n          thumbnailWidth: 'auto',\n          thumbnailHeight: 'auto',\n          thumbnail: '',\n          autoplay: false,\n          controls: true,\n          description: ''\n        }\n      }\n    }\n  },\n  components: {\n    'silentbox-overlay': overlay\n  },\n  data () {\n    return {\n      overlay: {\n        item: {\n          src: '',\n          alt: '',\n          thumbnailWidth: 'auto',\n          thumbnailHeight: 'auto',\n          thumbnail: '',\n          autoplay: false,\n          controls: true,\n          description: ''\n        },\n        visible: false,\n        currentItem: 0\n      }\n    }\n  },\n  computed: {\n    totalItems () {\n      return this.gallery.length || 1\n    },\n    previewGallery () {\n      if (Number.isInteger(this.previewCount)) {\n        return this.gallery.slice(0, this.previewCount).map(item => {\n          return {\n            ...this.overlay.item,\n            ...item,\n            thumbnail: this.setThumbnail(item),\n            autoplay: this.setAutoplay(item)\n          }\n        })\n      }\n      return this.galleryItems\n    },\n    galleryItems () {\n      if (this.gallery.length > 0) {\n        return this.gallery.map(item => {\n          return {\n            ...this.overlay.item,\n            ...item,\n            thumbnail: this.setThumbnail(item),\n            autoplay: this.setAutoplay(item)\n          }\n        })\n      }\n      return [{\n        ...this.overlay.item,\n        ...this.image,\n        thumbnail: this.setThumbnail(this.image)\n      }]\n    }\n  },\n  methods: {\n    openOverlay (image, index = 0) {\n      this.overlay.visible = true\n      this.overlay.item = image\n      this.overlay.currentItem = index\n      this.$emit('silentbox-overlay-opened', { item: image })\n    },\n    hideOverlay () {\n      this.overlay.visible = false\n      this.$emit('silentbox-overlay-hidden', { item: this.overlay.item })\n    },\n    showNextItem () {\n      let newItemIndex = this.overlay.currentItem + 1\n      newItemIndex = newItemIndex <= this.galleryItems.length - 1\n        ? newItemIndex : 0\n\n      this.overlay.item = this.galleryItems[newItemIndex]\n      this.overlay.currentItem = newItemIndex\n      this.$emit('silentbox-overlay-next-item-displayed', { item: this.overlay.item })\n    },\n    showPreviousItem () {\n      let newItemIndex = this.overlay.currentItem - 1\n      newItemIndex = newItemIndex > -1\n        ? newItemIndex : this.galleryItems.length - 1\n\n      this.overlay.item = this.galleryItems[newItemIndex]\n      this.overlay.currentItem = newItemIndex\n      this.$emit('silentbox-overlay-previous-item-displayed', { item: this.overlay.item })\n    },\n    setAutoplay (item) {\n      return item.autoplay ? 'autoplay' : ''\n    },\n    setThumbnail (item) {\n      if (this.isEmbedVideo(item.src) && item.thumbnail === undefined) {\n        return this.getThumbnail(item.src)\n      }\n\n      return item.thumbnail || item.src\n    }\n  }\n}\n</script>\n\n<style lang=\"scss\">\n  .silentbox-item {\n      cursor: pointer;\n      display: inline-block;\n      text-decoration: underline;\n  }\n</style>\n",".silentbox-item {\n  cursor: pointer;\n  display: inline-block;\n  text-decoration: underline;\n}\n\n/*# sourceMappingURL=gallery.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

const VueSilentbox = {};

VueSilentbox.install = function (Vue) {
  Vue.mixin({
    components: {
      'silent-box': __vue_component__$1
    }
  });
  Vue.prototype.$silentbox = {
    /**
     * Programatically open SilentBox overlay.
     *
     * @param {Object} image
     */
    open: image => {
      const OverlayClass = Vue.extend(__vue_component__);
      const instance = new OverlayClass().$mount();
      instance.$set(instance, 'visible', true);
      instance.$set(instance, 'overlayItem', image); // Get the website body, so we can append false silentbox root to it later

      const bodyRoot = document.getElementsByTagName('body')[0]; // Create false silentbox root

      const silentboxRoot = document.createElement('div'); // Set ID to false silentbox root, so we can target it in some cases

      silentboxRoot.setAttribute('id', 'silentbox--false-root'); // Register the elements

      silentboxRoot.appendChild(instance.$el);
      bodyRoot.appendChild(silentboxRoot);
      instance.$on('closeSilentboxOverlay', () => {
        // Remove and destroy the instance after closing.
        silentboxRoot.remove();
        instance.$destroy();
      });
    }
  };
};

export default VueSilentbox;
