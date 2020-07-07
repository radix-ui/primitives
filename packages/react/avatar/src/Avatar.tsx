import * as React from 'react';

type AvatarDOMProps = React.ComponentPropsWithRef<'div'>;
type AvatarOwnProps = {};
type AvatarProps = AvatarDOMProps & AvatarOwnProps;

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };
