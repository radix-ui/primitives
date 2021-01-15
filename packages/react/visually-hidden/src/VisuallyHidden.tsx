import * as React from 'react';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

const NAME = 'VisuallyHidden';
const DEFAULT_TAG = 'span';

type VisuallyHiddenOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-visually-hidden
   */
  selector?: string | null;
};

const VisuallyHidden = forwardRefWithAs<typeof DEFAULT_TAG, VisuallyHiddenOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = DEFAULT_TAG,
      selector = getSelector(NAME),
      style,
      ...visuallyHiddenProps
    } = props;
    return (
      <Comp
        {...visuallyHiddenProps}
        {...getSelectorObj(selector)}
        ref={forwardedRef}
        style={{
          ...style,
          // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
          position: 'absolute',
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
        }}
      />
    );
  }
);

VisuallyHidden.displayName = NAME;

const Root = VisuallyHidden;

export {
  VisuallyHidden,
  //
  Root,
};
