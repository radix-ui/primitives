// Fork of https://github.com/theKashey/react-style-singleton
// MIT License, Copyright (c) Anton Korzunov
import { getNonce } from './get-nonce.js';

type NullableStyle = HTMLStyleElement | null;

function makeStyleTag(): NullableStyle {
  if (!document) return null;

  const tag = document.createElement('style');
  tag.type = 'text/css';

  const nonce = getNonce();

  if (nonce) {
    tag.setAttribute('nonce', nonce);
  }

  return tag;
}

function injectStyles(tag: HTMLStyleElement, css: string) {
  // @ts-ignore
  if (tag.styleSheet) {
    // @ts-ignore
    tag.styleSheet.cssText = css;
  } else {
    tag.appendChild(document.createTextNode(css));
  }
}

function insertStyleTag(tag: HTMLStyleElement): void {
  const head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(tag);
}

export const stylesheetSingleton = (): {
  add: (style: string) => void;
  remove: () => void;
} => {
  let counter = 0;
  let stylesheet: NullableStyle = null;

  return {
    add: (style) => {
      if (counter == 0) {
        if ((stylesheet = makeStyleTag())) {
          injectStyles(stylesheet, style);
          insertStyleTag(stylesheet);
        }
      }

      counter++;
    },
    remove: () => {
      counter--;

      if (!counter && stylesheet) {
        stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
        stylesheet = null;
      }
    },
  };
};
