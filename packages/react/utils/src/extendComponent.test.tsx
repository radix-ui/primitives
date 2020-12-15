import * as React from 'react';
import { render } from '@testing-library/react';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { extendComponent } from './extendComponent';

import type { RenderResult } from '@testing-library/react';

/* -------------------------------------------------------------------------------------------------
 * Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

type ButtonProps = {
  isDisabled?: boolean;
};

const Button = forwardRefWithAs<'button', ButtonProps>((props, forwardedRef) => {
  const { as: Comp = 'button', isDisabled, ...buttonProps } = props;
  return <Comp {...buttonProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * Extended Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButton = extendComponent(Button, 'ExtendedButton');

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
    </>
  );
}

describe('Given extended components via extendComponent', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Test />);
  });

  it('should render', async () => {
    expect(rendered.container.firstChild).toBeInTheDocument();
  });
});
