import * as React from 'react';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'AspectRatio';
const DEFAULT_TAG = 'div';

type AspectRatioOwnProps = {
  ratio?: number;
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-aspect-ratio
   */
  selector?: string | null;
};

const AspectRatio = forwardRefWithAs<typeof DEFAULT_TAG, AspectRatioOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = DEFAULT_TAG,
      selector = getSelector(NAME),
      ratio = 1 / 1,
      style,
      children,
      ...aspectRatioProps
    } = props;

    return (
      <div
        style={{
          // ensures inner element is contained
          position: 'relative',
          // ensures padding bottom trick maths works
          width: '100%',
          paddingBottom: `${100 / ratio}%`,
        }}
      >
        <Comp
          {...aspectRatioProps}
          {...getSelectorObj(selector)}
          ref={forwardedRef}
          style={{
            ...style,
            // ensures children expand in ratio
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          {children}
        </Comp>
      </div>
    );
  }
);

AspectRatio.displayName = NAME;

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
