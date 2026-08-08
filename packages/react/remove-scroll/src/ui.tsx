// Fork of https://github.com/theKashey/react-remove-scroll
// MIT License, Copyright (c) Anton Korzunov
import * as React from 'react';
import { fullWidthClassName, zeroRightClassName } from './lib/react-remove-scroll-bar/constants.js';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import type { SideCarComponent } from './lib/use-sidecar.js';
import { effectCar } from './medium.js';
import type {
  IRemoveScrollEffectProps,
  RemoveScrollEffectCallbacks,
  IRemoveScrollUIProps,
  RemoveScrollUIType,
  IRemoveScrollSelfProps,
} from './types.js';

export type { IRemoveScrollSelfProps, RemoveScrollUIType };

const nothing = () => {
  return;
};

/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */
const RemoveScroll: RemoveScrollUIType = React.forwardRef<HTMLElement, IRemoveScrollUIProps>(
  ({ enabled = true, removeScrollBar = true, inert = false, ...props }, parentRef) => {
    const ref = React.useRef<HTMLElement | null>(null);
    const [callbacks, setCallbacks] = React.useState<RemoveScrollEffectCallbacks>({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing,
    });

    const {
      forwardProps,
      children,
      className,
      shards,
      sideCar,
      noRelative,
      noIsolation,
      allowPinchZoom,
      as: Container = 'div',
      gapMode,
      ...rest
    } = props;

    const SideCar: SideCarComponent<IRemoveScrollEffectProps> = sideCar;

    const containerRef = useComposedRefs<any>(ref, parentRef);

    const containerProps = {
      ...rest,
      ...callbacks,
    };

    return (
      <React.Fragment>
        {enabled && (
          <SideCar
            sideCar={effectCar}
            removeScrollBar={removeScrollBar}
            shards={shards}
            noRelative={noRelative}
            noIsolation={noIsolation}
            inert={inert}
            setCallbacks={setCallbacks}
            allowPinchZoom={!!allowPinchZoom}
            lockRef={ref}
            gapMode={gapMode}
          />
        )}
        {forwardProps ? (
          React.cloneElement(React.Children.only(children as React.ReactElement), {
            ...containerProps,
            // @ts-expect-error
            ref: containerRef,
          })
        ) : (
          <Container {...containerProps} className={className} ref={containerRef}>
            {children}
          </Container>
        )}
      </React.Fragment>
    );
  },
) as any;

RemoveScroll.classNames = {
  fullWidth: fullWidthClassName,
  zeroRight: zeroRightClassName,
};

export { RemoveScroll };
