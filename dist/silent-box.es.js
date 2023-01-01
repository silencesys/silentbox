import { defineComponent as z, inject as X, computed as C, reactive as V, onUpdated as A, openBlock as d, createElementBlock as u, createVNode as K, Transition as j, withCtx as H, withModifiers as v, createElementVNode as p, unref as f, toDisplayString as U, createCommentVNode as L, withKeys as S, renderSlot as G, Fragment as F, renderList as q, createApp as W } from "vue";
const O = (o) => {
  const e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.exec(o);
  return e != null && e[7] !== void 0 ? e[7] : "";
}, Y = (o) => {
  const e = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(o);
  return e ? e[3] : "";
}, J = (o) => {
  const e = /(?:player\.twitch\.tv\/\?channel=|twitch\.tv\/)([a-zA-Z0-9_]+)/.exec(o);
  return e ? e[1] : "";
}, Z = (o) => {
  if (M(o))
    try {
      const s = new XMLHttpRequest();
      return s.open("GET", o, !1), s.send(null), JSON.parse(s.responseText);
    } catch (s) {
      return console.log(s), null;
    }
  throw new Error("Given string: url is not valid URL address.");
}, D = (o) => [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "twitch.tv"
].some((e) => o.includes(e)), Q = (o) => [
  ".mp4",
  ".ogg",
  ".webm",
  ".mov",
  ".flv",
  ".wmv",
  ".mkv"
].some((e) => o.toLowerCase().includes(e)), ee = (o, s = "") => {
  var e;
  if (/(youtu\.?be)/.test(o)) {
    const i = O(o);
    return `${location.protocol}//img.youtube.com/vi/${i}/hqdefault.jpg`;
  } else if (/(vimeo(pro)?\.com)/.test(o)) {
    const i = Y(o), c = Z(`${location.protocol}//vimeo.com/api/v2/video/${i}.json`);
    return c && c.length > 0 ? (e = c[0]) == null ? void 0 : e.thumbnail_medium : s;
  } else {
    if (M(o))
      return o;
    throw new Error("Given string: src is not valid URL address.");
  }
}, M = (o) => new RegExp(
  "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
  "i"
).test(o), te = /* @__PURE__ */ p("div", { id: "silentbox-overlay__background" }, null, -1), oe = ["onClick"], ne = { id: "silentbox-overlay__embed" }, ie = ["allow", "src"], le = {
  key: 1,
  class: "silentbox-video__frame"
}, se = ["src", "autoplay", "controls"], re = ["srcset", "src", "alt"], ae = {
  key: 1,
  id: "silentbox-overlay__tool-buttons"
}, ce = ["href"], de = ["onClick", "onKeyup"], ue = /* @__PURE__ */ p("div", { class: "icon" }, null, -1), me = [
  ue
], pe = {
  key: 0,
  id: "silentbox-overlay__arrow-buttons"
}, ve = ["onClick", "onKeyup"], be = ["onClick", "onKeyup"], N = /* @__PURE__ */ z({
  __name: "SilentBoxOverlay",
  props: {
    item: null,
    visible: { type: Boolean },
    currentItem: null,
    totalItems: null
  },
  emits: [
    "silentbox-internal-close-overlay",
    "silentbox-internal-get-next-item",
    "silentbox-internal-get-prev-item",
    "silentbox-overlay-opened",
    "silentbox-overlay-hidden"
  ],
  setup(o, { emit: s }) {
    const e = o, i = X("silent-box-options") || { downloadButtonLabel: "Download" }, c = C(() => typeof e.item.download == "string" ? e.item.download : e.item.src), n = (l) => {
      let r = "";
      const a = O(l);
      return a && (r = `${location.protocol}//www.youtube.com/embed/${a}?rel=0`, e.item.autoplay && (r += "&autoplay=1"), e.item.controls || (r += "&controls=0")), r;
    }, $ = (l) => {
      let r = "";
      const a = Y(l);
      return a && (r = `${location.protocol}//player.vimeo.com/video/${a}?rel=0`, e.item.autoplay && (r += "&autoplay=1")), r;
    }, w = (l) => {
      let r = "";
      const a = J(l);
      return a && (r = `${location.protocol}//player.twitch.tv/?channel=${a}&parent=${location.hostname}`, e.item.autoplay && (r += "&autoplay=true")), r;
    }, g = (l) => /(youtu\.?be)/.test(l) ? n(l) : /(vimeo(pro)?\.com)/.test(l) ? $(l) : /(?:player\.|clips\.|www\.)?twitch\.tv/.test(l) ? w(l) : l, E = () => {
      document.body.classList.contains("silentbox-is-opened") || document.body.classList.add("silentbox-is-opened");
    }, b = () => {
      document.body.classList.contains("silentbox-is-opened") && document.body.classList.remove("silentbox-is-opened");
    }, y = V({
      name: "silentbox-animation__swipe-left"
    }), h = () => {
      s("silentbox-internal-close-overlay");
    }, x = () => {
      y.name = "silentbox-animation__swipe-left", s("silentbox-internal-get-next-item");
    }, _ = () => {
      y.name = "silentbox-animation__swipe-right", s("silentbox-internal-get-prev-item");
    }, t = V({
      posX: 0,
      posY: 0
    }), I = (l) => {
      const { clientX: r, clientY: a } = l.touches[0];
      t.posX = r, t.posY = a;
    }, m = (l) => {
      const { clientX: r, clientY: a } = l.touches[0], { posX: R, posY: B } = t;
      if (R === 0 || B === 0)
        return;
      const T = R - r, P = B - a;
      Math.abs(T) > Math.abs(P) && (T > 0 ? x() : _()), t.posX = 0, t.posY = 0;
    }, k = (l) => {
      l.code === "Escape" && h(), l.code === "ArrowRight" && x(), l.code === "ArrowLeft" && _();
    };
    return A(() => {
      e.visible ? (window.addEventListener("keyup", k), E()) : (window.removeEventListener("keyup", k), b());
    }), (l, r) => e.visible ? (d(), u("div", {
      key: 0,
      id: "silentbox-overlay",
      role: "overlay",
      onTouchstart: I,
      onTouchmove: m
    }, [
      te,
      K(j, {
        name: y.name,
        mode: "out-in"
      }, {
        default: H(() => [
          (d(), u("div", {
            id: "silentbox-overlay__content",
            onClick: v(h, ["stop"]),
            key: e.item.src
          }, [
            p("div", ne, [
              p("div", {
                id: "silentbox-overlay__container",
                onClick: r[0] || (r[0] = v(() => {
                }, ["stop"]))
              }, [
                f(D)(e.item.src) ? (d(), u("iframe", {
                  key: 0,
                  allow: `accelerometer; ${!!e.item.autoplay && "autoplay;"} encrypted-media; gyroscope; picture-in-picture`,
                  src: g(e.item.src),
                  frameborder: "0",
                  width: "100%",
                  height: "100%",
                  allowfullscreen: ""
                }, null, 8, ie)) : f(Q)(e.item.src) ? (d(), u("div", le, [
                  p("video", {
                    src: e.item.src,
                    autoplay: !!e.item.autoplay,
                    controls: e.item.controls,
                    class: "silentbox-video__embed"
                  }, null, 8, se)
                ])) : (d(), u("img", {
                  key: 2,
                  srcset: e.item.srcSet ? e.item.srcSet.join(",") : e.item.src,
                  src: e.item.src,
                  alt: e.item.alt
                }, null, 8, re))
              ]),
              e.item.description ? (d(), u("p", {
                key: 0,
                id: "silentbox-overlay__description",
                onClick: r[1] || (r[1] = v(() => {
                }, ["prevent", "stop"]))
              }, U(e.item.description), 1)) : L("", !0),
              e.item.download ? (d(), u("div", ae, [
                p("a", {
                  href: f(c),
                  class: "download",
                  download: ""
                }, U(f(i).downloadButtonLabel), 9, ce)
              ])) : L("", !0)
            ])
          ], 8, oe))
        ]),
        _: 1
      }, 8, ["name"]),
      p("button", {
        id: "silentbox-overlay__close-button",
        role: "button",
        tabindex: "3",
        onClick: v(h, ["prevent"]),
        onKeyup: S(h, ["enter"])
      }, me, 40, de),
      e.totalItems > 1 ? (d(), u("div", pe, [
        p("button", {
          class: "arrow arrow-previous",
          role: "button",
          tabindex: "2",
          onClick: v(_, ["stop"]),
          onKeyup: S(_, ["enter"])
        }, null, 40, ve),
        p("button", {
          class: "arrow arrow-next",
          role: "button",
          tabindex: "1",
          onClick: v(x, ["stop"]),
          onKeyup: S(x, ["enter"])
        }, null, 40, be)
      ])) : L("", !0)
    ], 32)) : L("", !0);
  }
});
const ye = ["href", "onClick"], he = ["loading", "src", "alt", "width", "height"], xe = /* @__PURE__ */ z({
  __name: "SilentBoxGallery",
  props: {
    lazyLoading: { type: Boolean },
    previewCount: null,
    fallbackThumbnail: null,
    gallery: null,
    image: null
  },
  emits: [
    "silentbox-overlay-opened",
    "silentbox-overlay-hidden",
    "silentbox-overlay-next-item-displayed",
    "silentbox-overlay-prev-item-displayed"
  ],
  setup(o, { expose: s, emit: e }) {
    const i = o, c = C(() => i.gallery ? i.gallery.length : 1), n = V({
      item: {
        src: "",
        alt: "",
        thumbnailWidth: 150,
        thumbnailHeight: 0,
        thumbnail: "",
        autoplay: !1,
        controls: !0,
        description: "",
        download: !1
      },
      visible: !1,
      currentItem: 0,
      totalItems: c
    }), $ = (t) => D(t) ? ee(t, i.fallbackThumbnail) : t, w = (t) => ({
      ...n.item,
      download: !1,
      ...t,
      thumbnail: t.thumbnail ? t.thumbnail : $(t.src)
    }), g = () => i.gallery && i.gallery.length > 0 ? i.gallery.map(w) : i.image ? [w(i.image)] : [], E = C(() => i.previewCount && i.previewCount > 0 && i.gallery ? i.gallery.slice(0, i.previewCount).map(w) : g()), b = C(() => g()), y = (t, I = 0) => {
      n.visible = !0, n.item = t, n.currentItem = I, e("silentbox-overlay-opened", t);
    }, h = () => {
      n.visible = !1, e("silentbox-overlay-hidden", n.item);
    }, x = () => {
      let t = n.currentItem + 1;
      t = t <= b.value.length - 1 ? t : 0, n.item = b.value[t], n.currentItem = t, e("silentbox-overlay-next-item-displayed", n.item);
    }, _ = () => {
      let t = n.currentItem - 1;
      t = t >= 0 ? t : b.value.length - 1, n.item = b.value[t], n.currentItem = t, e("silentbox-overlay-prev-item-displayed", n.item);
    };
    return s({ openOverlay: y }), (t, I) => (d(), u("div", null, [
      G(t.$slots, "default"),
      (d(!0), u(F, null, q(f(E), (m, k) => (d(), u("a", {
        key: m.src,
        href: m.src,
        onClick: v((l) => y(m, k), ["prevent"]),
        class: "silentbox-item"
      }, [
        G(t.$slots, "silentbox-item", { silentboxItem: m }, () => [
          p("img", {
            loading: o.lazyLoading ? "lazy" : "eager",
            src: m.thumbnail,
            alt: m.alt,
            width: m.thumbnailWidth,
            height: m.thumbnailHeight
          }, null, 8, he)
        ])
      ], 8, ye))), 128)),
      K(N, {
        visible: n.visible,
        item: n.item,
        "current-item": n.currentItem,
        "total-items": f(c),
        onSilentboxInternalCloseOverlay: h,
        onSilentboxInternalGetNextItem: x,
        onSilentboxInternalGetPrevItem: _
      }, null, 8, ["visible", "item", "current-item", "total-items"])
    ]));
  }
});
const fe = {
  install: (o, s = {}) => {
    o.component("silent-box", xe), o.provide("silent-box-options", {
      downloadButtonLabel: "Download",
      ...s
    }), o.config.globalProperties.$silentbox = {
      open: (e) => {
        const i = document.createElement("div");
        i.setAttribute("id", "silentbox--false-root");
        const c = W(N, {
          item: e,
          currentItem: 1,
          totalItems: 1,
          visible: !0,
          onSilentboxInternalCloseOverlay: () => {
            n.$emit("silentbox-overlay-hidden", e), c.unmount(), i.remove();
          }
        }), n = c.mount(i);
        n.$emit("silentbox-overlay-opened", e), n.$forceUpdate(), document.body.appendChild(n.$el);
      }
    };
  }
};
export {
  fe as default
};
