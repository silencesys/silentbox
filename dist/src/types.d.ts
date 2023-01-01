export interface ItemProps {
    src: string;
    srcSet?: string[];
    thumbnailWidth: number;
    thumbnailHeight: number;
    thumbnail?: string;
    alt?: string;
    description?: string;
    autoplay?: boolean;
    controls?: boolean;
    download?: boolean | string;
}
export interface OverlayEventProps {
    item: ItemProps;
}
export interface SilentBoxOptions {
    downloadButtonLabel?: string;
}
