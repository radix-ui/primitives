import * as React from 'react';
import { render } from '@testing-library/react';
import { extendPrimitive } from './extendPrimitive';
import { Primitive } from './Primitive';

import type { RenderResult } from '@testing-library/react';
import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

type ButtonProps = { isDisabled?: boolean };
type ButtonPrimitive = Polymorphic.ForwardRefComponent<'button', ButtonProps>;

const Button = React.forwardRef((props, forwardedRef) => {
  const { as: Comp = 'button', isDisabled, ...buttonProps } = props;
  return <Comp {...buttonProps} ref={forwardedRef} />;
}) as ButtonPrimitive;

/* -------------------------------------------------------------------------------------------------
 * Extend `Primitive` as another element type
 * -----------------------------------------------------------------------------------------------*/

const PrimitiveAsButton = extendPrimitive(Primitive, { defaultProps: { as: 'button' } });

/* -------------------------------------------------------------------------------------------------
 * Extended Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButton = extendPrimitive(Button, { displayName: 'ExtendedButton' });

/* -------------------------------------------------------------------------------------------------
 * Extended Polymorphic Button with default props
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonDefaultProps = extendPrimitive(Button, {
  defaultProps: { type: 'submit' },
  displayName: 'ExtendedButton',
});

/* -------------------------------------------------------------------------------------------------
 * Normal Link
 * -----------------------------------------------------------------------------------------------*/

type LinkProps = React.ComponentProps<'a'> & {
  isPrimary?: boolean;
  onToggle?(open: boolean): void;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { children, isPrimary, ...linkProps } = props;
  return (
    <a className={isPrimary ? 'primary' : undefined} ref={ref} {...linkProps}>
      {children}
    </a>
  );
});

/* -----------------------------------------------------------------------------------------------*/

export function Test() {
  return (
    <>
      {/* ExtendedButton as Link does not accept form prop */}
      {/* @ts-expect-error */}
      <ExtendedButton as={Link} form="form" />

      {/* ExtendedButton does not accept href prop */}
      {/* @ts-expect-error */}
      <ExtendedButton href="#" />

      {/* ExtendedButton accepts form prop */}
      <ExtendedButton form="form" />

      {/* ExtendedButton accepts isDisabled prop */}
      <ExtendedButton isDisabled />

      {/* ExtendedButton as "a" accepts href prop */}
      <ExtendedButton as="a" href="#" />

      {/* ExtendedButton as "a" does not accept form prop */}
      {/* @ts-expect-error */}
      <ExtendedButton as="a" form="form" />

      {/* ExtendedButton as Link accepts href prop */}
      <ExtendedButton as={Link} href="#" />

      {/* ExtendedButton as Link accepts isPrimary prop */}
      <ExtendedButton as={Link} isPrimary />

      {/* ExtendedButton as Link accepts isDisabled prop */}
      <ExtendedButton as={Link} isDisabled />

      {/* ExtendedButton as Link does not accept form prop */}
      {/* @ts-expect-error */}
      <ExtendedButton as={Link} form="form" />

      {/* PrimitiveAsButton accepts type prop */}
      <PrimitiveAsButton type="submit" />
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

describe('Given an extended component with default as prop', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<PrimitiveAsButton />);
  });

  it('should be a button element', () => {
    expect(rendered.container.firstChild).toBeInstanceOf(HTMLButtonElement);
  });
});
