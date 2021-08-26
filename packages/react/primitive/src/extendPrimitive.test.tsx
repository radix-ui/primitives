import * as React from 'react';
import { render } from '@testing-library/react';
import { extendPrimitive } from './extendPrimitive';
import { Primitive } from './Primitive';

import type { RenderResult } from '@testing-library/react';
import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 *  Button
 * -----------------------------------------------------------------------------------------------*/

type ButtonElement = React.ElementRef<typeof Primitive.button>;
type ButtonProps = Radix.MergeProps<
  React.ComponentProps<typeof Primitive.button>,
  { isDisabled?: boolean }
>;

const Button = React.forwardRef<ButtonElement, ButtonProps>((props, forwardedRef) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDisabled, ...buttonProps } = props;
  return <Primitive.button {...buttonProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * Extended Button
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButton = extendPrimitive(Button, { displayName: 'ExtendedButton' });

/* -------------------------------------------------------------------------------------------------
 * Extended Button with default props
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonDefaultProps = extendPrimitive(Button, {
  defaultProps: { type: 'submit' },
  displayName: 'ExtendedButton',
});

/* -----------------------------------------------------------------------------------------------*/

export function Test() {
  return (
    <>
      {/* ExtendedButton does not accept href prop */}
      {/* @ts-expect-error */}
      <ExtendedButton href="#" />

      {/* ExtendedButton accepts form prop */}
      <ExtendedButton form="form" />

      {/* ExtendedButton accepts isDisabled prop */}
      <ExtendedButton isDisabled />
    </>
  );
}

describe('Given extended components via extendPrimitive', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Test />);
  });

  it('should render', () => {
    expect(rendered.container.firstChild).toBeInTheDocument();
  });
});

describe('Given an extended component with default props', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<ExtendedButtonDefaultProps />);
  });

  it('should have the default attributes', () => {
    expect(rendered.container.firstChild).toHaveAttribute('type', 'submit');
  });
});
