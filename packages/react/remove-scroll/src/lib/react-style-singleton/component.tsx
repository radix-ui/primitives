// Fork of https://github.com/theKashey/react-style-singleton
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import { styleHookSingleton } from './hook.js';

type Props = {
  /**
   * styles to apply
   */
  styles: string;
  /**
   * marks style as dynamic, so it will be reapplied on styles change
   * note: this is not expected behavior from a "singleton"
   * @default false
   */
  dynamic?: boolean;
};

/**
 * create a Component to add styles on demand
 * - styles are added when first instance is mounted
 * - styles are removed when the last instance is unmounted
 * - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
 */
export const styleSingleton = () => {
  const useStyle = styleHookSingleton();

  const Sheet: React.FC<Props> = ({ styles, dynamic }) => {
    useStyle(styles, dynamic);

    return null;
  };

  return Sheet;
};
