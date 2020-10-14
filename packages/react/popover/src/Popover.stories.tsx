import * as React from 'react';
import { Popover, styles } from './Popover';

import type { PopoverTriggerProps } from './Popover';

export default { title: 'Popover' };

export const Basic = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <Popover>
        <Popover.Trigger as={Button}>open</Popover.Trigger>
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
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}
    >
      <Popover isOpen={isOpen} onIsOpenChange={setIsOpen}>
        <Popover.Trigger as={Button}>{isOpen ? 'close' : 'open'}</Popover.Trigger>
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
        <Popover.Trigger type="button" ref={buttonRef}>
          Open popover
        </Popover.Trigger>

        <Popover.Position sideOffset={10} style={{ ...styles.position }}>
          <Popover.Content
            style={{
              ...styles.content,
              backgroundColor: 'royalblue',
              padding: 30,
              borderRadius: 5,
            }}
          >
            <Popover>
              <Popover.Trigger type="button">Open nested popover</Popover.Trigger>
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

            <Popover.Close type="button" style={{ marginLeft: 10 }}>
              close
            </Popover.Close>
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
        <Popover.Trigger as={Button}>Open Popover</Popover.Trigger>
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

export const CustomAnchor = () => {
  const itemBoxRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={itemBoxRef}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 250,
        padding: 20,
        margin: 100,
        backgroundColor: '#eee',
      }}
    >
      Item
      <Popover>
        <Popover.Trigger>open</Popover.Trigger>
        <Popover.Position
          style={{ ...styles.position }}
          anchorRef={itemBoxRef}
          side="right"
          sideOffset={1}
          align="start"
        >
          <Popover.Content
            style={{
              ...styles.content,
              backgroundColor: '#eee',
              width: 250,
              height: 150,
              padding: 20,
            }}
          >
            <Popover.Close>close</Popover.Close>
          </Popover.Content>
        </Popover.Position>
      </Popover>
    </div>
  );
};

const Button = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(function Button(
  props,
  forwardedRef
) {
  return (
    <button
      ref={forwardedRef}
      style={{
        ...props.style,
        ...styles.trigger,
        border: '2px solid #999',
        padding: '5px 10px',
        borderRadius: 4,
      }}
      {...props}
    />
  );
});
