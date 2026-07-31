// Fork of https://github.com/theKashey/react-style-singleton
// MIT License, Copyright (c) Anton Korzunov
let currentNonce: string | undefined;

export const setNonce = (nonce: string) => {
  currentNonce = nonce;
};

declare var __webpack_nonce__: string;

export const getNonce = () => {
  // local value is most important
  if (currentNonce) {
    return currentNonce;
  }

  // build in webpack support
  if (typeof __webpack_nonce__ !== 'undefined') {
    return __webpack_nonce__;
  }

  // parcel does not support nonce by itself

  // rollup does not support nonce by itself

  return undefined;
};
