import * as React from 'react';
import { Popover, styles } from './Popover';

export default { title: 'Popover' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <button ref={anchorRef} onClick={() => setIsOpen(true)}>
        open
      </button>

      {isOpen && (
        <Popover
          anchorRef={anchorRef}
          onClose={() => setIsOpen(false)}
          style={{ ...styles.root, backgroundColor: '#eee', width: 250, height: 150 }}
        >
          <button onClick={() => setIsOpen(false)}>close</button>
          <Popover.Arrow width={50} height={20} style={{ ...styles.arrow }} />
        </Popover>
      )}
    </div>
  );
};

export const Nested = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isNestedOpen, setIsNestedOpen] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const nestedButtonRef = React.useRef<HTMLButtonElement>(null);

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

      <button type="button" ref={buttonRef} onClick={() => setIsOpen(true)}>
        {!isOpen ? 'Open' : 'Close'} popover
      </button>

      {isOpen ? (
        <Popover
          anchorRef={buttonRef}
          onClose={() => setIsOpen(false)}
          sideOffset={10}
          style={{ ...styles.root, backgroundColor: 'royalblue', padding: 30, borderRadius: 5 }}
        >
          <Popover.Arrow offset={20} style={{ ...styles.arrow, fill: 'royalblue' }} />
          <button type="button" onClick={() => setIsOpen(false)} style={{ marginRight: 10 }}>
            close
          </button>
          <button type="button" ref={nestedButtonRef} onClick={() => setIsNestedOpen(true)}>
            {!isNestedOpen ? 'Open' : 'Close'} nested popover
          </button>
        </Popover>
      ) : null}

      {isNestedOpen ? (
        <Popover
          anchorRef={nestedButtonRef}
          onClose={() => setIsNestedOpen(false)}
          side="top"
          align="center"
          sideOffset={10}
          style={{ ...styles.root, backgroundColor: 'tomato', padding: 30, borderRadius: 5 }}
        >
          <Popover.Arrow offset={20} style={{ ...styles.arrow, fill: 'tomato' }} />
          <button type="button" onClick={() => setIsNestedOpen(false)}>
            close
          </button>
        </Popover>
      ) : null}
    </div>
  );
};

export const FocusTest = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  return (
    <>
      <button style={{ marginRight: 10 }} onClick={() => (document.activeElement as any)?.blur()}>
        Blur
      </button>
      <button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Open Popover
      </button>
      {isOpen ? (
        <Popover
          anchorRef={buttonRef}
          onClose={() => setIsOpen(false)}
          style={{ ...styles.root, backgroundColor: '#eee', width: 250, height: 150 }}
        >
          <button
            style={{ marginRight: 10 }}
            onClick={() => (document.activeElement as any)?.blur()}
          >
            Blur
          </button>
        </Popover>
      ) : null}
    </>
  );
};
