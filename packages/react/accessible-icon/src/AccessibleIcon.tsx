import * as React from 'react';
import { VisuallyHidden } from '@interop-ui/react-visually-hidden';

const NAME = 'AccessibleIcon';

type AccessibleIconOwnProps = {
  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   */
  label: string;
};

const AccessibleIcon: React.FC<AccessibleIconOwnProps> = ({ children, label }) => {
  const child = React.Children.only(children);
  return (
    <>
      {React.cloneElement(child as React.ReactElement, {
        // accessibility
        'aria-hidden': 'true',
        focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
      })}
      <VisuallyHidden>{label}</VisuallyHidden>
    </>
  );
};

AccessibleIcon.displayName = NAME;

const Root = AccessibleIcon;

export { AccessibleIcon, Root };
