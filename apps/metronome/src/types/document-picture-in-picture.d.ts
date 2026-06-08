// Document Picture-in-Picture API — not yet part of TS lib.dom
// https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API

interface DocumentPictureInPictureOptions {
  width?: number;
  height?: number;
  disallowReturnToOpener?: boolean;
  preferInitialWindowPlacement?: boolean;
}

interface DocumentPictureInPictureEventMap {
  enter: Event;
}

interface DocumentPictureInPicture extends EventTarget {
  readonly window: Window | null;
  requestWindow(options?: DocumentPictureInPictureOptions): Promise<Window>;
  addEventListener<K extends keyof DocumentPictureInPictureEventMap>(
    type: K,
    listener: (event: DocumentPictureInPictureEventMap[K]) => void
  ): void;
  removeEventListener<K extends keyof DocumentPictureInPictureEventMap>(
    type: K,
    listener: (event: DocumentPictureInPictureEventMap[K]) => void
  ): void;
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture;
}
