import * as React from 'react';
import { render } from '@testing-library/react';
import { forwardRefWithAs } from './forwardRefWithAs';

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
 * Extended Button using react utilities without polymorphism
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButtonUsingReactUtils = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>((props, forwardedRef) => {
  return <Button {...props} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * Extended Button using react utilities without polymorphism and inline `as`
 * -----------------------------------------------------------------------------------------------*/
export function ExtendedButtonUsingReactUtilsWithInternalInlineAs(
  props: React.ComponentProps<typeof Button>
) {
  /* Should not error with inline `as` component */
  return <Button as={(props) => <button {...props} />} {...props} />;
}

/* -------------------------------------------------------------------------------------------------
 * Extended Polymorphic Button
 * -----------------------------------------------------------------------------------------------*/

const ExtendedButton = forwardRefWithAs<typeof Button, { isExtended?: boolean }>(
  (props, forwardedRef) => {
    const { isExtended, ...extendedButtonProps } = props;
    return <Button {...extendedButtonProps} ref={forwardedRef} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * Normal Link
 * -----------------------------------------------------------------------------------------------*/

type LinkProps = React.ComponentProps<'a'> & {
  isPrimary?: boolean;
  onToggle?(isOpen: boolean): void;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { children, isPrimary, ...linkProps } = props;
  return (
    <a className={isPrimary ? 'primary' : undefined} ref={ref} {...linkProps}>
      {children}
    </a>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Polymorphic Bold with required prop
 * -----------------------------------------------------------------------------------------------*/

type BoldProps = {
  requiredProp: boolean;
};

const Bold = forwardRefWithAs<'a', BoldProps>((props, forwardedRef) => {
  const { as: Comp = 'a', requiredProp, ...boldProps } = props;
  /* Does not expect requiredProp */
  return <Comp {...boldProps} ref={forwardedRef} />;
});

/* -----------------------------------------------------------------------------------------------*/

export function Test() {
  return (
    <>
      {/* Link accepts onToggle prop */}
      <Link onToggle={(isOpen) => console.log(isOpen)} />

      {/* Link accepts isPrimary prop */}
      <Link isPrimary />

      {/* Button does not accept href prop */}
      {/* @ts-expect-error */}
      <Button href="#" />

      {/* Button accepts form prop */}
      <Button form="form" />

      {/* Button accepts isDisabled prop */}
      <Button isDisabled />

      {/* Button as "a" accepts href prop */}
      <Button as="a" href="#" />

      {/* Button as "a" does not accept form prop */}
      {/* @ts-expect-error */}
      <Button as="a" form="form" />

      {/* Button as Link accepts href prop */}
      <Button as={Link} href="#" />

      {/* Button as Link accepts isPrimary prop */}
      <Button as={Link} isPrimary />

      {/* Button as Link accepts isDisabled prop */}
      <Button as={Link} isDisabled />

      {/* Button as Link does not accept form prop */}
      {/* @ts-expect-error */}
      <Button as={Link} form="form" />

      {/* Button accepts onClick prop */}
      <Button onClick={(event) => event.currentTarget.form} />

      {/* Button as "a" accepts onClick prop */}
      <Button as="a" onClick={(event) => event.currentTarget.href} />

      {/* Button as Link accepts onClick prop, but it must be explicitly typed */}
      <Button
        as={Link}
        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => event.altKey}
      />

      {/* ExtendedButton accepts isExtended prop */}
      <ExtendedButton isExtended />

      {/* ExtendedButton accepts isDisabled prop */}
      <ExtendedButton isDisabled />

      {/* ExtendedButton accepts onClick prop */}
      <ExtendedButton onClick={(event) => event.currentTarget.form} />

      {/* ExtendedButton as "a" accepts isExtended prop */}
      <ExtendedButton as="a" isExtended />

      {/* ExtendedButton as "a" accepts isDisabled prop */}
      <ExtendedButton as="a" isDisabled />

      {/* ExtendedButton as "a" accepts onClick prop */}
      <ExtendedButton as="a" onClick={(event) => event.currentTarget.href} />

      {/* ExtendedButtonUsingReactUtils accepts isDisabled prop */}
      <ExtendedButtonUsingReactUtils isDisabled />

      {/* ExtendedButtonUsingReactUtils accepts onClick prop */}
      <ExtendedButtonUsingReactUtils onClick={(event) => event.currentTarget.form} />

      {/* ExtendedButtonUsingReactUtils does not accept as prop */}
      {/* @ts-expect-error */}
      <ExtendedButtonUsingReactUtils as="a" isDisabled />

      {/* Bold expects requiredProp prop */}
      {/* @ts-expect-error */}
      <Bold />
    </>
  );
}

describe('Given forwardRefWithAs components', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Test />);
  });

  it('should render', async () => {
    expect(rendered.container.firstChild).toBeInTheDocument();
  });
});
