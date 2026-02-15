'use client';
import * as React from 'react';
import { DismissableLayer as DismissableLayerPrimitive } from 'radix-ui/internal';

export function Basic() {
  const [key, setKey] = React.useState('');
  return (
    <div>
      <button type="button" onClick={() => setKey(window.crypto.randomUUID())}>
        Reset State
      </button>
      <hr />
      <DismissableLayerImpl key={key} />
    </div>
  );
}

function DismissableLayerImpl() {
  const [disableOutsidePointerEvents, setDisableOutsidePointerEvents] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  return (
    <div>
      {dismissed && <p>Dismissed!</p>}

      <hr />
      <DismissableLayerPrimitive.Root
        asChild
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        onEscapeKeyDown={(event) => {
          console.log('escape key down', event);
        }}
        onPointerDownOutside={(event) => {
          console.log('pointer down outside', event);
        }}
        onFocusOutside={(event) => {
          console.log('focus outside', event);
        }}
        onInteractOutside={(event) => {
          console.log('interact outside', event);
        }}
        onDismiss={() => {
          setDismissed(true);
          console.log('dismiss');
        }}
      >
        <div>
          <p>Hello!</p>
          <label>
            <input
              type="checkbox"
              checked={disableOutsidePointerEvents}
              onChange={() =>
                setDisableOutsidePointerEvents(
                  (disableOutsidePointerEvents) => !disableOutsidePointerEvents,
                )
              }
            />
            Disable Outside Pointer Events
          </label>
        </div>
      </DismissableLayerPrimitive.Root>
    </div>
  );
}
