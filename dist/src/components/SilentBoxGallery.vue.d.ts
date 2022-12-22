import type { ItemProps } from '../types';
import { type OverlayProps } from './SilentBoxOverlay.vue';
export interface GalleryProps {
    lazyLoading?: boolean;
    previewCount?: number;
    fallbackThumbnail?: string;
    gallery?: ItemProps[];
    image?: ItemProps;
}
declare const _sfc_main: import("vue").DefineComponent<{
    lazyLoading: {
        type: BooleanConstructor;
        required: false;
    };
    previewCount: {
        type: NumberConstructor;
        required: false;
    };
    fallbackThumbnail: {
        type: StringConstructor;
        required: false;
    };
    gallery: {
        type: ArrayConstructor;
        required: false;
    };
    image: {
        type: any;
        required: false;
    };
}, {
    props: any;
    totalItems: import("vue").ComputedRef<number>;
    overlay: OverlayProps;
    getThumbnailURL: (itemSrc: string) => string;
    mapGalleryItem: (item: ItemProps) => ItemProps;
    getGalleryItems: () => ItemProps[];
    getGalleryThumbnails: import("vue").ComputedRef<ItemProps[]>;
    getGallery: import("vue").ComputedRef<ItemProps[]>;
    emit: (event: "silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-overlay-next-item-displayed" | "silentbox-overlay-prev-item-displayed", ...args: any[]) => void;
    openOverlay: (item: ItemProps, index?: number) => void;
    hideOverlay: () => void;
    showNextItem: () => void;
    showPrevItem: () => void;
    SilentBoxOverlay: import("vue").DefineComponent<{
        item: {
            type: any;
            required: true;
        };
        visible: {
            type: BooleanConstructor;
            required: true;
        };
        currentItem: {
            type: NumberConstructor;
            required: true;
        };
        totalItems: {
            type: NumberConstructor;
            required: true;
        };
    }, {
        props: any;
        getYouTubeVideoURL: (url: string) => string;
        getVimeoVideoURL: (url: string) => string;
        getVideoURL: (url: string) => string;
        lockScrolling: () => void;
        unlockScrolling: () => void;
        animation: {
            name: string;
        };
        emit: (event: "silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-internal-close-overlay" | "silentbox-internal-get-next-item" | "silentbox-internal-get-prev-item", ...args: any[]) => void;
        handleClose: () => void;
        handleMoveNext: () => void;
        handleMovePrev: () => void;
        touchPosition: {
            posX: number;
            posY: number;
        };
        touchStart: (event: TouchEvent) => void;
        handleTouchMove: (event: TouchEvent) => void;
        handleKeyInteraction: (event: KeyboardEvent) => void;
        readonly isEmbedVideo: (itemSrc: string) => boolean;
        readonly isLocalVideo: (itemSrc: string) => boolean;
    }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-internal-close-overlay" | "silentbox-internal-get-next-item" | "silentbox-internal-get-prev-item")[], "silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-internal-close-overlay" | "silentbox-internal-get-next-item" | "silentbox-internal-get-prev-item", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
        item: {
            type: any;
            required: true;
        };
        visible: {
            type: BooleanConstructor;
            required: true;
        };
        currentItem: {
            type: NumberConstructor;
            required: true;
        };
        totalItems: {
            type: NumberConstructor;
            required: true;
        };
    }>> & {
        "onSilentbox-overlay-opened"?: (...args: any[]) => any;
        "onSilentbox-overlay-hidden"?: (...args: any[]) => any;
        "onSilentbox-internal-close-overlay"?: (...args: any[]) => any;
        "onSilentbox-internal-get-next-item"?: (...args: any[]) => any;
        "onSilentbox-internal-get-prev-item"?: (...args: any[]) => any;
    }, {}>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-overlay-next-item-displayed" | "silentbox-overlay-prev-item-displayed")[], "silentbox-overlay-opened" | "silentbox-overlay-hidden" | "silentbox-overlay-next-item-displayed" | "silentbox-overlay-prev-item-displayed", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    lazyLoading: {
        type: BooleanConstructor;
        required: false;
    };
    previewCount: {
        type: NumberConstructor;
        required: false;
    };
    fallbackThumbnail: {
        type: StringConstructor;
        required: false;
    };
    gallery: {
        type: ArrayConstructor;
        required: false;
    };
    image: {
        type: any;
        required: false;
    };
}>> & {
    "onSilentbox-overlay-opened"?: (...args: any[]) => any;
    "onSilentbox-overlay-hidden"?: (...args: any[]) => any;
    "onSilentbox-overlay-next-item-displayed"?: (...args: any[]) => any;
    "onSilentbox-overlay-prev-item-displayed"?: (...args: any[]) => any;
}, {
    lazyLoading: boolean;
    image: any;
}>;
export default _sfc_main;
