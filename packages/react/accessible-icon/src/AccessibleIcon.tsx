import * as React from 'react';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';

const NAME = 'AccessibleIcon';
const DEFAULT_TAG = 'span';

type AccessibleIconOwnProps = {
  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   */
  label: string;
};

const AccessibleIcon = forwardRefWithAs<typeof DEFAULT_TAG, AccessibleIconOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = DEFAULT_TAG, children, label, ...iconProps } = props;
    const child = React.Children.only(children);

    return (
      <Comp {...getPartDataAttrObj(NAME)} ref={forwardedRef} {...iconProps}>
        {React.cloneElement(child as React.ReactElement, {
          // accessibility
          'aria-hidden': true,
          focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
        })}
        <VisuallyHidden>{label}</VisuallyHidden>
      </Comp>
    );
  }
);

AccessibleIcon.displayName = NAME;

const Root = AccessibleIcon;

export { AccessibleIcon, Root };
