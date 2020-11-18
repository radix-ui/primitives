import * as React from 'react';
import { forwardRefWithAs } from './forwardRefWithAs';

type ButtonProps = React.ComponentProps<'button'> & {
  isDisabled?: boolean;
};

const Button = forwardRefWithAs<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { as: Comp = 'button' } = props;
  return <Comp {...props} ref={forwardedRef} />;
});

type LinkProps = React.ComponentProps<'a'> & {
  isPrimary?: boolean;
  onToggle?(isOpen: boolean): void;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { children, isPrimary, ...rest } = props;
  return (
    <a className={isPrimary ? 'primary' : undefined} ref={ref} {...rest}>
      {children}
    </a>
  );
});

const ExtendedButton = forwardRefWithAs<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button> & { isExtended: boolean }
>((props, forwardedRef) => {
  return <Button {...props} ref={forwardedRef} />;
});

export function Test() {
  return (
    <>
      {/* 🟢 Link has onToggle prop */}
      <Link onToggle={(isOpen) => console.log(isOpen)} />
      {/* 🟢 Link has isPrimary prop */}
      <Link isPrimary />
      {/* 🔴 Button does not have href prop */}
      {/* @ts-expect-error */}
      <Button href="#" />
      {/* 🟢 Button has form prop */}
      <Button form="form" />
      {/* 🟢 Button has isDisabled prop */}
      <Button isDisabled />
      {/* 🟢 Button as "a" has href prop */}
      <Button as="a" href="#" />
      {/* 🔴 Button as "a" does not have form prop */}
      {/* @ts-expect-error */}
      <Button as="a" form="form" />
      {/* 🟢 Button as Link has href prop */}
      <Button as={Link} href="#" />
      {/* 🟢 Button as Link has isPrimary prop */}
      <Button as={Link} isPrimary />
      {/* 🟢 Button as Link has isDisabled prop */}
      <Button as={Link} isDisabled />
      {/* 🔴 Button as Link does not have form prop */}
      {/* @ts-expect-error */}
      <Button as={Link} form="form" />
      {/* 🟢 Button has onClick prop */}
      <Button onClick={(event) => event.currentTarget.form} />
      {/* 🟢 Button as "a" has onClick prop */}
      <Button as="a" onClick={(event) => event.currentTarget.href} />
      {/* 🟢 Button as Link has onClick prop, but it must be explicitly typed */}
      <Button as={Link} onClick={(event: React.MouseEvent<HTMLAnchorElement>) => event.altKey} />
      {/* 🔴 ExtendedButton should have isExtended prop */}
      {/* @ts-expect-error */}
      <ExtendedButton />
      {/* 🟢 ExtendedButton has isExtended prop */}
      <ExtendedButton isExtended={true} />
      {/* 🟢 ExtendedButton has onClick prop */}
      <ExtendedButton isExtended={true} onClick={(event) => event.currentTarget.form} />
    </>
  );
}
