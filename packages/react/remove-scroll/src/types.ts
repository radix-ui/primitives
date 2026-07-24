// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import type { Ref, RefObject } from 'react';
import type { ForwardRefExoticComponent } from 'react';
import type { RefAttributes } from 'react';

export type Axis = 'v' | 'h';
export type GapMode = 'padding' | 'margin';

export interface RemoveScrollEffectCallbacks {
  onScrollCapture(event: any): void;

  onWheelCapture(event: any): void;

  onTouchMoveCapture(event: any): void;
}

export interface ChildrenNode {
  /**
   * if forwardProps is false - children should be ReactNode
   * and it would be wrapper with a div
   * @see {@link IRemoveScrollSelfProps.as}
   */
  forwardProps?: false;
  children: React.ReactNode;
}

export interface ChildrenForward {
  /**
   * if forwardProps is true - everything will be forwarded to a single child node
   * otherwise - a Container, controlled by `as` prop will be rendered in place
   * @default false
   * @see {@link IRemoveScrollSelfProps.as}
   */
  forwardProps: true;
  children: React.ReactElement;
}

export interface IRemoveScrollSelfProps {
  ref?: Ref<HTMLElement>;
  /**
   * prevents 'position="relative"' being set on body
   * @default false
   */
  noRelative?: boolean;
  /**
   * disables "event isolation" (suppressing of events happening outside of the Lock)
   * @default false
   */
  noIsolation?: boolean;
  /**
   * enabled complete Lock isolation using `pointer-events:none` for anything outside the Lock
   * you probably don't need it, except you do
   * @default false
   * @see {IRemoveScrollSelfProps.noIsolation}
   */
  inert?: boolean;
  /**
   * allows pinch-zoom, however might work not perfectly for normal scroll
   */
  allowPinchZoom?: boolean;

  /**
   * switches on/off the behavior of the component
   */
  enabled?: boolean;

  /**
   * Controls the body scroll bar removal
   * @default false
   */
  removeScrollBar?: boolean;

  className?: string;
  style?: React.CSSProperties;

  /**
   * array of refs to other Elements, which should be considered as a part of the Lock
   */
  shards?: Array<React.RefObject<any> | HTMLElement>;
  /**
   * Control host node used for the lock.
   * @default 'div'
   */
  as?: string | React.ElementType;

  /**
   * controls the way "gap" is filled
   * @default "margin"
   */
  gapMode?: GapMode;
}

export type IRemoveScrollProps = IRemoveScrollSelfProps & (ChildrenForward | ChildrenNode);

export type IRemoveScrollUIProps = IRemoveScrollProps & {
  sideCar: React.FC<any>;
};

export interface IRemoveScrollEffectProps {
  noRelative?: boolean;
  noIsolation?: boolean;
  removeScrollBar?: boolean;
  allowPinchZoom: boolean;
  inert?: boolean;

  shards?: Array<React.RefObject<any> | HTMLElement>;

  lockRef: RefObject<HTMLElement | null>;
  gapMode?: GapMode;

  setCallbacks(cb: RemoveScrollEffectCallbacks): void;
}

interface WithClassNames {
  classNames: {
    fullWidth: string;
    zeroRight: string;
  };
}

type RefForwarded<T> = ForwardRefExoticComponent<T & RefAttributes<HTMLElement>> & WithClassNames;

export type RemoveScrollType = RefForwarded<IRemoveScrollProps>;

export type RemoveScrollUIType = RefForwarded<IRemoveScrollUIProps>;
