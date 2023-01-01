(function(e,p){typeof exports=="object"&&typeof module<"u"?module.exports=p(require("vue")):typeof define=="function"&&define.amd?define(["vue"],p):(e=typeof globalThis<"u"?globalThis:e||self,e.SilentBox=p(e.Vue))})(this,function(e){"use strict";const p=n=>{const t=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.exec(n);return t!=null&&t[7]!==void 0?t[7]:""},I=n=>{const t=/(vimeo(pro)?\.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/.exec(n);return t?t[3]:""},S=n=>{const t=/(?:player\.twitch\.tv\/\?channel=|twitch\.tv\/)([a-zA-Z0-9_]+)/.exec(n);return t?t[1]:""},N=n=>{if(E(n))try{const s=new XMLHttpRequest;return s.open("GET",n,!1),s.send(null),JSON.parse(s.responseText)}catch(s){return console.log(s),null}throw new Error("Given string: url is not valid URL address.")},B=n=>["youtube.com","youtu.be","vimeo.com","twitch.tv"].some(t=>n.includes(t)),T=n=>[".mp4",".ogg",".webm",".mov",".flv",".wmv",".mkv"].some(t=>n.toLowerCase().includes(t)),R=(n,s="")=>{var t;if(/(youtu\.?be)/.test(n)){const l=p(n);return`${location.protocol}//img.youtube.com/vi/${l}/hqdefault.jpg`}else if(/(vimeo(pro)?\.com)/.test(n)){const l=I(n),d=N(`${location.protocol}//vimeo.com/api/v2/video/${l}.json`);return d&&d.length>0?(t=d[0])==null?void 0:t.thumbnail_medium:s}else{if(E(n))return n;throw new Error("Given string: src is not valid URL address.")}},E=n=>new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(n),M=e.createElementVNode("div",{id:"silentbox-overlay__background"},null,-1),U=["onClick"],G={id:"silentbox-overlay__embed"},z=["allow","src"],K={key:1,class:"silentbox-video__frame"},D=["src","autoplay","controls"],O=["srcset","src","alt"],Y={key:1,id:"silentbox-overlay__tool-buttons"},P=["href"],X=["onClick","onKeyup"],j=[e.createElementVNode("div",{class:"icon"},null,-1)],A={key:0,id:"silentbox-overlay__arrow-buttons"},H=["onClick","onKeyup"],q=["onClick","onKeyup"],C=e.defineComponent({__name:"SilentBoxOverlay",props:{item:null,visible:{type:Boolean},currentItem:null,totalItems:null},emits:["silentbox-internal-close-overlay","silentbox-internal-get-next-item","silentbox-internal-get-prev-item","silentbox-overlay-opened","silentbox-overlay-hidden"],setup(n,{emit:s}){const t=n,l=e.inject("silent-box-options")||{downloadButtonLabel:"Download"},d=e.computed(()=>typeof t.item.download=="string"?t.item.download:t.item.src),i=r=>{let a="";const c=p(r);return c&&(a=`${location.protocol}//www.youtube.com/embed/${c}?rel=0`,t.item.autoplay&&(a+="&autoplay=1"),t.item.controls||(a+="&controls=0")),a},v=r=>{let a="";const c=I(r);return c&&(a=`${location.protocol}//player.vimeo.com/video/${c}?rel=0`,t.item.autoplay&&(a+="&autoplay=1")),a},f=r=>{let a="";const c=S(r);return c&&(a=`${location.protocol}//player.twitch.tv/?channel=${c}&parent=${location.hostname}`,t.item.autoplay&&(a+="&autoplay=true")),a},_=r=>/(youtu\.?be)/.test(r)?i(r):/(vimeo(pro)?\.com)/.test(r)?v(r):/(?:player\.|clips\.|www\.)?twitch\.tv/.test(r)?f(r):r,k=()=>{document.body.classList.contains("silentbox-is-opened")||document.body.classList.add("silentbox-is-opened")},u=()=>{document.body.classList.contains("silentbox-is-opened")&&document.body.classList.remove("silentbox-is-opened")},y=e.reactive({name:"silentbox-animation__swipe-left"}),b=()=>{s("silentbox-internal-close-overlay")},h=()=>{y.name="silentbox-animation__swipe-left",s("silentbox-internal-get-next-item")},x=()=>{y.name="silentbox-animation__swipe-right",s("silentbox-internal-get-prev-item")},o=e.reactive({posX:0,posY:0}),w=r=>{const{clientX:a,clientY:c}=r.touches[0];o.posX=a,o.posY=c},m=r=>{const{clientX:a,clientY:c}=r.touches[0],{posX:V,posY:L}=o;if(V===0||L===0)return;const $=V-a,Z=L-c;Math.abs($)>Math.abs(Z)&&($>0?h():x()),o.posX=0,o.posY=0},g=r=>{r.code==="Escape"&&b(),r.code==="ArrowRight"&&h(),r.code==="ArrowLeft"&&x()};return e.onUpdated(()=>{t.visible?(window.addEventListener("keyup",g),k()):(window.removeEventListener("keyup",g),u())}),(r,a)=>t.visible?(e.openBlock(),e.createElementBlock("div",{key:0,id:"silentbox-overlay",role:"overlay",onTouchstart:w,onTouchmove:m},[M,e.createVNode(e.Transition,{name:y.name,mode:"out-in"},{default:e.withCtx(()=>[(e.openBlock(),e.createElementBlock("div",{id:"silentbox-overlay__content",onClick:e.withModifiers(b,["stop"]),key:t.item.src},[e.createElementVNode("div",G,[e.createElementVNode("div",{id:"silentbox-overlay__container",onClick:a[0]||(a[0]=e.withModifiers(()=>{},["stop"]))},[e.unref(B)(t.item.src)?(e.openBlock(),e.createElementBlock("iframe",{key:0,allow:`accelerometer; ${!!t.item.autoplay&&"autoplay;"} encrypted-media; gyroscope; picture-in-picture`,src:_(t.item.src),frameborder:"0",width:"100%",height:"100%",allowfullscreen:""},null,8,z)):e.unref(T)(t.item.src)?(e.openBlock(),e.createElementBlock("div",K,[e.createElementVNode("video",{src:t.item.src,autoplay:!!t.item.autoplay,controls:t.item.controls,class:"silentbox-video__embed"},null,8,D)])):(e.openBlock(),e.createElementBlock("img",{key:2,srcset:t.item.srcSet?t.item.srcSet.join(","):t.item.src,src:t.item.src,alt:t.item.alt},null,8,O))]),t.item.description?(e.openBlock(),e.createElementBlock("p",{key:0,id:"silentbox-overlay__description",onClick:a[1]||(a[1]=e.withModifiers(()=>{},["prevent","stop"]))},e.toDisplayString(t.item.description),1)):e.createCommentVNode("",!0),t.item.download?(e.openBlock(),e.createElementBlock("div",Y,[e.createElementVNode("a",{href:e.unref(d),class:"download",download:""},e.toDisplayString(e.unref(l).downloadButtonLabel),9,P)])):e.createCommentVNode("",!0)])],8,U))]),_:1},8,["name"]),e.createElementVNode("button",{id:"silentbox-overlay__close-button",role:"button",tabindex:"3",onClick:e.withModifiers(b,["prevent"]),onKeyup:e.withKeys(b,["enter"])},j,40,X),t.totalItems>1?(e.openBlock(),e.createElementBlock("div",A,[e.createElementVNode("button",{class:"arrow arrow-previous",role:"button",tabindex:"2",onClick:e.withModifiers(x,["stop"]),onKeyup:e.withKeys(x,["enter"])},null,40,H),e.createElementVNode("button",{class:"arrow arrow-next",role:"button",tabindex:"1",onClick:e.withModifiers(h,["stop"]),onKeyup:e.withKeys(h,["enter"])},null,40,q)])):e.createCommentVNode("",!0)],32)):e.createCommentVNode("",!0)}}),ee="",F=["href","onClick"],W=["loading","src","alt","width","height"],J=e.defineComponent({__name:"SilentBoxGallery",props:{lazyLoading:{type:Boolean},previewCount:null,fallbackThumbnail:null,gallery:null,image:null},emits:["silentbox-overlay-opened","silentbox-overlay-hidden","silentbox-overlay-next-item-displayed","silentbox-overlay-prev-item-displayed"],setup(n,{expose:s,emit:t}){const l=n,d=e.computed(()=>l.gallery?l.gallery.length:1),i=e.reactive({item:{src:"",alt:"",thumbnailWidth:150,thumbnailHeight:0,thumbnail:"",autoplay:!1,controls:!0,description:"",download:!1},visible:!1,currentItem:0,totalItems:d}),v=o=>B(o)?R(o,l.fallbackThumbnail):o,f=o=>({...i.item,download:!1,...o,thumbnail:o.thumbnail?o.thumbnail:v(o.src)}),_=()=>l.gallery&&l.gallery.length>0?l.gallery.map(f):l.image?[f(l.image)]:[],k=e.computed(()=>l.previewCount&&l.previewCount>0&&l.gallery?l.gallery.slice(0,l.previewCount).map(f):_()),u=e.computed(()=>_()),y=(o,w=0)=>{i.visible=!0,i.item=o,i.currentItem=w,t("silentbox-overlay-opened",o)},b=()=>{i.visible=!1,t("silentbox-overlay-hidden",i.item)},h=()=>{let o=i.currentItem+1;o=o<=u.value.length-1?o:0,i.item=u.value[o],i.currentItem=o,t("silentbox-overlay-next-item-displayed",i.item)},x=()=>{let o=i.currentItem-1;o=o>=0?o:u.value.length-1,i.item=u.value[o],i.currentItem=o,t("silentbox-overlay-prev-item-displayed",i.item)};return s({openOverlay:y}),(o,w)=>(e.openBlock(),e.createElementBlock("div",null,[e.renderSlot(o.$slots,"default"),(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(e.unref(k),(m,g)=>(e.openBlock(),e.createElementBlock("a",{key:m.src,href:m.src,onClick:e.withModifiers(r=>y(m,g),["prevent"]),class:"silentbox-item"},[e.renderSlot(o.$slots,"silentbox-item",{silentboxItem:m},()=>[e.createElementVNode("img",{loading:n.lazyLoading?"lazy":"eager",src:m.thumbnail,alt:m.alt,width:m.thumbnailWidth,height:m.thumbnailHeight},null,8,W)])],8,F))),128)),e.createVNode(C,{visible:i.visible,item:i.item,"current-item":i.currentItem,"total-items":e.unref(d),onSilentboxInternalCloseOverlay:b,onSilentboxInternalGetNextItem:h,onSilentboxInternalGetPrevItem:x},null,8,["visible","item","current-item","total-items"])]))}}),te="";return{install:(n,s={})=>{n.component("silent-box",J),n.provide("silent-box-options",{downloadButtonLabel:"Download",...s}),n.config.globalProperties.$silentbox={open:t=>{const l=document.createElement("div");l.setAttribute("id","silentbox--false-root");const d=e.createApp(C,{item:t,currentItem:1,totalItems:1,visible:!0,onSilentboxInternalCloseOverlay:()=>{i.$emit("silentbox-overlay-hidden",t),d.unmount(),l.remove()}}),i=d.mount(l);i.$emit("silentbox-overlay-opened",t),i.$forceUpdate(),document.body.appendChild(i.$el)}}}}});
