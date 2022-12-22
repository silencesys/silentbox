import type { ItemProps } from '../types';
export interface OverlayProps {
    item: ItemProps;
    visible: boolean;
    currentItem: number;
    totalItems: number;
}
declare const _sfc_main: import("vue").DefineComponent<{
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
export default _sfc_main;
