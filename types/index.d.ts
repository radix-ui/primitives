declare module 'json-to-css';

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  observe: (target: Element, options?: ResizeObserverOptions) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
}

type ResizeObserverBoxOptions = 'border-box' | 'content-box' | 'device-pixel-content-box';

interface ResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ResizeObserverSize[] | ResizeObserverSize;
  readonly contentBoxSize: ResizeObserverSize[] | ResizeObserverSize;
  readonly devicePixelContentBoxSize: ResizeObserverSize[];
}

interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface Window {
  ResizeObserver: typeof ResizeObserver;
}
