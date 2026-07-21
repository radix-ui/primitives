// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
let passiveSupported = false;

if (typeof window !== 'undefined') {
  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported = true;
        return true;
      },
    });

    // @ts-expect-error
    window.addEventListener('test', options, options);
    // @ts-expect-error
    window.removeEventListener('test', options, options);
  } catch {
    passiveSupported = false;
  }
}

export const nonPassive = passiveSupported ? { passive: false } : false;
