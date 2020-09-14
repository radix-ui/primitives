import * as React from 'react';
import { Popover, styles } from './Popover';

import type { PopoverTargetProps } from './Popover';

export default { title: 'Popover' };

export const Basic = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <Popover.Target as={Button}>open</Popover.Target>
        <Popover.Position style={{ ...styles.position }} sideOffset={10}>
          <Popover.Content
            style={{
              ...styles.content,
              backgroundColor: '#eee',
              width: 250,
              height: 150,
              padding: 20,
              border: '10px solid tomato',
            }}
          >
            <Popover.Close as={Button}>close</Popover.Close>
          </Popover.Content>
          <Popover.Arrow width={50} height={20} style={{ ...styles.arrow }} />
        </Popover.Position>
      </Popover>
    </div>
  );
};

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover isOpen={isOpen} onIsOpenChange={setIsOpen}>
        <Popover.Target as={Button}>{isOpen ? 'close' : 'open'}</Popover.Target>
        <Popover.Position style={{ ...styles.position }}>
          <Popover.Content
            style={{ ...styles.content, backgroundColor: '#eee', width: 250, height: 150 }}
          >
            <Popover.Close as={Button}>close</Popover.Close>
          </Popover.Content>
          <Popover.Arrow width={50} height={20} style={{ ...styles.arrow }} />
        </Popover.Position>
      </Popover>
    </div>
  );
};

export const Nested = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        height: '300vh',
        width: '300vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        type="button"
        style={{ position: 'fixed', top: 10, left: 10 }}
        onClick={() => buttonRef.current?.focus()}
      >
        Focus popover button
      </button>

      <Popover>
        <Popover.Target type="button" ref={buttonRef}>
          Open popover
        </Popover.Target>

        <Popover.Position sideOffset={10} style={{ ...styles.position }}>
          <Popover.Content
            style={{
              ...styles.content,
              backgroundColor: 'royalblue',
              padding: 30,
              borderRadius: 5,
            }}
          >
            <Popover.Close type="button" style={{ marginRight: 10 }}>
              close
            </Popover.Close>

            <Popover>
              <Popover.Target type="button">Open nested popover</Popover.Target>
              <Popover.Position
                side="top"
                align="center"
                sideOffset={10}
                style={{ ...styles.position }}
              >
                <Popover.Content
                  style={{
                    ...styles.content,
                    backgroundColor: 'tomato',
                    padding: 30,
                    borderRadius: 5,
                  }}
                >
                  <Popover.Close type="button">close</Popover.Close>
                </Popover.Content>
                <Popover.Arrow offset={20} style={{ ...styles.arrow, fill: 'tomato' }} />
              </Popover.Position>
            </Popover>
          </Popover.Content>
          <Popover.Arrow offset={20} style={{ ...styles.arrow, fill: 'royalblue' }} />
        </Popover.Position>
      </Popover>
    </div>
  );
};

export const FocusTest = () => {
  return (
    <>
      <button style={{ marginRight: 10 }} onClick={() => (document.activeElement as any)?.blur()}>
        Blur
      </button>
      <Popover>
        <Popover.Target as={Button}>Open Popover</Popover.Target>
        <Popover.Position style={{ ...styles.position }}>
          <Popover.Content
            style={{ ...styles.content, backgroundColor: '#eee', width: 250, height: 150 }}
          >
            <button
              style={{ marginRight: 10 }}
              onClick={() => (document.activeElement as any)?.blur()}
            >
              Blur
            </button>
          </Popover.Content>
        </Popover.Position>
      </Popover>
    </>
  );
};

const Button = React.forwardRef<HTMLButtonElement, PopoverTargetProps>(function Button(
  props,
  forwardedRef
) {
  return (
    <button
      ref={forwardedRef}
      style={{
        ...props.style,
        ...styles.target,
        border: '2px solid #999',
        padding: '5px 10px',
        borderRadius: 4,
      }}
      {...props}
    />
  );
});
