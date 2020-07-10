import * as React from 'react';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { cssReset } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type AccessibleIconDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AccessibleIconOwnProps = {
  label: string;
};
type AccessibleIconProps = AccessibleIconDOMProps & AccessibleIconOwnProps;

const AccessibleIcon = forwardRef<typeof DEFAULT_TAG, AccessibleIconProps>(function AccessibleIcon(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, children, label, ...iconProps } = props;
  const child = React.Children.only(children);
  const childIsValidElement = React.isValidElement(child);

  return (
    <Comp
      data-interop-part-accessible-icon=""
      aria-hidden={!childIsValidElement || undefined}
      ref={forwardedRef}
      {...iconProps}
    >
      {childIsValidElement
        ? React.cloneElement(child as React.ReactElement, {
            // accessibility
            'aria-hidden': true,
            focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
          })
        : child}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Comp>
  );
});

AccessibleIcon.displayName = 'AccessibleIcon';

const styles = {
  accessibleIcon: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, AccessibleIcon };
export type { AccessibleIconProps };
