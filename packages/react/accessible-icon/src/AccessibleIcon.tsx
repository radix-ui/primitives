import * as React from 'react';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

const NAME = 'AccessibleIcon';

type AccessibleIconProps = {
  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   */
  label: string;
};

const AccessibleIcon: React.FC<AccessibleIconProps> = ({ children, label }) => {
  const child = React.Children.only(children);
  return (
    <>
      {React.cloneElement(child as React.ReactElement, {
        // accessibility
        'aria-hidden': 'true',
        focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
      })}
      <VisuallyHiddenPrimitive.Root>{label}</VisuallyHiddenPrimitive.Root>
    </>
  );
};

AccessibleIcon.displayName = NAME;

const Root = AccessibleIcon;

export {
  AccessibleIcon,
  //
  Root,
};
