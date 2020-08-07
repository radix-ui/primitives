export * from './arrayUtils';
export * from './cssReset';
export * from './domUtils';
export * from './geometry';
export * from './i18n';
export * from './logging';
export * from './number';
export * from './observeElementRect';
export * from './typeUtils';

export * from './types';

// TODO: Consider removing this if we can work with the babel plugin as intended
export const __DEV__ = process.env.NODE_ENV === 'development';
