'use client';
import * as React from 'react';
import { FocusGuards as FocusGuardsPrimitive } from 'radix-ui/internal';

export function Basic() {
  const [disabled, setDisabled] = React.useState(false);
  return (
    <div>
      <button type="button" onClick={() => setDisabled((disabled) => !disabled)}>
        {disabled ? 'Enable' : 'Disable'} Focus Guards
      </button>
      <FocusGuards disabled={disabled}>
        <div>
          <p>Hello!</p>
        </div>
      </FocusGuards>
    </div>
  );
}

function FocusGuards({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  return disabled ? (
    children
  ) : (
    <FocusGuardsPrimitive.FocusGuards>{children}</FocusGuardsPrimitive.FocusGuards>
  );
}
