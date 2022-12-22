import { defineComponent as G, reactive as S, onUpdated as N, openBlock as d, createElementBlock as u, createVNode as T, Transition as O, withCtx as P, withModifiers as x, createElementVNode as p, unref as f, toDisplayString as X, createCommentVNode as C, withKeys as L, computed as $, renderSlot as R, Fragment as A, renderList as D, createApp as H } from "vue";
const U = (o) => {
  const e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.exec(o);
  return e != null && e[7] !== void 0 ? e[7] : "";
}, z = (o) => {
  const e = /(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(o);
  return e ? e[3] : "";
}, j = (o) => {
  if (K(o))
    try {
      const i = new XMLHttpRequest();
      return i.open("GET", o, !1), i.send(null), JSON.parse(i.responseText);
    } catch (i) {
      return console.log(i), null;
    }
  throw new Error("Given string: url is not valid URL address.");
}, B = (o) => [
  "youtube.com",
  "youtu.be",
  "vimeo.com"
].some((e) => o.includes(e)), F = (o) => [
  ".mp4",
  ".ogg",
  ".webm",
  ".mov",
  ".flv",
  ".wmv",
  ".mkv"
].some((e) => o.toLowerCase().includes(e)), q = (o, i = "") => {
  var e;
  if (/(youtu\.?be)/.test(o)) {
    const l = U(o);
    return `${location.protocol}//img.youtube.com/vi/${l}/hqdefault.jpg`;
  } else if (/(vimeo(pro)?\.com)/.test(o)) {
    const l = z(o), a = j(`${location.protocol}//vimeo.com/api/v2/video/${l}.json`);
    return a && a.length > 0 ? (e = a[0]) == null ? void 0 : e.thumbnail_medium : i;
  } else {
    if (K(o))
      return o;
    throw new Error("Given string: src is not valid URL address.");
  }
}, K = (o) => new RegExp(
  "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
  "i"
).test(o), W = /* @__PURE__ */ p("div", { id: "silentbox-overlay__background" }, null, -1), J = ["onClick"], Q = { id: "silentbox-overlay__embed" }, Z = { id: "silentbox-overlay__container" }, ee = ["allow", "src"], te = {
  key: 1,
  class: "silentbox-video__frame"
}, oe = ["src", "autoplay", "controls"], ne = ["srcset", "src", "alt"], ie = ["onClick", "onKeyup"], le = /* @__PURE__ */ p("div", { class: "icon" }, null, -1), se = [
  le
], re = {
  key: 0,
  id: "silentbox-overlay__arrow-buttons"
}, ae = ["onClick", "onKeyup"], ce = ["onClick", "onKeyup"], Y = /* @__PURE__ */ G({
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
  setup(o, { emit: i }) {
    const e = o, l = (s) => {
      let n = "";
      const c = U(s);
      return c && (n = `${location.protocol}//www.youtube.com/embed/${c}?rel=0`, e.item.autoplay && (n += "&autoplay=1"), e.item.controls || (n += "&controls=0")), n;
    }, a = (s) => {
      let n = "";
      const c = z(s);
      return c && (n = `${location.protocol}//player.vimeo.com/video/${c}?rel=0`, e.item.autoplay && (n += "&autoplay=1")), n;
    }, r = (s) => /(youtu\.?be)/.test(s) ? l(s) : /(vimeo(pro)?\.com)/.test(s) ? a(s) : s, g = () => {
      document.body.classList.contains("silentbox-is-opened") || document.body.classList.add("silentbox-is-opened");
    }, _ = () => {
      document.body.classList.contains("silentbox-is-opened") && document.body.classList.remove("silentbox-is-opened");
    }, y = S({
      name: "silentbox-animation__swipe-left"
    }), h = () => {
      i("silentbox-internal-close-overlay");
    }, m = () => {
      y.name = "silentbox-animation__swipe-left", i("silentbox-internal-get-next-item");
    }, v = () => {
      y.name = "silentbox-animation__swipe-right", i("silentbox-internal-get-prev-item");
    }, b = S({
      posX: 0,
      posY: 0
    }), w = (s) => {
      const { clientX: n, clientY: c } = s.touches[0];
      b.posX = n, b.posY = c;
    }, I = (s) => {
      const { clientX: n, clientY: c } = s.touches[0], { posX: k, posY: V } = b;
      if (k === 0 || V === 0)
        return;
      const E = k - n, M = V - c;
      Math.abs(E) > Math.abs(M) && (E > 0 ? m() : v()), b.posX = 0, b.posY = 0;
    }, t = (s) => {
      s.code === "Escape" && h(), s.code === "ArrowRight" && m(), s.code === "ArrowLeft" && v();
    };
    return N(() => {
      e.visible ? (window.addEventListener("keyup", t), g()) : (window.removeEventListener("keyup", t), _());
    }), (s, n) => e.visible ? (d(), u("div", {
      key: 0,
      id: "silentbox-overlay",
      role: "overlay",
      onTouchstart: w,
      onTouchmove: I
    }, [
      W,
      T(O, {
        name: y.name,
        mode: "out-in"
      }, {
        default: P(() => [
          (d(), u("div", {
            id: "silentbox-overlay__content",
            onClick: x(h, ["stop"]),
            key: e.item.src
          }, [
            p("div", Q, [
              p("div", Z, [
                f(B)(e.item.src) ? (d(), u("iframe", {
                  key: 0,
                  allow: `accelerometer; ${!!e.item.autoplay && "autoplay;"} encrypted-media; gyroscope; picture-in-picture`,
                  src: r(e.item.src),
                  frameborder: "0",
                  width: "100%",
                  height: "100%",
                  allowfullscreen: ""
                }, null, 8, ee)) : f(F)(e.item.src) ? (d(), u("div", te, [
                  p("video", {
                    src: e.item.src,
                    autoplay: !!e.item.autoplay,
                    controls: e.item.controls,
                    class: "silentbox-video__embed"
                  }, null, 8, oe)
                ])) : (d(), u("img", {
                  key: 2,
                  srcset: e.item.srcSet ? e.item.srcSet.join(",") : e.item.src,
                  src: e.item.src,
                  alt: e.item.alt
                }, null, 8, ne))
              ]),
              e.item.description ? (d(), u("p", {
                key: 0,
                id: "silentbox-overlay__description",
                onClick: n[0] || (n[0] = x(() => {
                }, ["prevent", "stop"]))
              }, X(e.item.description), 1)) : C("", !0)
            ])
          ], 8, J))
        ]),
        _: 1
      }, 8, ["name"]),
      p("button", {
        id: "silentbox-overlay__close-button",
        role: "button",
        tabindex: "3",
        onClick: x(h, ["prevent"]),
        onKeyup: L(h, ["enter"])
      }, se, 40, ie),
      e.totalItems > 1 ? (d(), u("div", re, [
        p("button", {
          class: "arrow arrow-previous",
          role: "button",
          tabindex: "2",
          onClick: x(v, ["stop"]),
          onKeyup: L(v, ["enter"])
        }, null, 40, ae),
        p("button", {
          class: "arrow arrow-next",
          role: "button",
          tabindex: "1",
          onClick: x(m, ["stop"]),
          onKeyup: L(m, ["enter"])
        }, null, 40, ce)
      ])) : C("", !0)
    ], 32)) : C("", !0);
  }
});
const de = ["href", "onClick"], ue = ["loading", "src", "alt", "width", "height"], me = /* @__PURE__ */ G({
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
  setup(o, { expose: i, emit: e }) {
    const l = o, a = $(() => l.gallery ? l.gallery.length : 1), r = S({
      item: {
        src: "",
        alt: "",
        thumbnailWidth: 150,
        thumbnailHeight: 0,
        thumbnail: "",
        autoplay: !1,
        controls: !0,
        description: ""
      },
      visible: !1,
      currentItem: 0,
      totalItems: a
    }), g = (t) => B(t) ? q(t, l.fallbackThumbnail) : t, _ = (t) => ({
      ...r.item,
      ...t,
      thumbnail: t.thumbnail ? t.thumbnail : g(t.src)
    }), y = () => l.gallery && l.gallery.length > 0 ? l.gallery.map(_) : l.image ? [_(l.image)] : [], h = $(() => l.previewCount && l.previewCount > 0 && l.gallery ? l.gallery.slice(0, l.previewCount).map(_) : y()), m = $(() => y()), v = (t, s = 0) => {
      r.visible = !0, r.item = t, r.currentItem = s, e("silentbox-overlay-opened", t);
    }, b = () => {
      r.visible = !1, e("silentbox-overlay-hidden", r.item);
    }, w = () => {
      let t = r.currentItem + 1;
      t = t <= m.value.length - 1 ? t : 0, r.item = m.value[t], r.currentItem = t, e("silentbox-overlay-next-item-displayed", r.item);
    }, I = () => {
      let t = r.currentItem - 1;
      t = t >= 0 ? t : m.value.length - 1, r.item = m.value[t], r.currentItem = t, e("silentbox-overlay-prev-item-displayed", r.item);
    };
    return i({ openOverlay: v }), (t, s) => (d(), u("div", null, [
      R(t.$slots, "default"),
      (d(!0), u(A, null, D(f(h), (n, c) => (d(), u("a", {
        key: n.src,
        href: n.src,
        onClick: x((k) => v(n, c), ["prevent"]),
        class: "silentbox-item"
      }, [
        R(t.$slots, "silentbox-item", { silentboxItem: n }, () => [
          p("img", {
            loading: o.lazyLoading ? "lazy" : "eager",
            src: n.thumbnail,
            alt: n.alt,
            width: n.thumbnailWidth,
            height: n.thumbnailHeight
          }, null, 8, ue)
        ])
      ], 8, de))), 128)),
      T(Y, {
        visible: r.visible,
        item: r.item,
        "current-item": r.currentItem,
        "total-items": f(a),
        onSilentboxInternalCloseOverlay: b,
        onSilentboxInternalGetNextItem: w,
        onSilentboxInternalGetPrevItem: I
      }, null, 8, ["visible", "item", "current-item", "total-items"])
    ]));
  }
});
const ve = {
  install: (o) => {
    o.component("silent-box", me), o.config.globalProperties.$silentbox = {
      open: (i) => {
        const e = document.createElement("div");
        e.setAttribute("id", "silentbox--false-root");
        const l = H(Y, {
          item: i,
          currentItem: 1,
          totalItems: 1,
          visible: !0,
          onSilentboxInternalCloseOverlay: () => {
            a.$emit("silentbox-overlay-hidden", i), l.unmount(), e.remove();
          }
        }), a = l.mount(e);
        a.$emit("silentbox-overlay-opened", i), a.$forceUpdate(), document.body.appendChild(a.$el);
      }
    };
  }
};
export {
  ve as default
};
