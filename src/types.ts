export interface ItemProps {
  src: string,
  srcSet?: string[],
  thumbnailWidth: number,
  thumbnailHeight: number,
  thumbnail?: string,
  alt?: string,
  autoplay?: boolean,
  controls?: boolean,
  description?: string
}
export interface OverlayEventProps {
  item: ItemProps
}
