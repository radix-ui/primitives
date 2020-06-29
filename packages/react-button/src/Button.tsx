import React from 'react';
import { log } from '@interop-ui/utils';

type ButtonProps = React.ComponentPropsWithRef<'button'>;

function Button(props: ButtonProps) {
  log('button');
  return <button {...props} style={{ color: 'royalblue', ...props.style }} />;
}

export type { ButtonProps };
export { Button };
