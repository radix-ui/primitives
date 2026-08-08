// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import { RemoveScroll as RemoveScrollImpl } from './ui.js';
import { SideCar } from './sidecar.js';
import type { IRemoveScrollProps as RemoveScrollProps, RemoveScrollType } from './types.js';

const RemoveScroll: RemoveScrollType = React.forwardRef<HTMLElement, RemoveScrollProps>(
  (props, ref) => <RemoveScrollImpl {...props} ref={ref} sideCar={SideCar} />,
) as any;

RemoveScroll.classNames = RemoveScrollImpl.classNames;

export { RemoveScroll, RemoveScroll as Root };
export type { RemoveScrollProps };
