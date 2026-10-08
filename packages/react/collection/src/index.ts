'use client';
export { createCollection } from './collection-legacy';
export type { CollectionProps } from './collection-legacy';

export { createCollection as unstable_createCollection } from './collection';
export type {
  CollectionSlotProps as unstable_CollectionSlotProps,
  CollectionDict as unstable_CollectionDict,
} from './collection';
