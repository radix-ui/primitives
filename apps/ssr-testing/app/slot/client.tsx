'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';

export const Link = React.forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentProps<'a'> & { asChild?: boolean }
>(({ asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'a';
  return <Comp {...props} ref={forwardedRef} />;
});

export const LinkSlottable = React.forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentProps<'a'> & { asChild?: boolean }
>(({ asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp {...props} ref={forwardedRef}>
      <span>left</span>
      <Slot.Slottable>{props.children}</Slot.Slottable>
      <span>right</span>
    </Comp>
  );
});

export const LinkButton = React.forwardRef<
  React.ComponentRef<typeof Link>,
  React.ComponentProps<typeof Link>
>((props, forwardedRef) => (
  <Button asChild>
    <Link {...props} ref={forwardedRef}>
      {props.children}
    </Link>
  </Button>
));

export const Button = React.forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props} ref={forwardedRef} style={{ display: 'flex', gap: '3rem' }} />;
});

export const ButtonSlottable = React.forwardRef<
  React.ComponentRef<'button'>,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp {...props} ref={forwardedRef} style={{ display: 'flex', gap: '3rem' }}>
      <span>left</span>
      <Slot.Slottable>{children}</Slot.Slottable>
      <span>right</span>
    </Comp>
  );
});

export const ButtonNestedSlottable = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ children, asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp {...props} ref={forwardedRef} style={{ display: 'flex', gap: '3rem' }}>
      <Slot.Slottable child={children}>
        {(slottable) => (
          <>
            <span>left</span>
            <b>bold {slottable}</b>
            <span>right</span>
          </>
        )}
      </Slot.Slottable>
    </Comp>
  );
});

export const IconButtonNestedSlottable = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ children, ...props }, forwardedRef) => {
  return (
    <Button {...props} ref={forwardedRef} style={{ display: 'flex', gap: '3rem' }}>
      <Slot.Root>
        <Slot.Slottable child={children}>
          {(slottable) => (
            <>
              <span>ICON</span>
              <b>bold {slottable}</b>
            </>
          )}
        </Slot.Slottable>
      </Slot.Root>
    </Button>
  );
});
