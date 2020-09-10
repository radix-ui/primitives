import * as React from 'react';
import { Popper, styles } from './Popper';
import { Portal } from '@interop-ui/react-portal';

export default { title: 'Popper' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <div ref={anchorRef} style={{ backgroundColor: 'hotpink', width: 100, height: 100 }}>
        <button onClick={() => setIsOpen(true)}>open</button>
      </div>

      {isOpen && (
        <Popper
          anchorRef={anchorRef}
          style={{ ...styles.root, backgroundColor: '#eee', width: 250, height: 150, padding: 20 }}
        >
          <button onClick={() => setIsOpen(false)}>close</button>
          <Popper.Arrow width={50} height={20} style={{ ...styles.arrow }} />
        </Popper>
      )}
    </div>
  );
};

export const WithPortal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <div ref={anchorRef} style={{ backgroundColor: 'hotpink', width: 100, height: 100 }}>
        <button onClick={() => setIsOpen(true)}>open</button>
      </div>

      {isOpen && (
        <Portal>
          <Popper
            anchorRef={anchorRef}
            style={{ ...styles.root, backgroundColor: '#eee', width: 250, height: 150 }}
          >
            <button onClick={() => setIsOpen(false)}>close</button>
            <Popper.Arrow width={50} height={20} style={{ ...styles.arrow }} />
          </Popper>
        </Portal>
      )}
    </div>
  );
};

export const WithCustomArrow = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200vh' }}
    >
      <div ref={anchorRef} style={{ backgroundColor: 'hotpink', width: 100, height: 100 }}>
        <button onClick={() => setIsOpen(true)}>open</button>
      </div>

      {isOpen && (
        <Popper
          anchorRef={anchorRef}
          side="right"
          style={{ ...styles.root, backgroundColor: '#eee', width: 250, height: 150 }}
        >
          <button onClick={() => setIsOpen(false)}>close</button>
          <Popper.Arrow as={MyArrow} width={50} height={20} style={{ ...styles.arrow }} />
        </Popper>
      )}
    </div>
  );
};

function MyArrow(props: any) {
  return (
    <div
      {...props}
      style={{
        ...props.style,
        width: 20,
        height: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'tomato',
      }}
    />
  );
}
