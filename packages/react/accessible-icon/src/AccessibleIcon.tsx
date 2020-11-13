import * as React from 'react';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'AccessibleIcon';
const DEFAULT_TAG = 'span';

type AccessibleIconDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type AccessibleIconOwnProps = { label: string };
type AccessibleIconProps = AccessibleIconDOMProps & AccessibleIconOwnProps;

const AccessibleIcon = forwardRef<typeof DEFAULT_TAG, AccessibleIconProps>(function AccessibleIcon(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, children, label, ...iconProps } = props;
  const child = React.Children.only(children);

  return (
    <Comp {...getPartDataAttrObj('root')} ref={forwardedRef} {...iconProps}>
      {React.cloneElement(child as React.ReactElement, {
        // accessibility
        'aria-hidden': true,
        focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
      })}
      <VisuallyHidden>{label}</VisuallyHidden>
    </Comp>
  );
});

AccessibleIcon.displayName = NAME;

const [styles, getPartDataAttrObj] = createStyleObj(NAME, {
  root: {
    // ensures child icon is contained correctly
    display: 'inline-flex',
    // better default alignment
    verticalAlign: 'middle',
  },
});

export { styles, AccessibleIcon };
export type { AccessibleIconProps };
