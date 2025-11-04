'use client';
import * as React from 'react';
import { Portal } from 'radix-ui';
import { Popper } from 'radix-ui/internal';

export function Basic() {
  const [open, setOpen] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={animated}
          onChange={(event) => setAnimated(event.currentTarget.checked)}
        />
        Animated
      </label>
      <hr />
      <Scrollable>
        <Popper.Root>
          <Popper.Anchor className="PopperAnchor" onClick={() => setOpen(true)}>
            open
          </Popper.Anchor>

          {open && (
            <Popper.Content
              data-animated={animated || undefined}
              className="PopperContent"
              sideOffset={5}
            >
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className="PopperArrow" width={20} height={10} />
            </Popper.Content>
          )}
        </Popper.Root>
      </Scrollable>
    </div>
  );
}

export const WithCustomArrow = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className="PopperAnchor" onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className="PopperContent" side="right" sideOffset={5}>
            <button onClick={() => setOpen(false)}>close</button>
            <Popper.Arrow asChild offset={20}>
              <div
                style={{
                  width: 20,
                  height: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: 'tomato',
                }}
              />
            </Popper.Arrow>
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  );
};

export function WithPortal() {
  const [open, setOpen] = React.useState(false);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className="PopperAnchor" onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal.Root asChild>
            <Popper.Content className="PopperContent" sideOffset={5}>
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className="PopperArrow" width={20} height={10} />
            </Popper.Content>
          </Portal.Root>
        )}
      </Popper.Root>
    </Scrollable>
  );
}

export function WithUpdatePositionStrategyAlways() {
  const [open, setOpen] = React.useState(false);
  const [left, setLeft] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setLeft((prev) => (prev + 50) % 300);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor
          className="PopperAnchor"
          onClick={() => setOpen(true)}
          style={{ marginLeft: left }}
        >
          open
        </Popper.Anchor>

        {open && (
          <Portal.Root asChild>
            <Popper.Content
              className="PopperContent"
              sideOffset={5}
              updatePositionStrategy="always"
            >
              <button onClick={() => setOpen(false)}>close</button>
              <Popper.Arrow className="PopperArrow" width={20} height={10} />
            </Popper.Content>
          </Portal.Root>
        )}
      </Popper.Root>
    </Scrollable>
  );
}

function Scrollable(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200vh',
        ...props.style,
      }}
    />
  );
}
