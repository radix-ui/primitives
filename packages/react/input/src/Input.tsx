import React from 'react';
import { log } from '@interop-ui/utils';

type InputProps = React.ComponentPropsWithRef<'input'>;

function Input(props: InputProps) {
  log('input');
  return <input {...props} style={{ color: 'royalblue', ...props.style }} />;
}

export type { InputProps };
export { Input };
